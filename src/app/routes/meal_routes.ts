import {Application, NextFunction, Response} from "express";
import {MealService} from "../services/meals.service";
import { CustomRequest } from "../classes/request/customRequest";
import {MealFoodsService} from "../services/meal-foods.service";

module.exports = (app: Application, db: any) => {
    const mealsService = new MealService(db);
    const mealFoodsService = new MealFoodsService(db);


    app.get('/meals', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.getMealsHandler(req, res, next);
    });

    app.post('/meals', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.createMealHandler(req, res, next);
    });

    app.get('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.getMealHandler(req, res, next);
    });

    app.put('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.updateMealHandler(req, res, next);
    });

    app.delete('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.deleteMealHandler(req, res, next);
    });

    app.post('/meals/:mealId/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.addFoodsToMealHandler(req, res, next);
    });

};