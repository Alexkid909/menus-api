import {ApiError} from "./apiError";

export class ValidationError extends ApiError {
    constructor(message: string, friendlyMessages: Array<string>, data?: any) {
        super(message, 'Validation Error', friendlyMessages,  data);
    }
}