import {ObjectID} from "bson";

export class Artefact {
    tenantId?: ObjectID;
    _id?: ObjectID;

    constructor(tenantId: string) {
        if(tenantId) this.tenantId = new ObjectID(tenantId);
    }

    get id() { return this._id }
}