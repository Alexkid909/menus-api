import {MealFoodLink} from "../classes/mealFoodLink";
import {ObjectID} from "bson";
import {Food} from "../classes/food";
import {Collection} from "mongodb";
import {MealFood} from "../classes/mealFood";


export class MealFoodLinksService {
    mealFoodsCollection: Collection;
    foodsCollection: Collection;

    constructor(db: any) {
        this.foodsCollection = db.collection('foods');
        this.mealFoodsCollection = db.collection('mealFoods');
    }


    getMealFoodLinks(mealId: string) : Promise<any> {
        return new Promise((resolve, reject) => {
            const mealFoodsQuery = {'mealId' : new ObjectID(mealId)};
            const mealFoodsProjection = {
                'mealId': false
            };
            this.mealFoodsCollection.find(mealFoodsQuery, {projection: mealFoodsProjection}).toArray((err: any, mealFoods: Array<MealFoodLink>) => {
                if (err) {
                    reject(err);
                } else {
                    const foodsQueryArray = mealFoods.map((mealFood: MealFoodLink) => new ObjectID(mealFood.foodId));
                    this.foodsCollection.find({ _id: { $in: foodsQueryArray } }).toArray((err: any, foods: Array<Food>) => {
                        const responseBody = mealFoods.map((mealFood: MealFoodLink) => {
                            const food = foods.find((food: Food) => food._id.equals(mealFood.foodId));
                            if (!food) {
                                return undefined
                            } else {
                                return new MealFood(food.name, mealFood._id, food.measurement, mealFood.qty);
                            }
                        });
                        if (responseBody) {
                            resolve(responseBody);
                        } else {
                            reject('no foods found for this meal');
                        }
                    });
                }
            });

        });
    };

    deleteMealFoodLink(mealFoodId: string) {
        const details = {'_id' : new ObjectID(mealFoodId)};
        return this.mealFoodsCollection.findOneAndDelete(details, {projection: '_id'})
    };

}