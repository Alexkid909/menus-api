import {ApiReqWithPayloadHeadersSchema} from "../../classes/request/apiReqWithPayloadHeadersSchema";
import {ApiReqHeadersSchema} from "../../classes/request/apiReqHeadersSchema";

const Joi = require("joi");
const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

const reqHeaders = new ApiReqHeadersSchema(false);
const reqWithPayloadHeaders = new ApiReqWithPayloadHeadersSchema(false);

const schemas = {
    createUser: Joi.object().keys({
        headers: Joi.object().keys(reqWithPayloadHeaders).unknown(true),
        body : {
            firstName:Joi.string().required().min(1),
            lastName: Joi.string().required().min(1),
            email: Joi.string().required().min(1).email(),
            userName: Joi.string(),
            password: Joi.string().required().min(8).regex(passwordRegex),
            passwordConfirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
        }
    }).unknown(true),
    authenticateUser: Joi.object().keys({
        headers: Joi.object().keys(reqWithPayloadHeaders).unknown(true),
        body : Joi.object().keys({
            email: Joi.string().min(1).email(),
            userName: Joi.string().min(1),
            password: Joi.string().required().min(8).regex(passwordRegex),
        }).or('email', 'userName')
    }).unknown(true),
    getOrDeleteUser: Joi.object().keys({
        headers: Joi.object().keys(reqHeaders).unknown(true),
    }).unknown(true),
    getOrDeleteUserTenant: Joi.object().keys({
        headers: Joi.object().keys(reqHeaders).unknown(true),
        params: {
            tenantId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateUser: Joi.object().keys({
        headers: Joi.object().keys(reqWithPayloadHeaders).unknown(true),
        body: {
            firstName:Joi.string().min(1),
            lastName: Joi.string().min(1),
            email: Joi.string().email().min(1),
            userName: Joi.string().min(1),
            password: Joi.string().min(8).regex(passwordRegex),
            passwordConfirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
        }
    }).unknown(true)
};

export { schemas as validation };
