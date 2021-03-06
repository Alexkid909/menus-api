import { Collection, ObjectID } from "mongodb";
import { Tenant } from "../../classes/tenant";
import { ApiSuccessBody } from "../../classes/response/apiSuccessBody";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../../classes/request/customRequest";
import { validation } from "../../validation/routes/tenants";
import { HelperService } from "../../services/helpers.service";
import { UsersService } from "../../services/users.service";
import { DatabaseError } from "../../classes/internalErrors/databaseError";
import { TenantUsersService } from "../../services/tenant-users.service";
import EventEmitter = NodeJS.EventEmitter;
import emitter from "../../services/events.service";
import {TenantsService} from "../../services/tenants.service";

const Joi = require("joi");

export class TenantsHandlers {
    tenantsCollection: Collection;
    tenantsService: TenantsService;
    usersService: UsersService;
    tenantUsersService: TenantUsersService;
    emitter: EventEmitter;

    constructor(db: any) {
        this.usersService = new UsersService(db);
        this.tenantUsersService = new TenantUsersService(db);
        this.tenantsService = new TenantsService(db);
        this.emitter = emitter;
        this.tenantsCollection = db.collection('tenants');
    }

    getTenantsHandler(req: CustomRequest, res: Response, next: NextFunction) {
        this.tenantsCollection.find({userId: new ObjectID(req.headers['user-id'])}).toArray().then((success: any) => {
            res.send(success);
        }).catch(next);
    }

    getTenantHandler(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getOrDeleteTenant, HelperService.validationHandler).then(() => {
            return this.tenantsService.getTenant(req.params.tenantId);
        }).then((success: any) => {
            res.send(success);
        }).catch(next);
    }

    createTenantHandler(req: CustomRequest, res: Response, next: NextFunction) {
        let tenant: Tenant;
        const userId = UsersService.getUserIdFromAuth(req.headers.authorization);
        Joi.validate(req , validation.createTenant, HelperService.validationHandler).then((success: any) => {
            return this.usersService.getUserById(new ObjectID(userId));
        }).then((success: any) => {
            if (success) {
                const tenant = new Tenant(req.body.name, userId);
                return this.tenantsCollection.insert(tenant);
            } else {
                const errorData = { name: 'InvalidUserError',  tenantId: req.headers['user-id'] };
                throw new DatabaseError('No such user', ['No such user exists with that id'], errorData);
            }
        }).then((success: any) => {
            tenant = success.ops[0];
            return this.tenantUsersService.addUserToTenant(userId, tenant._id.toHexString())
        }).then(() => {
            this.emitter.emit('user-routes:bust-route','/user/tenants', undefined, undefined);
            res.status(201).send(tenant);
        }).catch(next);
    }

    deleteTenantHandler(req: CustomRequest, res: Response, next: NextFunction) {
        let tenantId: string;
        let userId: string;
        Joi.validate(req, validation.getOrDeleteTenant, HelperService.validationHandler).then(() => {
            userId = UsersService.getUserIdFromAuth(req.headers.authorization);
            tenantId = req.params.tenantId;
            this.tenantUsersService.removeUserFromTenant(userId, tenantId);
        }).then(() => {
            const details = {'_id' : new ObjectID(tenantId)};
            return this.tenantsCollection.findOneAndDelete(details)
        }).then((doc: any) => {
            const body = new ApiSuccessBody('success', []);
            body.newMessage(`Tenant ${doc.value._id} deleted`);
            this.emitter.emit('user-routes:bust-route','/user/tenants', undefined, userId);
            res.send(body);
        }).catch(next);
    };

    updateTenantHandler(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.updateTenant, HelperService.validationHandler).then(() => {
            const update = new Tenant(req.body.name);
            const details = {'_id': new ObjectID(req.params.tenantId)};
            return this.tenantsCollection.findOneAndUpdate(details, { $set: update }, {returnOriginal: false})
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', success.value));
        }).catch(next);
    }

    // getUsersTenantsHandler(req: CustomRequest, res: Response, next: NextFunction) {
    //     Joi.validate(req, validation.getUsersTenants, (error: any, value: any) => {
    //         return (error) ? Promise.reject(error) : Promise.resolve(value);
    //     }).then((success: any) => {
    //         return this.tenantUsersCollection.find({}).toArray();
    //     }).then((success: any) => {
    //         res.send(new ApiSuccessBody('success', ['Got all user tenants'], success));
    //     }).catch(next);
    // }

    // getTenantUsersHandler(req: CustomRequest, res: Response, next: NextFunction) {
    //     let tenantUsersLinks: Array<TenantUserLink>;
    //
    //     Joi.validate(req, validation.getTenantUsers, (error: any, value: any) => {
    //         return (error) ? Promise.reject(error) : Promise.resolve(value);
    //     }).then((success: any) => {
    //         const tenantUsersQuery = {'userId': new ObjectID(req.params.userId)};
    //         const tenantUsersProjection = {'userId': false};
    //         return this.tenantUsersCollection.find(tenantUsersQuery, {projection: tenantUsersProjection}).toArray();
    //     }).then((success: Array<TenantUserLink>) => {
    //         tenantUsersLinks = success;
    //         const tenantsQueryArray = tenantUsersLinks.map((tenantUser: TenantUserLink) => new ObjectID(tenantUser.tenantId));
    //         return this.tenantsCollection
    //             .find({_id: {$in: tenantsQueryArray}})
    //             .toArray()
    //     }).then((success: any) => {
    //         const responseData = tenantUsersLinks.map((tenantUser: TenantUserLink) => {
    //             const tenant = success.find((tenant: Tenant) => tenant._id.toHexString() === tenantUser.tenantId.toHexString());
    //             if (tenant) {
    //                 return new TenantUser(tenant.name, tenantUser._id, tenant.measurement);
    //             }
    //         });
    //         res.send(new ApiSuccessBody('success', [`Got user tenants for user ${req.params.userId}`], responseData));
    //     }).catch(next);
    // };
    //
    // deleteTenantUserHandler(req: CustomRequest, res: Response, next: NextFunction) {
    //
    //     Joi.validate(req, validation.deleteTenantUsers, (error: any, value: any) => {
    //         return (error) ? Promise.reject(error) : Promise.resolve(value);
    //     }).then((success: any) => {
    //         const details = {'_id': new ObjectID(req.params.tenantUserId)};
    //         const options = { projection: { _id: 1 } };
    //         return this.tenantUsersCollection.findOneAndDelete(details, options)
    //     }).then((success: any) => {
    //         res.send(new ApiSuccessBody('success', [`TenantUserLink ${success.value._id} deleted`]));
    //     }).catch(next);
    // };
    //
    // createTenantUserHandler(req: CustomRequest, res: Response, next: NextFunction) {
    //     Joi.validate(req, validation.createTenantUsers, (error: any, value: any) => {
    //         return (error) ? Promise.reject(error) : Promise.resolve(value);
    //     }).then((success: any) => {
    //         return this.userTenantService.addUserToTenant(req.params.userId, req.params.tenantId)
    //     }).then((success: any) => {
    //         res.status(201).send(new ApiSuccessBody('success', success.ops[0]));
    //     }).catch(next);
    // }
    //
    // updateTenantUserHandler(req: CustomRequest, res: Response, next: NextFunction) {
    //     Joi.validate(req, validation.updateTenantUsers, (error: any, value: any) => {
    //         return (error) ? Promise.reject(error) : Promise.resolve(value);
    //     }).then((success: any) => {
    //         const tenantUserLink = new TenantUserLink(new ObjectID(req.headers['user-id']), new ObjectID(req.headers['tenant-id']));
    //         const details = {'_id': new ObjectID(req.params.tenantUserId)};
    //         return this.tenantUsersCollection.findOneAndUpdate(details, tenantUserLink)
    //     }).then((success: any) => {
    //         res.status(201).send(new ApiSuccessBody('success', [`TenantUser ${success.value._id} updated`], success.value));
    //     }).catch(next);
    // }
}
