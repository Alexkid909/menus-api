import {Application, NextFunction, Request, Response} from "express";
import {MealService} from "../services/meals.service";

module.exports = (app: Application, db: any) => {

    const mealsService = new MealService(db);

    app.get('/meals', (req: Request, res: Response, next: NextFunction) => {
        mealsService.getMeals(req, res, next);
    });

    app.post('/meals', (req: Request, res: Response, next: NextFunction) => {
        mealsService.createMeal(req, res, next);
    });

    app.get('/meals/:id', (req: Request, res: Response, next: NextFunction) => {
        mealsService.getMeal(req, res, next);
    });

    app.put('/meals/:id', (req: Request, res: Response, next: NextFunction) => {
        mealsService.updateMeal(req, res, next);
    });

    app.delete('/meals/:id', (req: Request, res: Response, next: NextFunction) => {
        mealsService.deleteMeal(req, res, next);
    });
};