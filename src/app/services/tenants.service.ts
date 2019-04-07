import { Collection, ObjectID } from "mongodb";
import { Tenant } from "../classes/tenant";
import { ApiErrorBody } from "../classes/response/apiErrorBody";
import { ApiSuccessBody } from "../classes/response/apiSuccessBody";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../classes/request/customRequest";
import { validation } from "../routes/validation/tenants";



const Joi = require("joi");

export class TenantsService {
    tenantsCollection: Collection;
    constructor(db: any) {
        this.tenantsCollection = db.collection('tenants');
    }

    findTenant(tenantId: string) {
        return this.tenantsCollection.findOne({'_id' : new ObjectID(tenantId)});
    }

    getTenants(req: CustomRequest, res: Response, next: NextFunction) {
        this.tenantsCollection.find({}).toArray((err: any, result: any) => {
            (err) ? res.status(500).send(new ApiErrorBody()) : res.send(result);
        });
    }

    getTenant(req: CustomRequest, res: Response, next: NextFunction) {
        const reqData = { params: req.params };
        Joi.validate(reqData, validation.getOrDeleteTenant, (error: any, value: any) =>         {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then(() => {
            return this.findTenant(req.params.tenantId);
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(422).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.send(success);
        }).catch(next);
    }

    createTenant(req: CustomRequest, res: Response, next: NextFunction) {
        const reqData = { body: req.body };
        Joi.validate(reqData , validation.createTenant, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            console.log('success 1', success);
            const tenant = new Tenant(req.body.name);
            return this.tenantsCollection.insert(tenant);
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.status(201).send(success.ops[0]);
        }).catch(next);
    }

    deleteTenant(req: CustomRequest, res: Response, next: NextFunction) {
        const reqData = {
            params: req.params
        };

        Joi.validate(reqData, validation.getOrDeleteTenant, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then(() => {
            const details = {'_id' : new ObjectID(req.params.tenantId)};
            return this.tenantsCollection.findOneAndDelete(details)
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
            console.log(error);
        }).then((doc: any) => {
            console.log('doc', doc);
            const body = new ApiSuccessBody('success', []);
            body.newMessage(`Tenant ${doc.value._id} deleted`);
            res.send(body);
        }).catch(next);

    };

    updateTenant(req: CustomRequest, res: Response, next: NextFunction) {
        const reqData = {
            params: req.params,
            body: req.body
        };

        Joi.validate(reqData, validation.updateTenant, (error: any, value: any) => {
           return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then(() => {
            const tenant = new Tenant(req.body.name);
            const details = {'_id': new ObjectID(req.params.tenantId)};
            return this.tenantsCollection.findOneAndUpdate(details, tenant, {returnOriginal: false})
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any) => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', success.value));
        }).catch(next);
    }
}