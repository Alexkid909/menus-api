import {Application, NextFunction, Response} from "express";
import {MealService} from "../services/meals.service";
import { CustomRequest } from "../classes/request/customRequest";

module.exports = (app: Application, db: any) => {

    const mealsService = new MealService(db);

    app.get('/meals', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.getMeals(req, res, next);
    });

    app.post('/meals', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.createMeal(req, res, next);
    });

    app.get('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.getMeal(req, res, next);
    });

    app.put('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.updateMeal(req, res, next);
    });

    app.delete('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.deleteMeal(req, res, next);
    });
};