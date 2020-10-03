import { ApiReqWithPayloadHeadersSchema } from "../../classes/request/apiReqWithPayloadHeadersSchema";
import { ApiReqHeadersSchema } from "../../classes/request/apiReqHeadersSchema";
import {JoiObject} from "joi";

const Joi = require("joi");

class Body {
    name: JoiObject;
    imgSrc: JoiObject;

    constructor() {
        this.name = Joi.string().required().trim();
        this.imgSrc = Joi.string().allow('').trim();
    }
}

const schemas = {
    createMeal: Joi.object().keys({
        body : new Body()
    }).unknown(true),
    getOrDeleteMeal: Joi.object().keys({
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateMeal: Joi.object().keys({
        params: {
            mealId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: new Body()
    }).unknown(true)
};

export { schemas as validation };
