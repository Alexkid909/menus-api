import {ApiError} from "./apiError";

export class AuthenticationError extends ApiError {
    constructor(message: string, friendlyMessages: Array<string>,  data?: any) {
        super(message, 'Authentication Error', friendlyMessages, data);
    }
}