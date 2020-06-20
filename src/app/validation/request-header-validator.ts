import {CustomRequest} from "../classes/request/customRequest";
import {validation} from "./header";
import {HelperService} from "../services/helpers.service";
import {CustomResponse} from "../services/cache.service";
import {NextFunction} from "express";
const Joi = require('joi');

const validator = (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const regex = new RegExp('^(?!/user).+');
    const hasPayload = ['PUT', 'POST', 'PATCH'].includes(req.method);
    const prom = Joi.validate(req, validation(regex.test(req.path), hasPayload), HelperService.validationHandler);
    prom.then(() => {
        next();
    }).catch((error: any) => {
        HelperService.validationHandler(error, null);
    });
}

export { validator as requestHeaderValidator };
