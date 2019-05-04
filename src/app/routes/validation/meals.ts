import { ApiReqWithPayloadHeadersSchema } from "../../classes/request/apiReqWithPayloadHeadersSchema";
import { ApiReqHeadersSchema } from "../../classes/request/apiReqHeadersSchema";
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
        headers: Joi.object().keys(new ApiReqWithPayloadHeadersSchema()).unknown(true),
        body : new Body()
    }).unknown(true),
    getOrDeleteMeal: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqHeadersSchema()).unknown(true),
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    getMeals: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqHeadersSchema()).unknown(true)
    }).unknown(true),
    updateMeal: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqWithPayloadHeadersSchema()).unknown(true),
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: new Body()
    }).unknown(true)
};

export { schemas as validation };