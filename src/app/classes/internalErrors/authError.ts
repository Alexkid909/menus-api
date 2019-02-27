import {ApiError} from "./apiError";

export class AuthenticationError extends ApiError {
    constructor(message: string, friendlyMessage: string,  data?: any) {
        super(message, 'Authentication Error', friendlyMessage, data);
    }
}