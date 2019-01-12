const Joi = require('joi');
import {JoiObject} from "joi";

export class apiReqHeadersSchema {

    accept: JoiObject;
    'accept-encoding': JoiObject;
    'accept-language': JoiObject;
    'user-agent': JoiObject;
    'referer': JoiObject;
    'connection': JoiObject;
    'cache-control': JoiObject;
    'postman-token': JoiObject;
    'host': JoiObject;
    constructor() {
        this['accept'] = Joi.string().required().insensitive().valid('application/json'),
        this['accept-encoding'] = Joi.string().insensitive(),
        this['accept-language'] = Joi.string().insensitive(),
        this['user-agent'] = Joi.string().insensitive(),
        this['referer'] = Joi.string().insensitive(),
        this['connection'] = Joi.string().insensitive(),
        this['cache-control'] = Joi.string().insensitive(),
        this['postman-token'] = Joi.string().insensitive(),
        this['host'] = Joi.string().insensitive().required()
    }
}