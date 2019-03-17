import { Collection, ObjectID } from "mongodb";
import { Tenant } from "../classes/tenant";
import { ApiErrorBody } from "../classes/apiErrorBody";
import { ApiSuccessBody } from "../classes/apiSuccessBody";
import { NextFunction, Request, Response } from "express";
import { validation } from "../routes/validation/tenants";



const Joi = require("joi");

export class TenantsService {
    tenantsCollection: Collection;
    constructor(db: any) {
        this.tenantsCollection = db.collection('tenants');
    }

    getTenants(req: Request, res: Response, next: NextFunction) {
        this.tenantsCollection.find({}).toArray((err: any, result: any) => {
            (err) ? res.status(500).send(new ApiErrorBody()) : res.send(result);
        });
    }

    getTenant(req: Request, res: Response, next: NextFunction) {
        const reqData = { params: req.params };

        Joi.validate(reqData, validation.getOrDeleteTenant, (error: any, value: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
        }).then((success: any) => {
            const details = {'_id' : new ObjectID(req.params.id)};
            return this.tenantsCollection.findOne(details);
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(422).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.send(success);
        }).catch(next);
    }

    createTenant(req: Request, res: Response, next: NextFunction) {
        const reqData = { body: req.body };
        Joi.validate(reqData , validation.createTenant, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            console.log('success 1', success);
            const tenant = new Tenant(req.body.name, req.body.measurement);
            return this.tenantsCollection.insert(tenant);
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.status(201).send(success.ops[0]);
        }).catch(next);
    }

    deleteTenant(req: Request, res: Response, next: NextFunction) {
        const reqData = {
            params: req.params
        };

        Joi.validate(reqData, validation.updateTenant, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
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

    updateTenant(req: Request, res: Response, next: NextFunction) {
        const reqData = {
            params: req.params,
            body: req.body
        };

        Joi.validate(reqData, validation.updateTenant, (error: any, value: any) => {
           return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            console.log('this', this.tenantsCollection);
            const tenant = new Tenant(req.body.name, req.body.measurement);
            const details = {'_id': new ObjectID(req.params.tenantId)};
            return this.tenantsCollection.findOneAndUpdate(details, tenant)
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any) => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', success.value));
        }).catch(next);
    }
}