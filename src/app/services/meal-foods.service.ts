import {MealFoodLink} from "../classes/mealFoodLink";
import {ObjectID} from "bson";
import {Food} from "../classes/food";
import {Collection} from "mongodb";
import {MealFood} from "../classes/mealFood";
import {NextFunction, Request, Response} from "express";
import validation from "../routes/validation/meal-foods";
import {ApiErrorBody} from "../classes/apiErrorBody";
import {ApiSuccessBody} from "../classes/apiSuccessBody";


const Joi = require('joi');


export class MealFoodsService {
    mealFoodsCollection: Collection;
    foodsCollection: Collection;

    constructor(db: any) {
        this.foodsCollection = db.collection('foods');
        this.mealFoodsCollection = db.collection('mealFoods');
    }


    getMealFoods(req: Request, res: Response, next: NextFunction) {
        const reqData = { params: req.params };
        let mealFoodsLinks: Array<MealFoodLink>;

        Joi.validate(reqData, validation.getMealFoods, (error: any, value: any) => {
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
                const food = success.find((food: Food) => food._id.equals(mealFood.foodId));
                if (food) {return new MealFood(food.name, mealFood._id, food.measurement, mealFood.qty);};
            });
            res.send(new ApiSuccessBody('success', ['Got meal foods'], responseData));
        }, (error: any) => {
            res.status(400).send(new ApiErrorBody([error]));
        }).catch(next);

    };

    deleteMealFoods(req: Request, res: Response, next: NextFunction) {
        const reqData = { params: req.params };

        Joi.validate(reqData, validation.deleteMealFoods, (error: any, value: any) => {
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

}