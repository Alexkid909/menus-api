import {ObjectID} from "bson";

export class Tenant {
    name: string;
    _id?: ObjectID;
    constructor(name: string) {
        this.name = name;
    }
}