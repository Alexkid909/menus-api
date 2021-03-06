import { Collection } from "mongodb";
import { Food } from "../classes/artefacts/food";
import { validation } from "../validation/routes/foods";
import { ApiSuccessBody } from "../classes/response/apiSuccessBody";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../classes/request/customRequest";
import { HelperService } from "./helpers.service";
import { TenantsService } from "./tenants.service";
import { DatabaseError } from "../classes/internalErrors/databaseError";
import { DefaultQuery } from "../classes/defaultQuery";
import {DefaultProjection, DefaultQueryOptions} from "../classes/db/defaultQueryOptions";
import { UsersService } from "./users.service";

const Joi = require("joi");

export class FoodsService {
    private foodsCollection: Collection;
    private tenantsService: TenantsService;
    private usersService: UsersService;
    private defaultQueryOptions: DefaultQueryOptions;

    constructor(db: any) {
        this.foodsCollection = db.collection('foods');
        this.tenantsService = new TenantsService(db);
        this.usersService = new UsersService(db);
        this.defaultQueryOptions = new DefaultQueryOptions();
    }

    getFoodsHandler(req: CustomRequest, res: Response, next: NextFunction) {
        const query = new DefaultQuery();
        query.setProperty('softDeleted', false);
        query.setTenantId(req.headers['tenant-id']);
        const { sortOrder, sortKey} = (req.query as any);
        const order: any = {};
        if (sortOrder && sortKey) { order[sortKey] = parseInt(sortOrder)}
        const projection = new DefaultProjection(false)
        const options = new DefaultQueryOptions(projection)
        this.foodsCollection.find(query, options).sort(order).toArray().then((success: any) => {
            res.send(new ApiSuccessBody('success', [`Found ${success.length} foods`], success));
        }).catch(next);
    }

    getFoodHandler(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getOrDeleteFood, HelperService.validationHandler).then(() => {
            const query = new DefaultQuery(req.params.foodId, req.headers['tenant-id']);
            return this.foodsCollection.findOne(query, this.defaultQueryOptions);
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Here is your food'], success) );
        }).catch(next);
    }

    createFoodHandler(req: CustomRequest, res: Response, next: NextFunction) {
        const tenantId = req.headers["tenant-id"];
        Joi.validate(req, validation.createFood, HelperService.validationHandler).then((success: any) => {
            if (success) {
                const food = new Food(req.body.name, req.body.measurement, tenantId, null, null, req.body.imgSrc);
                return this.foodsCollection.insertOne(food);
            } else {
                const errorData = { name: 'InvalidTenantError',  tenantId };
                throw new DatabaseError('No such tenant', ['No such tenant exists with that tenant id'], errorData);
            }
        }).then((success: any) => {
            res.status(201).send(new ApiSuccessBody('success', [`Food created`], success.ops[0]));
        }).catch(next);
    }

    deleteFoodHandler(req: CustomRequest, res: Response, next: NextFunction) {
        const tenantId = req.headers["tenant-id"];
        Joi.validate(req, validation.getOrDeleteFood, HelperService.validationHandler).then(() => {
            const query = new DefaultQuery(req.params.foodId, tenantId);
            const options = Object.assign({}, this.defaultQueryOptions, { returnOriginal: false });
            const update = { softDeleted: true };
            return this.foodsCollection.findOneAndUpdate(query, { $set: update }, options);
        }).then((doc: any) => {
            const body = new ApiSuccessBody('success', []);
            body.newMessage(`Food ${doc.value._id} deleted`);
            res.send(body);
        }).catch(next);
    };

    updateFoodHandler(req: CustomRequest, res: Response, next: NextFunction) {
        const tenantId = req.headers["tenant-id"];
        Joi.validate(req, validation.updateFood, HelperService.validationHandler).then(() => {
            const query = new DefaultQuery(req.params.foodId, tenantId);
            const options = Object.assign({}, this.defaultQueryOptions, { returnOriginal: false });
            const update = new Food(req.body.name, req.body.measurement, tenantId, null, null, req.body.imgSrc);
            return this.foodsCollection.findOneAndUpdate(query, { $set: update }, options);
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', success.value));
        }).catch(next);
    }
}
