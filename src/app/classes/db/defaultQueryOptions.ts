import {FindOneOptions} from "mongodb";

class CustomProjection {
    tenantId = false;
    [ key: string ]: any;
}

export class DefaultQueryOptions implements FindOneOptions{
    projection: CustomProjection;
    constructor() {
        this.projection = new CustomProjection();
    }
};