import {ObjectID} from "bson";

export class Artefact {
    tenantId?: ObjectID;
    creatorId?: ObjectID;
    updatorId: ObjectID;
    imgSrc: string;
    _id?: ObjectID;

    constructor(tenantId: string, creatorId?: string, updatorId?: string, imgSrc?:string) {
        if(tenantId) this.tenantId = new ObjectID(tenantId);
        if(creatorId) this.creatorId = new ObjectID(creatorId);
        if(updatorId) this.updatorId = new ObjectID(updatorId);
        if(updatorId) this.updatorId = new ObjectID(updatorId);
        if(imgSrc) this.imgSrc = imgSrc;
    }

    get id() { return this._id }
}