const Joi = require('joi');
import {JoiObject} from "joi";
import { ApiReqHeadersSchema } from './apiReqHeadersSchema';

export class ApiTenantReqHeadersSchema extends ApiReqHeadersSchema {
    'tenant-id': JoiObject;
    constructor(){
        super();
        this['tenant-id'] = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }
}