import {JoiObject} from "joi";

const Joi = require('joi');
import { ApiReqHeadersSchema } from "./apiReqHeadersSchema";

export class ApiReqWithPayloadHeadersSchema extends ApiReqHeadersSchema{
    'content-type': JoiObject;
    constructor(tenantSpecific: boolean = true, authenticated: boolean = true) {
        super(tenantSpecific, authenticated);
        this['content-type'] = Joi.string().required().valid('application/json').insensitive()
    }
}