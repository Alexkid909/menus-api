import { ApiReqHeadersSchema } from "../../classes/request/apiReqHeadersSchema";
import { ApiReqWithPayloadHeadersSchema } from "../../classes/request/apiReqWithPayloadHeadersSchema";
import { JoiObject } from "joi";

const Joi = require("joi");

class MealFood {
    foodId: JoiObject;
    qty: JoiObject;
    constructor() {
        this.foodId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        this.qty = Joi.number().required().min(1)
    }
}

const schemas = {
    createMealFoods: Joi.object().keys({
        params: Joi.object().keys({
            mealId: Joi.string().required().trim()
        }),
        body: Joi.array().items(new MealFood())
    }).unknown(true),
    getMealFoods: Joi.object().keys({
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    deleteMealFoods: Joi.object().keys({
        params: {
            mealFoodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateMealFoods: Joi.object().keys({
        params: {
            mealFoodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {
            qty: Joi.number().required().min(1)
        }
    }).unknown(true)
};

export { schemas as validation };
