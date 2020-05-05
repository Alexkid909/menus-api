import {Application, NextFunction, Response} from "express";
import {MealService} from "../services/meals.service";
import { CustomRequest } from "../classes/request/customRequest";
import {MealFoodsService} from "../services/meal-foods.service";
import {CacheService} from "../services/cache.service";

module.exports = (app: Application, db: any) => {
    const mealsService = new MealService(db);
    const mealFoodsService = new MealFoodsService(db);
    const cacheService = new CacheService();

    app.use('/meals', cacheService.cacheRoute(600));

    app.get('/meals', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.getMealsHandler(req, res, next);
    });

    app.get('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.getMealHandler(req, res, next);
    });

    app.post('/meals', (req: CustomRequest, res: Response, next: NextFunction) => {
        cacheService.bustRoute('/meals', req.headers['tenant-id']);
        mealsService.createMealHandler(req, res, next);
    });

    app.put('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        cacheService.bustRoutes(['/meals', req.url], req.headers['tenant-id']);
        mealsService.updateMealHandler(req, res, next);
    });

    app.delete('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        cacheService.bustRoute('/meals', req.headers['tenant-id']);
        mealsService.deleteMealHandler(req, res, next);
    });

    app.post('/meals/:mealId/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        cacheService.bustRoute(`/meals/${req.params.mealId}/foods`, req.headers['tenant-id'])
        mealFoodsService.addFoodsToMealHandler(req, res, next);
    });

};
