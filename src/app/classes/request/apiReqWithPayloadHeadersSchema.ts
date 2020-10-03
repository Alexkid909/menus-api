import {JoiObject} from "joi";

const Joi = require('joi');
import { ApiReqHeadersSchema } from "./apiReqHeadersSchema";

export class ApiReqWithPayloadHeadersSchema extends ApiReqHeadersSchema{
    'content-type': JoiObject;
    accept: JoiObject;
    constructor(tenantSpecific: boolean = true) {
        super(tenantSpecific);
        this['accept'] = Joi.string().required().insensitive().valid('application/json');
        this['content-type'] = Joi.string().required().valid('application/json').insensitive()
    }
}
