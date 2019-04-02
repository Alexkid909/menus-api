import { Collection } from "mongodb";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../classes/request/customRequest";
import { User } from "../classes/user";
import { validation } from "../routes/validation/users";
import { ApiSuccessBody } from "../classes/response/apiSuccessBody";
import { JwtService } from "./jwt.service";

const bcrypt = require('bcrypt');

const Joi = require("joi");
const jwtService = new JwtService();


export class UsersService {
    usersCollection: Collection;

    constructor(db: any) {
        this.usersCollection = db.collection('users');
        this.usersCollection.createIndex({ 'email': 1, 'username': 1 },{ unique: true, sparse: true });
    }

    // getUsers(req: CustomRequest, res: Response, next: NextFunction) {
    //     this.usersCollection.find({}).toArray((err: any, result: any) => {
    //         (err) ? res.send(new ApiErrorBody()) : res.send(result);
    //     });
    // }
    //
    // getUser(req: CustomRequest, res: Response, next: NextFunction) {
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


    createUser(req: any, res: Response, next: NextFunction) {
        Joi.validate(req, validation.createUser, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then(() => {
            return bcrypt.hash(req.body.password, 16.5);
        }).then((hash: any) => {
            const { firstName, lastName, email, username} = req.body;
            const user = new User(firstName, lastName, email, hash, username);
            return this.usersCollection.insert(user);
        }).then((success: any) => {
            const user = success.ops[0];
            const payload = {
                iss: req.clientIp,
                sub: user.username
            };
            const token = jwtService.encode(payload, 'quiet');
            console.log('payload', payload);
            res.status(201).send(new ApiSuccessBody('success', [`User created`], {username: user.username, token}));
        }).catch(next);
    }

    //
    // deleteUser(req: CustomRequest, res: Response, next: NextFunction) {
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
    // updateUser(req: CustomRequest, res: Response, next: NextFunction) {
    //
    //     Joi.validate(req, validation.updateUser, (error: any, value: any) => {
    //         return (error) ? Promise.reject(error) : Promise.resolve(value);
    //     }).then((success: any) => {
    //         const user = new User(req.body.name, req.body.measurement);
    //         const details = {'_id': new ObjectID(req.params.userId)};
    //         return this.usersCollection.findOneAndUpdate(details, user, {returnOriginal: false})
    //     }, (error: any) => {
    //         const errorMessages = error.details.map((detail: any) => detail.message);
    //         res.status(400).send(new ApiErrorBody(errorMessages));
    //     }).then((success: any) => {
    //         res.send(new ApiSuccessBody('success', success.value));
    //     }).catch(next);
    // }
}