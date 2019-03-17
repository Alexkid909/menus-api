export class ApiError extends Error {
    type:string;
    data?: any;
    friendlyMessage: string;
    constructor(message: string, type: string, friendlyMessage: string, data?: any,) {
        super(message);
        this.type = type;
        this.data = data;
        this.friendlyMessage = friendlyMessage;
    }
}