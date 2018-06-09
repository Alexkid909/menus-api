import {Application, Request, Response} from "express";
// import { Note } from "../interfaces/note";
import {MongoError} from "mongodb";
import {ObjectID} from "bson";
import { Food } from '../interfaces/food';

module.exports = (app: Application, db: any) => {
    const menuCollection = db.collection('menus');
    const standardErrorMessage = () => {
        return {error: 'An error has occured'}
    };
    const foodsCollection = db.collection('foods');

    app.post('/foods', (req: Request, res: Response) => {
        console.log(req);
        const food: Food = {
            name: req.body.name,
            denomination: req.body.denomination,
        };
        foodsCollection.insert(food, (err: any, result: any) => {
            console.log(result.ops);
            (err) ? res.send(standardErrorMessage()) : res.send(result.ops[0]);
        });
        console.log(req.body);
    });

};