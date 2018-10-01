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
        const food: Food = {
            name: req.body.name,
            measurement: req.body.measurement
        };
        foodsCollection.insert(food, (err: any, result: any) => {
            console.log('result', result.ops);
            if(err) {
                res.status(500);
                res.send(standardErrorMessage())
            } else {
                res.status(201);
                res.send(result.ops[0]);
            }
        });
        console.log('request body', req.body);
    });

    app.get('/foods/:id', (req: Request, res: Response) => {
        const details = {'_id' : new ObjectID(req.params.id)}
        foodsCollection.findOne(details, (err: any, result: any) => {
            (err) ? res.send(standardErrorMessage()) : res.send(result);
        });
    });

    app.get('/foods', (req: Request, res: Response) => {
        db.collection('foods').find({}).toArray((err: any, result: any) => {
            (err) ? res.send(standardErrorMessage()) : res.send(result);
        });
    });

    app.put('/foods/:id', (req: Request, res: Response) => {
        console.log('new put');
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        const note = {
            name: req.body.name,
            measurement: req.body.measurement
        };
        foodsCollection.updateOne(details, {$set: note}).then((success: any) => {
            foodsCollection.findOne(details, (err: MongoError, item: any) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('item', item);
                    res.send(item);
                }
            });
        }, (error: any) => {
            console.log('error', error)
        })
    });

    app.delete('/foods/:id', (req: Request, res: Response) => {
        const id = new ObjectID(req.params.id);
        const details = {'_id' : id};
        foodsCollection.remove(details, (err: any, result: any) => {
            const success = {message: `Food ${id} deleted!`};
            (err) ? res.send(standardErrorMessage()) : res.send(JSON.stringify(success));
        });
    });
};