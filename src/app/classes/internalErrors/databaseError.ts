import {ApiError} from "./apiError";

export class DatabaseError extends ApiError {
    constructor(message: string, friendlyMessage: string, data?: any) {
        super(message, 'Database Error', friendlyMessage, data);
    }
}