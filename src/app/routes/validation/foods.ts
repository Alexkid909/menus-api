import { ApiTenantReqWithPayloadHeadersSchema } from "../../classes/request/apiTenantReqWithPayloadHeadersSchema";
import { ApiTenantReqHeadersSchema } from "../../classes/request/apiTenantReqHeadersSchema";
import {JoiObject} from "joi";

const Joi = require("joi");

class Body {
    name: JoiObject;
    measurement: JoiObject;
    constructor() {
        this.name = Joi.string().required().trim();
        this.measurement = Joi.string().required().trim();

    }
}

const schemas = {
    createFood: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqWithPayloadHeadersSchema()).unknown(true),
        body : new Body()
    }).unknown(true),
    getOrDeleteFood: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqHeadersSchema()).unknown(true),
        params: {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    getFoods: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqHeadersSchema()).unknown(true)
    }).unknown(true),
    updateFood: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqWithPayloadHeadersSchema()).unknown(true),
        params: {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: new Body()
    }).unknown(true)
};

export { schemas as validation };