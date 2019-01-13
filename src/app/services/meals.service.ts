import {ObjectID} from "bson";
import {Collection, MongoError} from "mongodb";
import {NextFunction, Request, Response} from "express";
import {Meal} from "../classes/meal";
import {ApiErrorBody} from "../classes/apiErrorBody";
import { validation } from "../routes/validation/meals";
import {ApiSuccessBody} from "../classes/apiSuccessBody";

const Joi = require("joi");

export class MealService {
    mealsCollection: Collection;

    constructor(db: any) {
        this.mealsCollection = db.collection('meals');
    }

    getMeals(req: Request, res: Response, next: NextFunction) {
        this.mealsCollection.find({}).toArray((err: any, result: any) => {
            (err) ? res.send(new ApiErrorBody()) : res.send(result);
        });
    }

    getMeal(req: Request, res: Response, next: NextFunction) {

        Joi.validate(req, validation.getOrDeleteMeal, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const details = {'_id' : new ObjectID(req.params.mealId)};
            return this.mealsCollection.findOne(details);
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Found meal'], success));
        }).catch(next);
    }

    createMeal(req: Request, res: Response, next: NextFunction) {
        console.log(req.headers);

        Joi.validate(req, validation.createMeal, (error: any, value: any) => {
            (error) && console.log(error);
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const meal = new Meal(req.body.name);
            return this.mealsCollection.insert(meal);
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.status(201).send(new ApiSuccessBody('success', [`Meal created`], success.ops[0]));
        }).catch(next);
    }

    deleteMeal(req: Request, res: Response, next: NextFunction) {

        Joi.validate(req, validation.updateMeal, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const details = {'_id' : new ObjectID(req.params.mealId)};
            return this.mealsCollection.findOneAndDelete(details)
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
            console.log(error);
        }).then((doc: any) => {
            console.log('doc', doc);
            const body = new ApiSuccessBody('success', []);
            body.newMessage(`Meal ${doc.value._id} deleted`);
            res.send(body);
        }).catch(next);
    }

    updateMeal(req: Request, res: Response, next: NextFunction) {

        Joi.validate(req, validation.updateMeal, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const meal = new Meal(req.body.name, req.body.measurement);
            const details = {'_id': new ObjectID(req.params.mealId)};
            return this.mealsCollection.findOneAndUpdate(details, meal)
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any) => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', success.value));
        }).catch(next);
    }
}