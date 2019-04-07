import { Collection } from "mongodb";
import { Food } from "../classes/artefacts/food";
import { validation } from "../routes/validation/foods";
import { ApiSuccessBody } from "../classes/response/apiSuccessBody";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../classes/request/customRequest";
import { HelperService } from "./helpers.service";
import { TenantsService } from "./tenants.service";
import { DatabaseError } from "../classes/internalErrors/databaseError";
import { DefaultQuery } from "../classes/defaultQuery";
import { DefaultQueryOptions } from "../classes/db/defaultQueryOptions";


const Joi = require("joi");

export class FoodsService {
    private foodsCollection: Collection;
    private tenantsService: TenantsService;
    private defaultQueryOptions: DefaultQueryOptions;

    constructor(db: any) {
        this.foodsCollection = db.collection('foods');
        this.tenantsService = new TenantsService(db);
        this.defaultQueryOptions = new DefaultQueryOptions();
    }

    getFoods(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getFoods, HelperService.validationHandler).then(() => {
            const query = new DefaultQuery();
            query.setTenantId(req.headers["tenant-id"]);
            return this.foodsCollection.find(query, this.defaultQueryOptions).toArray();
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', [`Found ${success.length} foods`], success));
        }).catch(next);
    }

    getFood(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getOrDeleteFood, HelperService.validationHandler).then(() => {
            const query = new DefaultQuery(req.params.foodId, req.headers["tenant-id"]);
            return this.foodsCollection.findOne(query, this.defaultQueryOptions);
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Here is your food'], success) );
        }).catch(next);
    }

    createFood(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req , validation.createFood, HelperService.validationHandler).then(() => {
            return this.tenantsService.findTenant(req.headers["tenant-id"])
        }).then((success: any) => {
            if (success) {
                const food = new Food(req.body.name, req.body.measurement, req.headers['tenant-id']);
                return this.foodsCollection.insertOne(food);
            } else {
                const errorData = { name: 'InvalidTenantError',  tenantId: req.headers["tenant-id"] };
                throw new DatabaseError('No such tenant', ['No such tenant exists with that tenant id'], errorData);
            }
        }).then((success: any) => {
            console.log(success);
            res.status(201).send(new ApiSuccessBody('success', [`Food created`], success.ops[0]));
        }).catch(next);
    }

    deleteFood(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getOrDeleteFood, HelperService.validationHandler).then(() => {
            const query = new DefaultQuery(req.params.foodId, req.headers["tenant-id"]);
            return this.foodsCollection.findOneAndDelete(query, this.defaultQueryOptions);
        }).then((doc: any) => {
            console.log('doc', doc);
            const body = new ApiSuccessBody('success', []);
            body.newMessage(`Food ${doc.value._id} deleted`);
            res.send(body);
        }).catch(next);

    };

    updateFood(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.updateFood, HelperService.validationHandler).then(() => {
            const query = new DefaultQuery(req.params.foodId, req.headers["tenant-id"]);
            const options = Object.assign(this.defaultQueryOptions, { returnOriginal: false });
            const update = new Food(req.body.name, req.body.measurement, req.headers['tenant-id']);
            return this.foodsCollection.findOneAndUpdate(query, update, options)
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', success.value));
        }).catch(next);
    }
}