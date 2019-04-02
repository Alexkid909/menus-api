import { AuthenticationError } from "../classes/internalErrors/authError";
import { Collection } from "mongodb";
import { NextFunction, Response } from "express";
import { validation } from "../routes/validation/users";
import { ApiSuccessBody } from "../classes/response/apiSuccessBody";
import { JwtService } from "./jwt.service";
import { CustomRequest } from "../classes/request/customRequest";

const bcrypt = require('bcrypt');

const Joi = require("joi");
const moment = require('moment');
const jwtService = new JwtService();

export class AuthService {
    usersCollection: Collection;
    loginsCollection: Collection;

    constructor(db: any) {
        this.usersCollection = db.collection('users');
        this.usersCollection.createIndex({ 'email': 1, 'username': 1 },{ unique: true, sparse: true });
        this.loginsCollection = db.collection('logins');
        this.loginsCollection.createIndex({ 'identityKey': 1},{ unique: true, sparse: true });
    }

    private canAuthenticate(key: string) {
        return this.loginsCollection.findOne({identityKey: key}).then((login: any) => {
            if(login) {

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
        });
    }

    static verifyAuthentication(req: any, res: Response, next: NextFunction) {


        if(req.path == '/authenticate') {
            next()
        } else {
            let token, payload;
            if(!req.headers.hasOwnProperty('authorization') || !req.headers.authorization) {
                res.status(401).send(new ApiSuccessBody('failure', ['User not authorized']))
            } else if (!req.headers.authorization.includes('Bearer ')) {
                res.status(401).send(new ApiSuccessBody('failure', ['Invalid auth type']))
            } else {
                token = req.headers.authorization.split(' ')[1];
                payload = jwtService.decode(token, 'quiet');
                if(!payload.sub || !payload.iss || req.clientIp !== payload.iss) {
                    console.log(payload, req.clientIp);
                    res.status(401).send(new ApiSuccessBody('failure', ['Authentication failure']))
                } else {
                    next();
                }
            }

        }
    }



    authenticateUser(req: any, res: Response, next: NextFunction) {
        const identityKey = `${req.body.username}-${req.clientIp}`;

        Joi.validate(req, validation.authenticateUser, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            return this.canAuthenticate(identityKey).then((success) => {
                console.log('cam auth', success);
                return success ?
                    Promise.resolve('passed') :
                    Promise.reject(  new AuthenticationError('Account locked', ['Sorry this account is temporarily locked, please try again later']));
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
                return Promise.reject( new AuthenticationError('No such user', ['Invalid username or password']));
            }
        }).then((success: any) => {
            if (success) {
                return Promise.resolve('You are now signed in');
            } else {
                this.failedLoginAttempt(identityKey, next);
                return Promise.reject(new AuthenticationError('Hash check failed', ['Invalid username or password']));
            }
        }).then((success: string) => {
            this.successfulLoginAttempt(identityKey, next);
            const payload = {
                iss: req.clientIp,
                sub: req.body.username
            };
            const token = jwtService.encode(payload, 'quiet');
            res.status(200).send(new ApiSuccessBody('success', [success], {username: req.username, token}));
        }).catch(next);
    }

}