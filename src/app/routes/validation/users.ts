import {ApiReqWithPayloadHeadersSchema} from "../../classes/request/apiReqWithPayloadHeadersSchema";
import {ApiReqHeadersSchema} from "../../classes/request/apiReqHeadersSchema";

const Joi = require("joi");
const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


const schemas = {
    createUser: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqWithPayloadHeadersSchema()).unknown(true),
        body : {
            firstName:Joi.string().required().min(1),
            lastName: Joi.string().required().min(1),
            email: Joi.string().required().min(1).email(),
            username: Joi.string(),
            password: Joi.string().required().min(8).regex(passwordRegex),
            passwordConfirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
        }
    }).unknown(true),
    authenticateUser: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqWithPayloadHeadersSchema()).unknown(true),
        body : Joi.object().keys({
            email: Joi.string().min(1).email(),
            username: Joi.string().min(1),
            password: Joi.string().required().min(8).regex(passwordRegex),
        }).or('email', 'username')
    }).unknown(true),
    getOrDeleteUser: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqHeadersSchema()).unknown(true),
        params: {
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }).unknown(true),
    updateUser: Joi.object().keys({
        headers: Joi.object().keys(new ApiReqWithPayloadHeadersSchema()).unknown(true),
        params: {
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        },
        body: {

            firstName:Joi.string().min(1),
            lastName: Joi.string().min(1),
            email: Joi.string().email().min(1),
            username: Joi.string().min(1),
            password: Joi.string().min(8).regex(passwordRegex),
            passwordConfirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })

}
    }).unknown(true)
};

export { schemas as validation };