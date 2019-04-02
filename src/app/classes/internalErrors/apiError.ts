export class ApiError extends Error {
    type:string;
    data?: any;
    friendlyMessages: Array<string> ;
    constructor(message: string, type: string, friendlyMessages: Array<string>, data?: any,) {
        super(message);
        this.type = type;
        this.data = data;
        this.friendlyMessages = friendlyMessages;
    }
}