import {JoiObject} from "joi";

const Joi = require('joi');
import { ApiTenantReqHeadersSchema } from "./apiTenantReqHeadersSchema";

export class ApiTenantReqWithPayloadHeadersSchema extends ApiTenantReqHeadersSchema{
    'content-type': JoiObject;
    constructor() {
        super();
        this['content-type'] = Joi.string().required().valid('application/json').insensitive()
    }
}