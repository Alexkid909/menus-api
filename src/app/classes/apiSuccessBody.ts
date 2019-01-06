import {ApiResponseBody} from "./apiResponseBody";

export class ApiSuccessBody extends ApiResponseBody {
    private data?: any;
    constructor(status: string, messages: Array<string>,  data?: any) {
        super(status, messages);
        this.data = data;
    }
}