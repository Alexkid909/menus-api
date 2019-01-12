import {apiReqHeadersSchema} from "../../classes/apiReqHeadersSchema";
import {apiReqWithPayloadHeadersSchema} from "../../classes/apiReqWithPayloadHeadersSchema";

const Joi = require("joi");

const schemas = {
    createMealFoods: Joi.object().keys({
        headers: Joi.object().keys(new apiReqWithPayloadHeadersSchema()).unknown(true),
        params: Joi.object().keys({
            mealId: Joi.string().required().trim()
        }),
        body: Joi.object().keys({
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            qty: Joi.number().required().min(1)
        }).unknown(true)
    }).unknown(true),
    getMealsFoods: Joi.object().keys({
        headers: Joi.object().keys(new apiReqHeadersSchema()).unknown(true),
    }).unknown(true),
    getMealFoods: Joi.object().keys({
        headers: Joi.object().keys(new apiReqHeadersSchema()).unknown(true),
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    deleteMealFoods: Joi.object().keys({
        headers: Joi.object().keys(new apiReqHeadersSchema()).unknown(true),
        params: {
            mealFoodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateMealFoods: Joi.object().keys({
        headers: Joi.object().keys(new apiReqWithPayloadHeadersSchema()).unknown(true),
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