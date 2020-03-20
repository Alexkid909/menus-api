import {Application, NextFunction, Response} from "express";
import { MealFoodsService } from "../services/meal-foods.service";
import { CustomRequest } from "../classes/request/customRequest";

module.exports = (app: Application, db: any) => {
    const mealFoodsService = new MealFoodsService(db);

    app.post('/meals/:mealId/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.addFoodsToMealHandler(req, res, next);
    });

    app.get('/meals/:mealId/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.getMealFoodsHandler(req, res, next);
    });

    app.get('/meal-foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.getMealsFoodsHandler(req, res, next);
    });

    app.delete('/meal-foods/:mealFoodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.deleteMealFoodHandler(req, res, next);
    });

    app.put('/meal-foods/:mealFoodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.updateMealFoodHandler(req, res, next);
    });
};