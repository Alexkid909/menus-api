export class ApiResponseBody {
    status: string;
    messages: Array<string>;
    constructor(status: string, messages: Array<string>) {
        this.status = status;
        this.messages = messages;
    }
    newMessage(message: string) {
        this.messages.push(message);
    }
}