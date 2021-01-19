import {FindOneOptions} from "mongodb";

export class DefaultProjection {
    tenantId = false;
    softDeleted?: boolean;
    [ key: string ]: any;
    constructor(softDeleted?: boolean) {
        this.softDeleted = softDeleted;
    }
}

export class DefaultQueryOptions implements FindOneOptions {
    projection: DefaultProjection;
    constructor(projection?: DefaultProjection) {
        this.projection = projection || new DefaultProjection();
    }
}
