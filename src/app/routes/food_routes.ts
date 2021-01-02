import { Application, NextFunction, Response } from "express";
import { FoodsService } from "../services/foods.service";
import { CustomRequest } from "../classes/request/customRequest";
import {CacheService, KeyValuePair} from "../services/cache.service";
import { TenantUsersService } from "../services/tenant-users.service";


module.exports = (app: Application, db: any) => {
    const foodService = new FoodsService(db);
    const tenantUsersService = new TenantUsersService(db)
    const cacheService = new CacheService();

    app.use('/foods', tenantUsersService.userHasTenantAccess);
    // app.use('/foods', cacheService.cacheTenantRoute);

    app.get('/foods/:foodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        foodService.getFoodHandler(req, res, next);
    });

    app.get('/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        foodService.getFoodsHandler(req, res, next);
    });

    app.post('/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        // cacheService.bustTenantRoute(req, req.path);
        foodService.createFoodHandler(req, res, next);
    });

    app.put('/foods/:foodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        // cacheService.bustTenantRoutes(req, ['/foods', req.path]);
        foodService.updateFoodHandler(req, res, next);
    });

    app.delete('/foods/:foodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        // cacheService.bustTenantRoutes(req, ['/foods', req.path]);
        foodService.deleteFoodHandler(req, res, next);
    });
};
