import {Response} from "express";
import {ApiSuccessBody} from "./apiSuccessBody";
import {ApiErrorBody} from "./apiErrorBody";


const mongoParse = require('mongo-error-parser');

const handleErrors = (error: any, req: Request, res: Response, next: any) => {

};

export class CustomerErrorHandler {
    handleErrors: any;
    constructor() {
        this.handleErrors = (error: any, req: Request, res: Response, next: any) => {
            /*if (res.headersSent) next(error);
            else */
            console.log(error);
            if (error.hasOwnProperty('isJoi') && error.isJoi) {
                this.handleJoiError(error, res);
            } else if (error.hasOwnProperty('name') && error.name === 'BulkWriteError') {
                this.handleBulkWriteError(error, res)
            } else {
                console.log('Default Error');
                res.status(500).send(new ApiErrorBody());
            }
        };
    }

    private handleBulkWriteError = (error: any, res: Response) => {
        const toCapitalizedWords = (name: string) => {
            const words = name.match(/[A-Za-z][a-z]*/g) || [];
            return words.map((word: string, index: number ) => (index) ? word.toLowerCase() : `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(" ");
        };

        const parsedError = mongoParse(error);
        console.log('error', error);
        console.log('parsedError', parsedError);
        const field = toCapitalizedWords(parsedError.index);
        if(parsedError.code === 11000) {
            const errorMessage = `${field} is already registered`;
            console.log(errorMessage);
            res.status(400).send(new ApiSuccessBody('fail', [errorMessage]));
        } else {
            res.status(500).send(new ApiErrorBody());
        }
    };

    private handleJoiError = (error: any, res: Response) => {
        const errorMessages = error.details.map((detail: any) => detail.message.replace(/\\|\"/g,""));
        if(error.details[0].path.includes('params')) {
            res.status(422).send(new ApiSuccessBody('fail', errorMessages));
        } else {
            res.status(400).send(new ApiSuccessBody('fail', errorMessages));
        }
    };
}