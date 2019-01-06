import {Application, NextFunction, Request, Response} from "express";
import { ObjectID } from "bson";
import { MealFoodLink } from "../classes/mealFoodLink";
import { MealFoodLinksService } from "../services/meal-foods.service";
import { ApiResponseBody } from "../classes/apiResponseBody";
import {ApiSuccessBody} from "../classes/apiSuccessBody";

module.exports = (app: Application, db: any) => {
    const mealFoodsService = new MealFoodLinksService(db);
    const standardErrorMessage = () => {
        return {error: 'An error has occured'}
    };
    const validateFields = () => {

    };
    const mealFoodsCollection = db.collection('mealFoods');


    app.post('/meals/:mealId/foods', (req: Request, res: Response) => {
        const mealFood = new MealFoodLink(new ObjectID(req.params.mealId), new ObjectID(req.body.mealFood.foodId), req.body.mealFood.qty);
        console.log('new mealFood', mealFood);
        if(!mealFood.mealId || !mealFood.qty || !mealFood.foodId) {
            res.send({message:'Please provide a food id and quantity'});
        } else {
            mealFoodsCollection.insert(mealFood, (err: any, result: any) => {
                console.log('ops', result.ops);
                (err) ? res.send(standardErrorMessage()) : res.send(result.ops[0]);
            });
        }
    });


    app.get('/meals/:mealId/foods', (req: Request, res: Response) => {
        mealFoodsService.getMealFoodLinks(req.params.mealId).then(success => {
            res.send(success);
        }, error => {
            console.log(error);
        });
    });

    app.delete('/meal-foods/:mealFoodId', (req: Request, res: Response, next: NextFunction) => {
        const body = new ApiSuccessBody('success', []);
        mealFoodsService.deleteMealFoodLink(req.params.mealFoodId).then(doc => {
            body.newMessage(`MealFoodLink ${doc.value._id} deleted`);
            console.log(body);
            res.send(body);
        }).catch(next);
    });
};