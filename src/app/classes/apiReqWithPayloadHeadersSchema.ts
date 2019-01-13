import {JoiObject} from "joi";

const Joi = require('joi');
import {apiReqHeadersSchema} from "./apiReqHeadersSchema";

export class apiReqWithPayloadHeadersSchema extends apiReqHeadersSchema{
    'content-type': JoiObject;
    constructor() {
        super();
        this['content-type'] = Joi.string().required().valid('application/json').insensitive()
    }
}