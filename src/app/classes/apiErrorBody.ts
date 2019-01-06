import {ApiResponseBody} from "./apiResponseBody";

export class ApiErrorBody extends ApiResponseBody {
    constructor(messages?: Array<string>) {
        super('error', messages || ['Internal Server Error']);
    }
}