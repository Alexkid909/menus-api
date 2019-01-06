import {Application, Request, Response} from "express";
import {MongoError} from "mongodb";
import {ObjectID} from "bson";
import {Meal} from "../classes/meal";


module.exports = (app: Application, db: any) => {
    const standardErrorMessage = () => {
        return {error: 'An error has occured'}
    };

    const mealsCollection = db.collection('meals');
    const mealFoodsCollection = db.collection('mealFoods');

    app.get('/meals', (req: Request, res: Response) => {
        mealsCollection.find({}).toArray((err: any, meals: any) => {
            if (err) {
                res.send(standardErrorMessage())
            } else {
                if (req.query.hasOwnProperty('includeFoods') && req.query.includeFoods === 'true') {
                    meals.forEach((meal: Meal) => {
                        let foods;
                        mealFoodsCollection.find({}, {mealId: meal._id}).forEach((doc: any) => {
                        })
                    });

                } else {
                    (err) ? res.send(standardErrorMessage()) : res.send(meals);
                }
                res.send(meals);
            }
        });
    });

    app.post('/meals', (req: Request, res: Response) => {
        const meal = new Meal(req.body.name);
        console.log('new meal', meal);
        if(!meal.name) {
            res.send({message:'Please provide a name for this meal'});
        } else {
            mealsCollection.insert(meal, (err: any, result: any) => {
                (err) ? res.send(standardErrorMessage()) : res.send(result.ops[0]);
            });
        }
    });

    app.get('/meals/:id', (req: Request, res: Response) => {
        const details = {'_id' : new ObjectID(req.params.id)};

        mealsCollection.findOne(details, (err: any, result: any) => {
            (err) ? res.send(standardErrorMessage()) : res.send(result);
        });
    });

    app.put('/meals/:id', (req: Request, res: Response) => {
        const meal = new Meal(req.body.name, req.body.foods);
        (!meal.name) && res.send('Please provide a name for this meal');
        console.log('updated meal', meal);
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        mealsCollection.updateOne(details, {$set: meal}).then((success: any) => {
            mealsCollection.findOne(details, (err: MongoError, item: any) => {
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

    app.delete('/meals/:id', (req: Request, res: Response) => {
        const id = new ObjectID(req.params.id);
        const details = {'_id' : id};
        mealsCollection.remove(details, (err: any, result: any) => {
            const success = {message: `Meal ${id} deleted!`};
            (err) ? res.send(standardErrorMessage()) : res.send(JSON.stringify(success));
        });
    });
};