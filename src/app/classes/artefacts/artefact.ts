import {ObjectID} from "bson";

export class Artefact {
    tenantId: ObjectID;
    private _id?: ObjectID;

    constructor(tenantId: ObjectID) {
        this.tenantId = tenantId;
    }

    get id () { return this._id }
}