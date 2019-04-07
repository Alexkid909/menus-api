import { ApiTenantReqWithPayloadHeadersSchema } from "../../classes/request/apiTenantReqWithPayloadHeadersSchema";
import { ApiTenantReqHeadersSchema } from "../../classes/request/apiTenantReqHeadersSchema";
import {JoiObject} from "joi";

const Joi = require("joi");

class Body {
    name: JoiObject;
    constructor() {
        this.name = Joi.string().required().trim();
    }
}

const schemas = {
    createMeal: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqWithPayloadHeadersSchema()).unknown(true),
        body : new Body()
    }).unknown(true),
    getOrDeleteMeal: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqHeadersSchema()).unknown(true),
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    getMeals: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqHeadersSchema()).unknown(true)
    }).unknown(true),
    updateMeal: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqWithPayloadHeadersSchema()).unknown(true),
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: new Body()
    }).unknown(true)
};

export { schemas as validation };