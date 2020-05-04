import { NextFunction, Response} from "express";
import { validation } from "../validation/users";
import { User } from "../../classes/user";
import { ApiSuccessBody } from "../../classes/response/apiSuccessBody";
import { HelperService } from "../../services/helpers.service";
import { AuthenticationError} from "../../classes/internalErrors/authError";
import { UsersService } from "../../services/users.service";
import { AuthService } from "../../services/auth.service";
import { CustomRequest } from "../../classes/request/customRequest";
import {TenantUsersService} from "../../services/tenant-users.service";
import {TenantsService} from "../../services/tenants.service";
import {TenantUserLink} from "../../classes/joins/tenantUserLink";

const bcrypt = require('bcrypt');
const Joi = require("joi");

export class UsersHandlers {
    usersService: UsersService;
    authService: AuthService;
    tenantUsersService: TenantUsersService;
    tenantsService: TenantsService;


    constructor(db: any) {
        this.usersService = new UsersService(db);
        this.authService = new AuthService(db);
        this.tenantUsersService = new TenantUsersService(db);
        this.tenantsService = new TenantsService(db);
    }

    getAllUsersHandler(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.createUser, HelperService.validationHandler).then(() => {
            return this.usersService.getAllUsers();
        }).catch(next);
    }

    getUserHandler(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getOrDeleteUser, HelperService.validationHandler).then(() => {
            return this.usersService.getUserById(new ObjectID(req.params.userId));
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Found user'], success));
        }).catch(next);
    }

    createUserHandler(req: any, res: Response, next: NextFunction) {
        Joi.validate(req, validation.createUser, HelperService.validationHandler).then(() => {
            return bcrypt.hash(req.body.password, 16.5);
        }).then((hash: any) => {
            const { firstName, lastName, email, userName} = req.body;
            const user = new User(firstName, lastName, email, hash, userName);
            return this.usersService.createUser(user);
        }).then((success: any) => {
            const user = success.ops[0];
            const token = this.authService.generateToken(req.clientIp, user._id.toHexString());
            res.status(201).send(new ApiSuccessBody('success', [`User created`], {userName: user.userName, token}));
        }).catch(next);
    }

    authenticateUserHandler(req: any, res: Response, next: NextFunction) {
        const identityKey = `${req.body.userName}-${req.clientIp}`;
        let userId: string;
        Joi.validate(req, validation.authenticateUser, HelperService.validationHandler)
            .then((success: any) => {
                return this.authService.canAuthenticate(identityKey).then((success) => {
                    return success ?
                        Promise.resolve('passed') :
                        Promise.reject(  new AuthenticationError('Account locked', ['Sorry this account is temporarily locked, please try again later']));
                });
            }).then((success: any) => {
            return req.body.userName ?
                this.usersService.getUserByName(req.body.userName) :
                this.usersService.getUserByEmail(req.body.email);
        }).then((success: any) => {
            if (success) {
                userId = success._id.toString();
                return bcrypt.compare(req.body.password, success.hashedPassword);
            } else {
                this.authService.failedLoginAttempt(identityKey, next);
                return Promise.reject( new AuthenticationError('No such user', ['Invalid username or password']));
            }
        }).then((success: any) => {
            if (success) {
                return Promise.resolve('You are now signed in');
            } else {
                this.authService.failedLoginAttempt(identityKey, next);
                return Promise.reject(new AuthenticationError('Hash check failed', ['Invalid Username or password']));
            }
        }).then((success: string) => {
            this.authService.successfulLoginAttempt(identityKey, next);
            const token = this.authService.generateToken(req.clientIp, userId);
            res.status(200).send(new ApiSuccessBody('success', [success], {userName: req.body.userName, token, userId}));
        }).catch(next);
    }


    // deleteUserHandler(req: CustomRequest, res: Response, next: NextFunction) {
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

    getUserTenantsHandler(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getOrDeleteUser, HelperService.validationHandler).then(() => {
            const userId = this.usersService.getUserIdFromAuth(req.headers.authorization);
            return this.tenantUsersService.getUserTenants(userId);
        }).then((success: any) => {
            const tenantIds = success.map((userTenant: TenantUserLink) => userTenant.tenantId);
            return this.tenantsService.getTenants(tenantIds);
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Found user'], success));
        }).catch(next);
    }
}