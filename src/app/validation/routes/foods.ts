import { ApiReqWithPayloadHeadersSchema } from "../../classes/request/apiReqWithPayloadHeadersSchema";
import { ApiReqHeadersSchema } from "../../classes/request/apiReqHeadersSchema";
import { JoiObject } from "joi";

const Joi = require("joi");

class Body  {
    name: JoiObject;
    measurement: JoiObject;
    imgSrc: JoiObject;
    constructor() {
        this.name = Joi.string().required().trim();
        this.measurement = Joi.string().required().trim();
        this.imgSrc = Joi.string().allow('').trim();
    }
}

const schemas = {
    createFood: Joi.object().keys({
        body: new Body()
    }).unknown(true),
    getOrDeleteFood: Joi.object().keys({
        params: {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateFood: Joi.object().keys({
        params: {
            foodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: new Body()
    }).unknown(true)
};

export { schemas as validation };
