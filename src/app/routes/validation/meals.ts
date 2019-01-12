import {apiReqWithPayloadHeadersSchema} from "../../classes/apiReqWithPayloadHeadersSchema";
import {apiReqHeadersSchema} from "../../classes/apiReqHeadersSchema";

const Joi = require("joi");

const schemas = {
    createMeal: Joi.object().keys({
        headers: Joi.object().keys(new apiReqWithPayloadHeadersSchema()).unknown(true),
        body : {
            name: Joi.string().required().trim(),
        }
    }).unknown(true),
    getOrDeleteMeal: Joi.object().keys({
        headers: Joi.object().keys(new apiReqHeadersSchema()).unknown(true),
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateMeal: Joi.object().keys({
        headers: Joi.object().keys(new apiReqWithPayloadHeadersSchema()).unknown(true),
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {
            name: Joi.string().required(),
        }
    }).unknown(true)
};

export { schemas as validation };