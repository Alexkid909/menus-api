import {ObjectID} from "bson";
import { Collection } from "mongodb";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../classes/request/customRequest";
import {Meal} from "../classes/artefacts/meal";
import {ApiErrorBody} from "../classes/response/apiErrorBody";
import { validation } from "../routes/validation/meals";
import {ApiSuccessBody} from "../classes/response/apiSuccessBody";
import {ValidationError} from "../classes/internalErrors/validationError";
import {Food} from "../classes/artefacts/food";

const Joi = require('joi');

export class MealService {
    mealsCollection: Collection;

    constructor(db: any) {
        this.mealsCollection = db.collection('meals');
    }

    getMeals(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getMeals, (error: any, value: any) => {
            if (error) {
                const friendlyMessages = error.details.map((detail: any) => detail.message);
                return Promise.reject(new ValidationError(error.name, friendlyMessages, error))
            }
            return Promise.resolve(value);
        }).then((success: any) => {
            const details = {'_id' : new ObjectID(req.params.mealId)};
            return this.mealsCollection.find({}).toArray();
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Found meal'], success));
        }).catch(next);
    }

    getMeal(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getOrDeleteMeal, (error: any, value: any) => {
            if (error) {
                const friendlyMessages = error.details.map((detail: any) => detail.message);
                return Promise.reject(new ValidationError(error.name, friendlyMessages, error))
            }
            return Promise.resolve(value);
        }).then((success: any) => {
            const details = {'_id' : new ObjectID(req.params.mealId)};
            return this.mealsCollection.findOne(details);
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Found meal'], success));
        }).catch(next);
    }

    createMeal(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.createMeal, (error: any, value: any) => {
            if (error) {
                const friendlyMessages = error.details.map((detail: any) => detail.message);
                return Promise.reject(new ValidationError(error.name, friendlyMessages, error))
            }
            return Promise.resolve(value);
        }).then((success: any) => {
            const meal = new Meal(req.body.name, new ObjectID(req.headers['tenant-id']));
            return this.mealsCollection.insert(meal);
        }).then((success: any) => {
            res.status(201).send(new ApiSuccessBody('success', [`Meal created`], success.ops[0]));
        }).catch(next);
    }

    deleteMeal(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getOrDeleteMeal, (error: any, value: any) => {
            if (error) {
                const friendlyMessages = error.details.map((detail: any) => detail.message);
                return Promise.reject(new ValidationError(error.name, friendlyMessages, error))
            }
            return Promise.resolve(value);
        }).then((success: any) => {
            const details = {'_id' : new ObjectID(req.params.mealId)};
            return this.mealsCollection.findOneAndDelete(details)
        }).then((doc: any) => {
            console.log('doc', doc);
            const body = new ApiSuccessBody('success', []);
            body.newMessage(`Meal ${doc.value._id} deleted`);
            res.send(body);
        }).catch(next);
    }

    updateMeal(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.updateMeal, (error: any, value: any) => {
            if (error) {
                const friendlyMessages = error.details.map((detail: any) => detail.message);
                return Promise.reject(new ValidationError(error.name, friendlyMessages, error))
            }
            return Promise.resolve(value);
        }).then((success: any) => {
            const meal = new Meal(req.body.name, new ObjectID(req.headers['tenant-id']));
            const details = {'_id': new ObjectID(req.params.mealId)};
            return this.mealsCollection.findOneAndUpdate(details, meal, {returnOriginal: false})
        }).then((success: any) => {
            console.log('success', success);
            res.send(new ApiSuccessBody('success', success.value));
        }).catch(next);
    }
}