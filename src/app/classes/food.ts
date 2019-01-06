import {ObjectID} from "bson";

export class Food {
    constructor(name: string, measurement: string) {
        this.name = name;
        this.measurement = measurement;
    }
    _id?: ObjectID;
    name: string;
    measurement: string;
    set id(id: ObjectID) {
        this._id = id;
    }
}
