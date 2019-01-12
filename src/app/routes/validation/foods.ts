import {apiReqWithPayloadHeadersSchema} from "../../classes/apiReqWithPayloadHeadersSchema";
import {apiReqHeadersSchema} from "../../classes/apiReqHeadersSchema";

const Joi = require("joi");

const schemas = {
    createFood: Joi.object().keys({
        headers: Joi.object().keys(new apiReqWithPayloadHeadersSchema()).unknown(true),
        body : {
            name: Joi.string().required().trim(),
            measurement: Joi.string().required().trim(),
        }
    }).unknown(true),
    getOrDeleteFood: Joi.object().keys({
        headers: Joi.object().keys(new apiReqHeadersSchema()).unknown(true),
        params: {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateFood: Joi.object().keys({
        headers: Joi.object().keys(new apiReqWithPayloadHeadersSchema()).unknown(true),
        params: {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {
            name: Joi.string().required(),
            measurement: Joi.string().required(),
        }
    }).unknown(true)
};

export { schemas as validation };