import {Application, NextFunction, Response} from "express";
import {MealService} from "../services/meals.service";
import { CustomRequest } from "../classes/request/customRequest";
import {MealFoodsService} from "../services/meal-foods.service";
import {CacheService, KeyValuePair} from "../services/cache.service";
import {TenantUsersService} from "../services/tenant-users.service";

module.exports = (app: Application, db: any) => {
    const mealsService = new MealService(db);
    const tenantUsersService = new TenantUsersService(db)
    const mealFoodsService = new MealFoodsService(db);
    const cacheService = new CacheService();

    app.use('/foods', tenantUsersService.userHasTenantAccess);
    app.use('/meals', cacheService.cacheTenantRoute);

    app.get('/meals', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.getMealsHandler(req, res, next);
    });

    app.get('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        mealsService.getMealHandler(req, res, next);
    });

    app.post('/meals', (req: CustomRequest, res: Response, next: NextFunction) => {
        const cachePrefix = new KeyValuePair('tenant', req.headers['tenant-id']);
        cacheService.bustTenantRoute(req, '/meals');
        mealsService.createMealHandler(req, res, next);
    });

    app.put('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        cacheService.bustTenantRoutes(req, ['/meals', req.url]);
        mealsService.updateMealHandler(req, res, next);
    });

    app.delete('/meals/:mealId', (req: CustomRequest, res: Response, next: NextFunction) => {
        cacheService.bustTenantRoute(req, '/meals');
        mealsService.deleteMealHandler(req, res, next);
    });

    app.post('/meals/:mealId/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        cacheService.bustTenantRoute(req, `/meals/${req.params.mealId}/foods`);
        mealFoodsService.addFoodsToMealHandler(req, res, next);
    });

};
