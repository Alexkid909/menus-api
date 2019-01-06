import {Food} from "../classes/food";
import {ObjectID} from "bson";

export class Meal {
    constructor(name: string, foods?: Array<Food>) {
        this.name = name;
        this.foods = foods;
    }
    _id: ObjectID;
    name: string;
    foods?: Array<Food>
}