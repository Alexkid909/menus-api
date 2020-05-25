import {Application, NextFunction, Response} from "express";
import {MealService} from "../services/meals.service";
import { CustomRequest } from "../classes/request/customRequest";
import {MealFoodsService} from "../services/meal-foods.service";
import {CacheService, KeyValuePair} from "../services/cache.service";

module.exports = (app: Application, db: any) => {
    const mealsService = new MealService(db);
    const mealFoodsService = new MealFoodsService(db);
    const cacheService = new CacheService();

    app.use('/meals', cacheService.cacheTenantRoute);

    app.get('/meals', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.getMealsHandler(req, res, next);
    });

    app.get('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.getMealHandler(req, res, next);
    });

    app.post('/meals', (req: CustomRequest, res: Response, next: NextFunction) => {
        const cachePrefix = new KeyValuePair('tenant', req.headers['tenant-id']);
        cacheService.bustRoute('/meals', [cachePrefix]);
        mealsService.createMealHandler(req, res, next);
    });

    app.put('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        const cachePrefix = new KeyValuePair('tenant', req.headers['tenant-id']);
        cacheService.bustRoutes(['/meals', req.url], [cachePrefix]);
        mealsService.updateMealHandler(req, res, next);
    });

    app.delete('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        const cachePrefix = new KeyValuePair('tenant', req.headers['tenant-id']);
        cacheService.bustRoute('/meals', [cachePrefix]);
        mealsService.deleteMealHandler(req, res, next);
    });

    app.post('/meals/:mealId/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        const cachePrefix = new KeyValuePair('tenant', req.headers['tenant-id']);
        cacheService.bustRoute(`/meals/${req.params.mealId}/foods`, [cachePrefix]);
        mealFoodsService.addFoodsToMealHandler(req, res, next);
    });

};
