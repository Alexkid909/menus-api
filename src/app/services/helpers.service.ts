const rateLimit = require("express-rate-limit");
import {ValidationError} from "../classes/internalErrors/validationError";
import {NextFunction} from "express";

export class HelperService {
    static validationHandler(error: any, value: any) {
        if (error) {
            const friendlyMessages = error.details.map((detail: any) => detail.message);
            return Promise.reject(new ValidationError(error.name, friendlyMessages, error))
        }
        return Promise.resolve(value);
    }

    static apiLimiter(maxRequests = 1000, periodMins = 10) {
        return rateLimit({
            windowMs: periodMins * 60 * 1000,
            max: maxRequests
        });
    }

    static logRateLimit(req: any, res: Response, next: NextFunction) {
        console.log('Rate Limit', req.path, req.rateLimit);
        next();
    }
}
