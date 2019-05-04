import {ObjectID} from "bson";

export class Tenant {
    name: string;
    _id?: ObjectID;
    creatorId?: ObjectID;
    constructor(name: string, creatorId?: string) {
        this.name = name;
        if(creatorId) this.creatorId = new ObjectID(creatorId);
    }
}