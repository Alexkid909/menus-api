import { ObjectID } from "bson";

export class TenantUserLink {
    _id?: ObjectID;
    userId: ObjectID;
    tenantId: ObjectID;
    constructor(userId: ObjectID, tenantId: ObjectID) {
        this.userId = userId;
        this.tenantId = tenantId;
    }
    setId(id: ObjectID) {
        this._id = id;
    }
}