import {ObjectID} from "bson";

export class Artefact {
    tenantId?: ObjectID;
    creatorId?: ObjectID;
    _updaterId: ObjectID;
    _id?: ObjectID;

    constructor(tenantId: string, creatorId?: string) {
        if(tenantId) this.tenantId = new ObjectID(tenantId);
        if(creatorId) {
            this.creatorId = this._updaterId = new ObjectID(creatorId);
        }
    }

    get id() { return this._id }

    set updaterId(updaterId: string) {
        this._updaterId = new ObjectID(updaterId);
    }
}