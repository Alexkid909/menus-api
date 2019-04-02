import {ValidationError} from "../classes/internalErrors/validationError";

export class HelperService {
    static validationHandler(error: any, value: any) {
        if (error) {
            const friendlyMessages = error.details.map((detail: any) => detail.message);
            return Promise.reject(new ValidationError(error.name, friendlyMessages, error))
        }
        return Promise.resolve(value);
    }
}