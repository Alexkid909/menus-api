import { Collection, ObjectID } from "mongodb";
import { Food } from "../classes/artefacts/food";
import { validation } from "../routes/validation/foods";
import { ApiErrorBody } from "../classes/response/apiErrorBody";
import { ApiSuccessBody } from "../classes/response/apiSuccessBody";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../classes/request/customRequest";
import {ValidationError} from "../classes/internalErrors/validationError";


const Joi = require("joi");

export class FoodsService {
    foodsCollection: Collection;

    constructor(db: any) {
        this.foodsCollection = db.collection('foods');
    }

    private validationHandler(error: any, value: any) {
        if (error) {
            const friendlyMessages = error.details.map((detail: any) => detail.message);
            return Promise.reject(new ValidationError(error.name, friendlyMessages, error))
        }
        return Promise.resolve(value);
    }

    getFoods(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getFoods, this.validationHandler)
            .then((success: any) => {
            const details = {'_id' : new ObjectID(req.params.mealId)};
            return this.foodsCollection.find({}).toArray();
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', ['Found meal'], success));
        }).catch(next);
    }

    getFood(req: CustomRequest, res: Response, next: NextFunction) {
        Joi.validate(req, validation.getOrDeleteFood, this.validationHandler).then(() => {
            const details = {'_id' : new ObjectID(req.params.foodId)};
            return this.foodsCollection.findOne(details);
        }).then((success: any) => {
            console.log('success', success);
            res.send(new ApiSuccessBody('success', ['Here is your food'], success) );
        }).catch(next);
    }

    createFood(req: CustomRequest, res: Response, next: NextFunction) {
        // console.log('req.body', req.body, 'req.headers', req.headers)
        Joi.validate(req , validation.createFood, this.validationHandler).then((success: any) => {
            const food = new Food(req.body.name, req.body.measurement, new ObjectID(req.headers['tenant-id']));
            return this.foodsCollection.insert(food);
        }).then((success: any) => {
            console.log(success);
            res.status(201).send(success.ops[0]);
        }).catch(next);
    }

    deleteFood(req: CustomRequest, res: Response, next: NextFunction) {

        Joi.validate(req, validation.getOrDeleteFood, this.validationHandler).then(() => {
            const details = {'_id' : new ObjectID(req.params.foodId)};
            return this.foodsCollection.findOneAndDelete(details)
        }).then((doc: any) => {
            console.log('doc', doc);
            const body = new ApiSuccessBody('success', []);
            body.newMessage(`Food ${doc.value._id} deleted`);
            res.send(body);
        }).catch(next);

    };

    updateFood(req: CustomRequest, res: Response, next: NextFunction) {

        Joi.validate(req, validation.updateFood, this.validationHandler).then(() => {
            const food = new Food(req.body.name, req.body.measurement, new ObjectID(req.headers['tenant-id']));
            const details = {'_id': new ObjectID(req.params.foodId)};
            return this.foodsCollection.findOneAndUpdate(details, food, {returnOriginal: false})
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', success.value));
        }).catch(next);
    }
}