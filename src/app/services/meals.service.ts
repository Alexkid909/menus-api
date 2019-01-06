import {ObjectID} from "bson";
import {Collection, MongoError} from "mongodb";
import {NextFunction, Request, Response} from "express";
import {Meal} from "../classes/meal";
import {ApiErrorBody} from "../classes/apiErrorBody";


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
        const details = {'_id' : new ObjectID(req.params.id)};
        this.mealsCollection.findOne(details, (err: any, result: any) => {
            (err) ? res.send(new ApiErrorBody()) : res.send(result);
        });
    }

    createMeal(req: Request, res: Response, next: NextFunction) {
        const meal = new Meal(req.body.name);
        if(!meal.name) {
            res.send({message:'Please provide a name for this meal'});
        } else {
            this.mealsCollection.insert(meal, (err: any, result: any) => {
                (err) ? res.status(500).send(new ApiErrorBody()) : res.send(result.ops[0]);
            });
        }
    }

    deleteMeal(req: Request, res: Response, next: NextFunction) {
        const id = new ObjectID(req.params.id);
        const details = {'_id' : id};
        this.mealsCollection.remove(details, (err: any, result: any) => {
            const success = {message: `Meal ${id} deleted!`};
            (err) ? res.send(new ApiErrorBody()) : res.send(JSON.stringify(success));
        });
    }

    updateMeal(req: Request, res: Response, next: NextFunction) {
        const meal = new Meal(req.body.name, req.body.foods);
        (!meal.name) && res.send('Please provide a name for this meal');
        console.log('updated meal', meal);
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        this.mealsCollection.updateOne(details, {$set: meal}).then((success: any) => {
            this.mealsCollection.findOne(details, (err: MongoError, item: any) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('item', item);
                    res.send(item);
                }
            });
        }, (error: any) => {
            console.log('error', error)
        })
    }
}