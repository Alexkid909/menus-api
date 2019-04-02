import {ObjectID} from "bson";

export class MealFood {
    name: string;
    _id: ObjectID;
    measurement: string;
    qty: number;
    constructor(name: string, id: ObjectID, measurement: string, qty: number) {
        this.name = name;
        this._id = id;
        this.measurement = measurement;
        this.qty = qty;
    }
}