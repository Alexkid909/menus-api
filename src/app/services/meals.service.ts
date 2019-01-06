import {MealFoodLink} from "../classes/mealFoodLink";
import {ObjectID} from "bson";
import {Food} from "../classes/food";
import {Collection} from "mongodb";
import {MealFood} from "../classes/mealFood";
import {NextFunction, Request, Response} from "express";


export class MealService {
    mealsCollection: Collection;

    constructor(db: any) {
        this.mealsCollection = db.collection('meals');
    }

    getMeals(req: Request, res: Response, next: NextFunction) {

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