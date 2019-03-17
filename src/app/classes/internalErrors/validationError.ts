import {ApiError} from "./apiError";

export class ValidationError extends ApiError {
    constructor(message: string, friendlyMessage: string, data?: any) {
        super(message, 'Validation Error', friendlyMessage,  data);
    }
}