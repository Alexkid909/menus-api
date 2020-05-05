import { Application, NextFunction, Response } from "express";
import { FoodsService } from "../services/foods.service";
import { CustomRequest } from "../classes/request/customRequest";
import {CacheService} from "../services/cache.service";


module.exports = (app: Application, db: any) => {
    const foodService = new FoodsService(db);
    const cacheService = new CacheService();

    app.use('/foods', cacheService.cacheRoute(600));

    app.get('/foods/:foodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        foodService.getFoodHandler(req, res, next);
    });

    app.get('/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        foodService.getFoodsHandler(req, res, next);
    });

    app.post('/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        cacheService.bustRoute(req.path);
        foodService.createFoodHandler(req, res, next);
    });

    app.put('/foods/:foodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        cacheService.bustRoutes(['/foods', req.path]);
        foodService.updateFoodHandler(req, res, next);
    });

    app.delete('/foods/:foodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        cacheService.bustRoute(req.path);
        foodService.deleteFoodHandler(req, res, next);
    });
};
