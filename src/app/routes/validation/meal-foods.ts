import {ApiTenantReqHeadersSchema} from "../../classes/request/apiTenantReqHeadersSchema";
import { ApiTenantReqWithPayloadHeadersSchema } from "../../classes/request/apiTenantReqWithPayloadHeadersSchema";
import {JoiObject} from "joi";

const Joi = require("joi");

class Body {
    foodId: JoiObject;
    qty: JoiObject;
    constructor() {
        this.foodId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        this.qty = Joi.number().required().min(1)
    }
}

const schemas = {
    createMealFoods: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqWithPayloadHeadersSchema()).unknown(true),
        params: Joi.object().keys({
            mealId: Joi.string().required().trim()
        }),
        body: Joi.object().keys(new Body()).unknown(true)
    }).unknown(true),
    getMealsFoods: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqHeadersSchema()).unknown(true),
    }).unknown(true),
    getMealFoods: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqHeadersSchema()).unknown(true),
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    deleteMealFoods: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqHeadersSchema()).unknown(true),
        params: {
            mealFoodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateMealFoods: Joi.object().keys({
        headers: Joi.object().keys(new ApiTenantReqWithPayloadHeadersSchema()).unknown(true),
        params: {
            mealFoodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            qty: Joi.number().required().min(1)
        }
    }).unknown(true)
};

export { schemas as validation };