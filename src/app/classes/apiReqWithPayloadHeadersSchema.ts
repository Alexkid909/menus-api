import {JoiObject} from "joi";

const Joi = require('joi');
import {apiReqHeadersSchema} from "./apiReqHeadersSchema";

export class apiReqWithPayloadHeadersSchema extends apiReqHeadersSchema{
    'Content-Type': JoiObject;
    constructor() {
        super();
        this['Content-Type'] = Joi.string().required().valid('application/json')
    }
}