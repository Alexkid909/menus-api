import {Application, NextFunction, Request, Response} from "express";
import { FoodsService } from "../services/foods.service";

const Joi = require("joi");

module.exports = (app: Application, db: any) => {
    const foodService = new FoodsService(db);

    app.post('/foods', (req: Request, res: Response, next: NextFunction) => {
        foodService.createFood(req, res, next);
    });

    app.get('/foods/:foodId', (req: Request, res: Response, next: NextFunction) => {
        foodService.getFood(req, res, next);
    });

    app.get('/foods', (req: Request, res: Response, next: NextFunction) => {
        foodService.getFoods(req, res, next);
    });


    app.put('/foods/:foodId', (req: Request, res: Response, next: NextFunction) => {
        foodService.updateFood(req, res, next);
    });

    app.delete('/foods/:foodId', (req: Request, res: Response, next: NextFunction) => {
        foodService.deleteFood(req, res, next);
    });
};