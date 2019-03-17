import {ObjectID} from "bson";
import {BulkWriteOpResultObject, BulkWriteResult, Collection, MongoError} from "mongodb";
import {NextFunction, Request, Response} from "express";
import {User} from "../classes/user";
import {ApiErrorBody} from "../classes/apiErrorBody";
import { validation } from "../routes/validation/users";
import {ApiSuccessBody} from "../classes/apiSuccessBody";
import {AuthenticationError} from "../classes/internalErrors/authError";
import { JwtService } from "./jwt.service";

const bcrypt = require('bcrypt');

const Joi = require("joi");
const moment = require('moment');
const jwtService = new JwtService();


export class UsersService {
    usersCollection: Collection;
    loginsCollection: Collection;

    constructor(db: any) {
        this.usersCollection = db.collection('users');
        this.usersCollection.createIndex({ 'email': 1, 'username': 1 },{ unique: true, sparse: true });
        this.loginsCollection = db.collection('logins');
        this.loginsCollection.createIndex({ 'identityKey': 1},{ unique: true, sparse: true });
    }

    // getUsers(req: Request, res: Response, next: NextFunction) {
    //     this.usersCollection.find({}).toArray((err: any, result: any) => {
    //         (err) ? res.send(new ApiErrorBody()) : res.send(result);
    //     });
    // }
    //
    // getUser(req: Request, res: Response, next: NextFunction) {
    //
    //     Joi.validate(req.body.password, new JoiPasswordComplexity(), (error: any, value: any) => {
    //         return (error) ? Promise.reject(error) : Promise.resolve(value);
    //     }).then((success: any) => {
    //         return Joi.validate(req, validation.getOrDeleteUser, (error: any, value: any) => {
    //             return (error) ? Promise.reject(error) : Promise.resolve(value);
    //         })
    //     }).then((success: any) => {
    //         const details = {'_id' : new ObjectID(req.params.userId)};
    //         return this.usersCollection.findOne(details);
    //     }, (error: any) => {
    //         const errorMessages = error.details.map((detail: any)  => detail.message);
    //         res.status(400).send(new ApiErrorBody(errorMessages));
    //     }).then((success: any) => {
    //         res.send(new ApiSuccessBody('success', ['Found user'], success));
    //     }).catch(next);
    // }
    //
    private canAuthenticate(key: string) {
        return this.loginsCollection.findOne({identityKey: key}).then((login: any) => {
            if(login) {

                // console.log('login.timeout', login.timeout);

                let underTimeout = false;
                if (login.hasOwnProperty('timeoutExpiry')) {
                    const timeoutExpiry = moment(login.timeoutExpiry).add(5, 'minutes').toDate();
                    console.log('timeoutExpiry', timeoutExpiry);
                    console.log('time to expiry', moment(new Date()).toDate() - timeoutExpiry);
                    underTimeout = (moment(new Date()).toDate() - timeoutExpiry) < 0;
                }

                console.log('underTimeout', underTimeout);

                if(login.failedAttempts < 5 && !underTimeout) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        });
    };

    private loginInProgress() {
        //@TODO implement setting login in progress and handling where there is a login in progress.
    }

    private failedLoginAttempt(key: string, next: NextFunction) {

        const query = {identityKey: key};
        // const update = {$inc: {failedAttempts: 1}, $currentDate: { timeout: true}};
        const update = {$inc: {failedAttempts: 1}};
        const options = {setDefaultsOnInsert: true, upsert: true, returnOriginal: false};
        this.loginsCollection.findOneAndUpdate(query, update, options).then((success: any) => {
            if(success.value.failedAttempts > 4) {
                console.log();
                const update = {
                    $set: {
                        failedAttempts: 0,
                        timeoutExpiry: new Date()
                    },
                };
                this.loginsCollection.findOneAndUpdate(query, update, options)
            }
        }, (error: any) => {
            console.log('error', error);
        }).catch(next)
    }

    private successfulLoginAttempt(key: string, next: NextFunction) {

        const query = {identityKey: key};
        const update = {$inc: {failedAttempts: 1}, $currentDate: {timeout: true}};


        this.loginsCollection.deleteOne(query).then((success: any) => {
            // console.log('success', success);
        });
    }




    createUser(req: Request, res: Response, next: NextFunction) {
        Joi.validate(req, validation.createUser, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            return bcrypt.hash(req.body.password, 16.5);
        }).then((hash: any) => {
            const { firstName, lastName, email, username} = req.body;
            const user = new User(firstName, lastName, email, hash, username);

            return this.usersCollection.insert(user);
        }).then((success: any) => {
            const user = success.ops[0];
            const payload = {
                iss: req.hostname,
                sub: user.username
            };
            const token = jwtService.encode(payload, 'quiet');
            console.log('success', success);
            res.status(201).send(new ApiSuccessBody('success', [`User created`], {username: user.username, token}));
        }).catch(next);
    }

    authenticateUser(req: any, res: Response, next: NextFunction) {
        const identityKey = `${req.body.username}-${req.clientIp}`;
        console.log('session', req.session);

        Joi.validate(req, validation.authenticateUser, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            return this.canAuthenticate(identityKey).then((success) => {
                console.log('cam auth', success);
                return success ?
                    Promise.resolve('passed') :
                    Promise.reject(  new AuthenticationError('Account locked', 'Sorry this account is temporarily locked, please try again later'));
            });
        }).then((success: any) => {
            console.log('can authenticate', success);
            const details = req.body.username ? {'username': req.body.username} : {'email': req.body.email};
            return this.usersCollection.findOne(details);
        }).then((success: any) => {
            if (success) {
                return bcrypt.compare(req.body.password, success.hashedPassword);
            } else {
                this.failedLoginAttempt(identityKey, next);
                return Promise.reject( new AuthenticationError('No such user', 'Invalid username or password'));
            }
        }).then((success: any) => {
            if (success) {
                return Promise.resolve('You are now signed in');
            } else {
                this.failedLoginAttempt(identityKey, next);
                return Promise.reject(new AuthenticationError('Hash check failed', 'Invalid username or password'));
            }
        }).then((success: string) => {
            console.log(success);
            this.successfulLoginAttempt(identityKey, next);
            res.status(200).send(new ApiSuccessBody('success', [success]));
        }).catch(next);
    }

    //
    // deleteUser(req: Request, res: Response, next: NextFunction) {
    //
    //     Joi.validate(req, validation.updateUser, (error: any, value: any) => {
    //         return (error) ? Promise.reject(error) : Promise.resolve(value);
    //     }).then((success: any) => {
    //         const details = {'_id' : new ObjectID(req.params.userId)};
    //         return this.usersCollection.findOneAndDelete(details)
    //     }, (error: any) => {
    //         const errorMessages = error.details.map((detail: any)  => detail.message);
    //         res.status(400).send(new ApiErrorBody(errorMessages));
    //         console.log(error);
    //     }).then((doc: any) => {
    //         console.log('doc', doc);
    //         const body = new ApiSuccessBody('success', []);
    //         body.newMessage(`User ${doc.value._id} deleted`);
    //         res.send(body);
    //     }).catch(next);
    // }
    //
    // updateUser(req: Request, res: Response, next: NextFunction) {
    //
    //     Joi.validate(req, validation.updateUser, (error: any, value: any) => {
    //         return (error) ? Promise.reject(error) : Promise.resolve(value);
    //     }).then((success: any) => {
    //         const user = new User(req.body.name, req.body.measurement);
    //         const details = {'_id': new ObjectID(req.params.userId)};
    //         return this.usersCollection.findOneAndUpdate(details, user)
    //     }, (error: any) => {
    //         const errorMessages = error.details.map((detail: any) => detail.message);
    //         res.status(400).send(new ApiErrorBody(errorMessages));
    //     }).then((success: any) => {
    //         res.send(new ApiSuccessBody('success', success.value));
    //     }).catch(next);
    // }
}