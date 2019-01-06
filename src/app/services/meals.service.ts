import {MealFoodLink} from "../classes/mealFoodLink";
import {ObjectID} from "bson";
import {Food} from "../classes/food";
import {Collection} from "mongodb";
import {MealFood} from "../classes/mealFood";
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
            (err) ? res.status(500).send(new ApiErrorBody()) : res.send(result);
        });
    }

    getMeal(req: Request, res: Response, next: NextFunction) {

    }

    createMeal(req: Request, res: Response, next: NextFunction) {

    }

    deleteMeal(req: Request, res: Response, next: NextFunction) {

    }

    updateMeal(req: Request, res: Response, next: NextFunction) {

    }
}