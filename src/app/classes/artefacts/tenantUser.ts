import {ObjectID} from "bson";

export class TenantUser {
    _id: ObjectID;
    userId: string;
    tenantId: string;
    constructor(userId: string, id: ObjectID, tenantId: string) {
        this.userId = userId;
        this._id = id;
        this.tenantId = tenantId;
    }
}