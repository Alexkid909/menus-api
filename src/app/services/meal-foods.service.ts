import {MealFoodLink} from "../classes/joins/mealFoodLink";
import {ObjectID} from "bson";
import {Food} from "../classes/artefacts/food";
import {Collection} from "mongodb";
import {MealFood} from "../classes/artefacts/mealFood";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../classes/request/customRequest";
import { validation } from "../routes/validation/meal-foods";
import {ApiErrorBody} from "../classes/response/apiErrorBody";
import {ApiSuccessBody} from "../classes/response/apiSuccessBody";


const Joi = require('joi');


export class MealFoodsService {
    mealFoodsCollection: Collection;
    foodsCollection: Collection;

    constructor(db: any) {
        this.foodsCollection = db.collection('foods');
        this.mealFoodsCollection = db.collection('mealFoods');
    }


    getMealsFoods(req: CustomRequest, res: Response, next: NextFunction) {

        Joi.validate(req, validation.getMealsFoods, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            return this.mealFoodsCollection.find({}).toArray();
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Got all meal foods'], success));
        }).catch(next);
    }

    getMealFoods(req: CustomRequest, res: Response, next: NextFunction) {
        let mealFoodsLinks: Array<MealFoodLink>;

        Joi.validate(req, validation.getMealFoods, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const mealFoodsQuery = {'mealId' : new ObjectID(req.params.mealId)};
            const mealFoodsProjection = { 'mealId': false };
            return this.mealFoodsCollection.find(mealFoodsQuery, {projection: mealFoodsProjection}).toArray();
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: Array<MealFoodLink>) => {
            mealFoodsLinks = success;
            const foodsQueryArray = mealFoodsLinks.map((mealFood: MealFoodLink) => new ObjectID(mealFood.foodId));
            return this.foodsCollection
                .find({ _id: { $in: foodsQueryArray } })
                .toArray()
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            const responseData = mealFoodsLinks.map((mealFood: MealFoodLink) => {
                const food = success.find((food: Food) => food._id.toHexString() === mealFood.foodId.toHexString());
                if (food) { return new MealFood(food.name, mealFood._id, food.measurement, mealFood.qty);}
            });
            res.send(new ApiSuccessBody('success', [`Got meal foods for meal ${req.params.mealId}`], responseData));
        }, (error: any) => {
            res.status(400).send(new ApiErrorBody([error]));
        }).catch(next);

    };

    deleteMealFood(req: CustomRequest, res: Response, next: NextFunction) {

        Joi.validate(req, validation.deleteMealFoods, (error: any, value: any) => {
            console.log('value', value);
            console.log('error', error);
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const details = {'_id' : new ObjectID(req.params.mealFoodId)};
            return this.mealFoodsCollection.findOneAndDelete(details, {projection: '_id'})
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            console.log(success);
            res.send(new ApiSuccessBody('success', [`MealFoodLink ${success.value._id} deleted`]));
        }, (error: any) => {
            res.status(400).send(new ApiErrorBody([error]));
        }).catch(next);
    };

    createMealFood(req: CustomRequest, res: Response, next: NextFunction) {

        Joi.validate(req, validation.createMealFoods, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const mealFood = new MealFoodLink(new ObjectID(req.params.mealId), new ObjectID(req.body.foodId), req.body.qty);
            return this.mealFoodsCollection.insert(mealFood)
        }, (error: any) => {
            console.log('error 1', error);
            res.status(400).send(new ApiErrorBody([error]));
        }).then((success: any) => {
            console.log('success', success);
            res.status(201).send(new ApiSuccessBody('success', success.ops[0]));
        }, (error: any) => {
            console.log('error 2', error);
            res.status(500).send(new ApiErrorBody([error]));
        }).catch(next);
    }

    updateMealFood(req: CustomRequest, res: Response, next: NextFunction) {

        Joi.validate(req, validation.updateMealFoods, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const mealFoodLink = new MealFoodLink(new ObjectID(req.body.mealId), new ObjectID(req.body.foodId), req.body.qty);
            const details = {'_id': new ObjectID(req.params.mealFoodId)};
            return this.mealFoodsCollection.findOneAndUpdate(details, mealFoodLink)
        }, (error: any) => {
            console.log('error 1', error);
            res.status(400).send(new ApiErrorBody([error]));
        }).then((success: any) => {
            console.log('success 1', success);
            res.status(201).send(new ApiSuccessBody('success', [`MealFood ${success.value._id} updated`], success.value));
        }, (error: any) => {
            console.log('error 2', error);
            res.status(500).send(new ApiErrorBody([error]));
        }).catch(next);
    }
}