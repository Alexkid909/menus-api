import { Collection, ObjectID } from "mongodb";
import { Food } from "../classes/food";
import { validation } from "../routes/validation/foods";
import { ApiErrorBody } from "../classes/apiErrorBody";
import { ApiSuccessBody } from "../classes/apiSuccessBody";
import { NextFunction, Request, Response } from "express";

const Joi = require("joi");

export class FoodsService {
    foodsCollection: Collection;
    constructor(db: any) {
        this.foodsCollection = db.collection('foods');
    }

    getFoods(req: Request, res: Response, next: NextFunction) {
        this.foodsCollection.find({}).toArray((err: any, result: any) => {
            (err) ? res.status(500).send(new ApiErrorBody()) : res.send(result);
        });
    }

    getFood(req: Request, res: Response, next: NextFunction) {
        console.log('req.params', req.params);
        const reqData = { params: req.params };

        Joi.validate(reqData, validation.getOrDeleteFood, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const details = {'_id' : new ObjectID(req.params.foodId)};
            return this.foodsCollection.findOne(details);
        }).then((success: any) => {
            console.log('success', success);
            res.send(new ApiSuccessBody('success', ['Here is your food'], success) );
        }).catch(next);
    }

    createFood(req: Request, res: Response, next: NextFunction) {
        const reqData = { body: req.body };
        Joi.validate(reqData , validation.createFood, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            console.log('success 1', success);
            const food = new Food(req.body.name, req.body.measurement);
            return this.foodsCollection.insert(food);
        }, (error: any) => {
            const errorMessages = error.details.map((detail: any)  => detail.message);
            res.status(400).send(new ApiErrorBody(errorMessages));
        }).then((success: any) => {
            res.status(201).send(success.ops[0]);
        }).catch(next);
    }

    deleteFood(req: Request, res: Response, next: NextFunction) {

        Joi.validate(req, validation.getOrDeleteFood, (error: any, value: any) => {
            return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            const details = {'_id' : new ObjectID(req.params.foodId)};
            return this.foodsCollection.findOneAndDelete(details)
        }).then((doc: any) => {
            console.log('doc', doc);
            const body = new ApiSuccessBody('success', []);
            body.newMessage(`Food ${doc.value._id} deleted`);
            res.send(body);
        }).catch(next);

    };

    updateFood(req: Request, res: Response, next: NextFunction) {

        Joi.validate(req, validation.updateFood, (error: any, value: any) => {
           return (error) ? Promise.reject(error) : Promise.resolve(value);
        }).then((success: any) => {
            console.log('this', this.foodsCollection);
            const food = new Food(req.body.name, req.body.measurement);
            const details = {'_id': new ObjectID(req.params.foodId)};
            return this.foodsCollection.findOneAndUpdate(details, food)
        }).then((success: any) => {
            res.send(new ApiSuccessBody('success', success.value));
        }).catch(next);
    }
}