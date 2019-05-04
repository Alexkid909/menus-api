import { Application, NextFunction, Response } from "express";
import { FoodsService } from "../services/foods.service";
import { CustomRequest } from "../classes/request/customRequest";


module.exports = (app: Application, db: any) => {
    const foodService = new FoodsService(db);

    app.post('/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        foodService.createFoodHandler(req, res, next);
    });

    app.get('/foods/:foodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        foodService.getFoodHandler(req, res, next);
    });

    app.get('/foods', (req: CustomRequest, res: Response, next: NextFunction) => {
        foodService.getFoodsHandler(req, res, next);
    });


    app.put('/foods/:foodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        foodService.updateFoodHandler(req, res, next);
    });

    app.delete('/foods/:foodId', (req: CustomRequest, res: Response, next: NextFunction) => {
        foodService.deleteFoodHandler(req, res, next);
    });
};