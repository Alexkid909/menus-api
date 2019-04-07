import { Collection } from "mongodb";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../classes/request/customRequest";
import { Meal } from "../classes/artefacts/meal";
import { validation } from "../routes/validation/meals";
import { ApiSuccessBody } from "../classes/response/apiSuccessBody";
import { HelperService } from "./helpers.service";
import { TenantsService } from "./tenants.service";
import { DatabaseError } from "../classes/internalErrors/databaseError";
import { DefaultQuery } from "../classes/defaultQuery";
import { DefaultQueryOptions } from "../classes/db/defaultQueryOptions";

const Joi = require('joi');

export class MealService {
    private mealsCollection: Collection;
    private tenantsService: TenantsService;
    private defaultQueryOptions: DefaultQueryOptions;

    constructor(db: any) {
        this.mealsCollection = db.collection('meals');
        this.tenantsService = new TenantsService(db);
        this.defaultQueryOptions = new DefaultQueryOptions();
    }

    getMeals(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getMeals, HelperService.validationHandler).then((success: any) => {
            const query = new DefaultQuery();
            query.setTenantId(req.headers["tenant-id"]);
            return this.mealsCollection.find(query, this.defaultQueryOptions).toArray();
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', [`Found ${success.length} meals`], success));
        }).catch(next);
    }

    getMeal(req: CustomRequest, res: Response, next: NextFunction) {
        return Joi.validate(req, validation.getOrDeleteMeal, HelperService.validationHandler).then((success: any) => {
            const query = new DefaultQuery(req.params.mealId, req.headers["tenant-id"]);
            return this.mealsCollection.findOne(query);
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Found meal'], success));
        }).catch(next);
    }

    createMeal(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.createMeal, HelperService.validationHandler).then((success: any) => {
            return this.tenantsService.findTenant(req.headers["tenant-id"])
        }).then((success: any) => {
            if (success) {
                const meal = new Meal(req.body.name, req.headers['tenant-id']);
                return this.mealsCollection.insert(meal);
            } else {
                const errorData = { name: 'InvalidTenantError',  tenantId: req.headers["tenant-id"] };
                throw new DatabaseError('No such tenant', ['No such tenant exists with that tenant id'], errorData);
            }
        }).then((success: any) => {
            res.status(201).send(new ApiSuccessBody('success', [`Meal created`], success.ops[0]));
        }).catch(next);
    }

    deleteMeal(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getOrDeleteMeal, HelperService.validationHandler).then((success: any) => {
            const query = new DefaultQuery(req.params.mealId, req.headers["tenant-id"]);
            return this.mealsCollection.findOneAndDelete(query)
        }).then((doc: any) => {
            console.log('doc', doc);
            const body = new ApiSuccessBody('success', []);
            body.newMessage(`Meal ${doc.value._id} deleted`);
            res.send(body);
        }).catch(next);
    }

    updateMeal(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.updateMeal, HelperService.validationHandler).then((success: any) => {
            const update = new Meal(req.body.name, req.headers['tenant-id']);
            const options = Object.assign(this.defaultQueryOptions, { returnOriginal: false });
            const query = new DefaultQuery(req.params.mealId, req.headers["tenant-id"]);
            return this.mealsCollection.findOneAndUpdate(query, update, {returnOriginal: false})
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', success.value));
        }).catch(next);
    }
}