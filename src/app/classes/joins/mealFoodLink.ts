import {ObjectID} from "bson";

export class MealFoodLink {
    _id?: ObjectID;
    mealId: ObjectID;
    foodId: ObjectID;
    qty: number;
    constructor(mealId: ObjectID, foodId: ObjectID, qty: number) {
        this.mealId = mealId;
        this.foodId = foodId;
        this.qty = qty;
    }
    setId(id: ObjectID) {
        this._id = id;
    }
}