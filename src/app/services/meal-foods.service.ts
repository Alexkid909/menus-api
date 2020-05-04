import {MealFoodLink} from "../classes/joins/mealFoodLink";
import {ObjectID} from "bson";
import {Food} from "../classes/artefacts/food";
import {Collection} from "mongodb";
import {MealFood} from "../classes/artefacts/mealFood";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../classes/request/customRequest";
import { validation } from "../routes/validation/meal-foods";
import {ApiSuccessBody} from "../classes/response/apiSuccessBody";
import {TenantUsersService} from "./tenant-users.service";
import {HelperService} from "./helpers.service";
import {bustCache} from "./cache.service";


const Joi = require('joi');


export class MealFoodsService {
    mealFoodsCollection: Collection;
    foodsCollection: Collection;
    tenantUsersService: TenantUsersService;

    constructor(db: any) {
        this.foodsCollection = db.collection('foods');
        this.mealFoodsCollection = db.collection('mealFoods');
        this.tenantUsersService = new TenantUsersService(db);
    }


    getMealsFoodsHandler(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getMealsFoods, HelperService.validationHandler).then(() => {
            return this.tenantUsersService.hasTenantAccess(req);
        }).then((success: any) => {
            return this.mealFoodsCollection.find({}).toArray();
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Got all meal foods'], success));
        }).catch(next);
    }

    getMealFoodsHandler(req: CustomRequest, res: Response, next: NextFunction) {
        let mealFoodsLinks: Array<MealFoodLink>;
        Joi.validate(req, validation.getMealFoods, HelperService.validationHandler).then(() => {
            return this.tenantUsersService.hasTenantAccess(req);
        }).then((success: any) => {
            const mealFoodsQuery = {'mealId' : new ObjectID(req.params.mealId)};
            const mealFoodsProjection = { 'mealId': false };
            return this.mealFoodsCollection.find(mealFoodsQuery, {projection: mealFoodsProjection}).toArray();
        }).then((success: Array<MealFoodLink>) => {
            mealFoodsLinks = success;
            const foodsQueryArray = mealFoodsLinks.map((mealFood: MealFoodLink) => new ObjectID(mealFood.foodId));
            return this.foodsCollection
                .find({ _id: { $in: foodsQueryArray } })
                .toArray()
        }).then((success: any) => {
            const responseData = mealFoodsLinks.map((mealFood: MealFoodLink) => {
                const food = success.find((food: Food) => food._id.toHexString() === mealFood.foodId.toHexString());
                if (food) { return new MealFood(food.name, mealFood._id, food.measurement, mealFood.qty);}
            });
            res.send(new ApiSuccessBody('success', [`Got meal foods for meal ${req.params.mealId}`], responseData));
        }).catch(next);

    };

    deleteMealFoodHandler(req: CustomRequest, res: Response, next: NextFunction) {
        const tenantId = req.headers['tenant-id'];
        Joi.validate(req, validation.deleteMealFoods, HelperService.validationHandler).then(() => {
            return this.tenantUsersService.hasTenantAccess(req);
        }).then(() => {
            const details = {'_id' : new ObjectID(req.params.mealFoodId)};
            const options = { projection: { _id: 1 } };
            return this.mealFoodsCollection.findOneAndDelete(details, options);
        }).then((success: any) => {
            bustCache([req.url, `/meals/${req.params.mealId}/foods`], tenantId);
            res.send(new ApiSuccessBody('success', [`MealFoodLink ${success.value._id} deleted`]));
        }).catch(next);
    };

    addFoodsToMealHandler(req: CustomRequest, res: Response, next: NextFunction) {
        const tenantId = req.headers['tenant-id'];
        Joi.validate(req, validation.createMealFoods, HelperService.validationHandler).then(() => {
            return this.tenantUsersService.hasTenantAccess(req);
        }).then(() => {
            const mealFoods: Array<MealFoodLink> = req.body.map((mealFood: { foodId: string, qty: number } ) => {
                return new MealFoodLink(new ObjectID(req.params.mealId), new ObjectID(mealFood.foodId), mealFood.qty);
            });
            return this.mealFoodsCollection.insert(mealFoods)
        }).then((success: any) => {
            bustCache([req.url], tenantId);
            res.status(201).send(new ApiSuccessBody('success', success.ops));
        }).catch(next);
    }

    updateMealFoodHandler(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.updateMealFoods, HelperService.validationHandler).then(() => {
            return this.tenantUsersService.hasTenantAccess(req);
        }).then((success: any) => {
            const mealFoodLink = new MealFoodLink(new ObjectID(req.body.mealId), new ObjectID(req.body.foodId), req.body.qty);
            const details = {'_id': new ObjectID(req.params.mealFoodId)};
            return this.mealFoodsCollection.findOneAndUpdate(details, mealFoodLink)
        }).then((success: any) => {
            res.status(201).send(new ApiSuccessBody('success', [`MealFood ${success.value._id} updated`], success.value));
        }).catch(next);
    }
}