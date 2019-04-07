import {ObjectID} from "bson";

export class DefaultQuery {
    _id?: ObjectID;
    tenantId?: ObjectID;
    [ key: string ]: any;

    constructor(id?: string, tenantId?: string) {
        if(id) this.id = id;
        if(tenantId) this.setTenantId(tenantId);
    }

    setTenantId(tenantId: string) {
        this.tenantId = new ObjectID(tenantId);
    }

    set id(id: string) {
        this._id = new ObjectID(id);
    }

    get id() {
        return this._id.toHexString();
    }

    setProperty(propName: string, value: string) {
        this[propName] = value;
    }
}