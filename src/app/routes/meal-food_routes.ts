import {Application, NextFunction, Request, Response} from "express";
import { ObjectID } from "bson";
import { MealFoodLink } from "../classes/mealFoodLink";
import { MealFoodsService } from "../services/meal-foods.service";

module.exports = (app: Application, db: any) => {
    const mealFoodsService = new MealFoodsService(db);
    const standardErrorMessage = () => {
        return {error: 'An error has occured'}
    };
    const mealFoodsCollection = db.collection('mealFoods');


    app.post('/meals/:mealId/foods', (req: Request, res: Response) => {
        const mealFood = new MealFoodLink(new ObjectID(req.params.mealId), new ObjectID(req.body.mealFood.foodId), req.body.mealFood.qty);
        console.log('new mealFood', mealFood);
        if(!mealFood.mealId || !mealFood.qty || !mealFood.foodId) {
            res.send({message:'Please provide a food id and quantity'});
        } else {
            mealFoodsCollection.insert(mealFood, (err: any, result: any) => {
                console.log('ops', result.ops);
                (err) ? res.send(standardErrorMessage()) : res.send(result.ops[0]);
            });
        }
    });


    app.get('/meals/:mealId/foods', (req: Request, res: Response, next: NextFunction) => {
        mealFoodsService.getMealFoods(req, res, next);
    });

    app.delete('/meal-foods/:mealFoodId', (req: Request, res: Response, next: NextFunction) => {
        mealFoodsService.deleteMealFood(req, res, next);
    });
};