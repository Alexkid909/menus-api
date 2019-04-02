import {Application, NextFunction, Response} from "express";
import { MealFoodsService } from "../services/meal-foods.service";
import { CustomRequest } from "../classes/request/customRequest";

module.exports = (app: Application, db: any) => {
    const mealFoodsService = new MealFoodsService(db);

    app.post('/meals/:mealId/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.createMealFood(req, res, next);
    });

    app.get('/meals/:mealId/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.getMealFoods(req, res, next);
    });

    app.get('/meal-foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.getMealsFoods(req, res, next);
    });

    app.delete('/meal-foods/:mealFoodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.deleteMealFood(req, res, next);
    });

    app.put('/meal-foods/:mealFoodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealFoodsService.updateMealFood(req, res, next);
    });
};