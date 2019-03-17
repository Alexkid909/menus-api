import {ObjectID} from "bson";

export class Tenant {
    name: string;
    _id?: ObjectID;
    constructor(name: string, id: ObjectID) {
        this.name = name;
        this._id = id;
    }
}