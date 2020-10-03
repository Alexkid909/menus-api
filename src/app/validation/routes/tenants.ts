import {JoiObject} from "joi";
import {ApiReqHeadersSchema} from "../../classes/request/apiReqHeadersSchema";
import {ApiReqWithPayloadHeadersSchema} from "../../classes/request/apiReqWithPayloadHeadersSchema";

const Joi = require("joi");

const reqHeaders = new ApiReqHeadersSchema(false);
const reqWithPayloadHeaders = new ApiReqWithPayloadHeadersSchema(false);

class Body  {
    name: JoiObject;
    constructor() {
        this.name = Joi.string().required().trim();
    }
}

const schemas = {
    createTenant: Joi.object().keys({
        body : new Body()
    }).unknown(true),
    getOrDeleteTenant: Joi.object().keys({
        params: {
            tenantId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateTenant: Joi.object().keys({
        params: {
            tenantId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {
            name: Joi.string().required()
        }
    }).unknown(true),
    createTenantUsers: Joi.object().keys({
        params: Joi.object().keys({
            userId: Joi.string().required().trim()
        }),
        body: Joi.object().keys(new Body()).unknown(true)
    }).unknown(true),
    getTenantUsers: Joi.object().keys({
        params: {
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    deleteTenantUsers: Joi.object().keys({
        params: {
            tenantuserId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateTenantUsers: Joi.object().keys({
        params: {
            tenantuserId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {
            tenantId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            qty: Joi.number().required().min(1)
        }
    }).unknown(true)
};

export { schemas as validation };
