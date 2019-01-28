import {ObjectID} from "bson";
import {BulkWriteOpResultObject, BulkWriteResult, Collection, MongoError} from "mongodb";
import {NextFunction, Request, Response} from "express";
import {User} from "../classes/user";
import {ApiErrorBody} from "../classes/apiErrorBody";
import { validation } from "../routes/validation/users";
import {ApiSuccessBody} from "../classes/apiSuccessBody";

const Joi = require("joi");

export class UsersService {
    usersCollection: Collection;

    constructor(db: any) {
        this.usersCollection = db.collection('users');
        this.usersCollection.createIndex({ 'email': 1, 'userName': 1 },{ unique: true, sparse: true });
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
    createUser(req: Request, res: Response, next: NextFunction) {
        Joi.validate(req, validation.createUser, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const { firstName, lastName, email, userName, password} = req.body;
            const user = new User(firstName, lastName, email, password, userName);
            console.log('user', user);
            return this.usersCollection.insert(user);
        }).then((success: any) => {
            res.status(201).send(new ApiSuccessBody('success', [`User created`], success.ops[0]));
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