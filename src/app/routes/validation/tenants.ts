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
        headers: Joi.object().keys(reqWithPayloadHeaders).unknown(true),
        body : new Body()
    }).unknown(true),
    getOrDeleteTenant: Joi.object().keys({
        headers: Joi.object().keys(reqHeaders).unknown(true),
        params: {
            tenantId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    getTenants: Joi.object().keys({
        headers: Joi.object().keys(reqHeaders).unknown(true),
    }).unknown(true),
    updateTenant: Joi.object().keys({
        headers: Joi.object().keys(reqWithPayloadHeaders).unknown(true),
        params: {
            tenantId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {
            name: Joi.string().required()
        }
    }).unknown(true),
    createTenantUsers: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqWithPayloadHeadersSchema()).unknown(true),
        params: Joi.object().keys({
            userId: Joi.string().required().trim()
        }),
        body: Joi.object().keys(new Body()).unknown(true)
    }).unknown(true),
    getUsersTenants: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqHeadersSchema()).unknown(true),
    }).unknown(true),
    getTenantUsers: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqHeadersSchema()).unknown(true),
        params: {
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    deleteTenantUsers: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqHeadersSchema()).unknown(true),
        params: {
            tenantuserId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateTenantUsers: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqWithPayloadHeadersSchema()).unknown(true),
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