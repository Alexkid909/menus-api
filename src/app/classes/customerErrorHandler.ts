import {Response} from "express";
import {ApiSuccessBody} from "./apiSuccessBody";
import {ApiErrorBody} from "./apiErrorBody";
import { ValidationError } from "./internalErrors/validationError";
import {AuthenticationError} from "./internalErrors/authError";
import {DatabaseError} from "./internalErrors/databaseError";


const mongoParse = require('mongo-error-parser');

const handleErrors = (error: any, req: Request, res: Response, next: any) => {

};

export class CustomerErrorHandler {
    handleErrors: any;
    constructor() {
        this.handleErrors = (error: any, req: Request, res: Response, next: any) => {
            switch (error.constructor) {
                case ValidationError:
                    this.handleValidationError(error, res);
                    break;
                case AuthenticationError:
                    this.handleAuthError(error, res);
                    break;
                case DatabaseError:
                    this.handleDatabaseError(error, res);
                    break;
                default:
                    this.handleOtherError(error, res);
            }
        };
    }

    private handleDatabaseError(error: DatabaseError, res: Response) {
        if (error.data.hasOwnProperty('name')) {
            if(error.data.name === 'BulkWriteError') {
                const toCapitalizedWords = (name: string) => {
                    const words = name.match(/[A-Za-z][a-z]*/g) || [];
                    return words.map((word: string, index: number ) => (index) ? word.toLowerCase() : `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(" ");
                };

                const parsedError = mongoParse(error);
                const field = toCapitalizedWords(parsedError.index);
                if(parsedError.code === 11000) {
                    const errorMessage = `${field} is already registered`;
                    console.log(errorMessage);
                    res.status(400).send(new ApiSuccessBody('fail', [errorMessage]));
                } else {
                    res.status(500).send(new ApiErrorBody());
                }
            }
        } else {
            console.log('Default Error', error);
            this.handleOtherError(error, res);
        }
    }

    private handleValidationError = (error: any, res: Response) => {
        const errorMessages = error.details.map((detail: any) => detail.message.replace(/\\|\"/g,""));
        if(error.details[0].path.includes('params')) {
            res.status(422).send(new ApiSuccessBody('fail', errorMessages));
        } else {
            res.status(400).send(new ApiSuccessBody('fail', errorMessages));
        }
    };

    private handleAuthError(error: AuthenticationError, res: Response) {
        console.log('auth error', error.message);
        const delay = 10;
        switch (error.message) {
            case 'Hash check failed':
            case 'No such user':
                setTimeout(() => {
                    res.status(404).send( new ApiSuccessBody('fail', [error.friendlyMessage]));
                }, delay);
                break;
            case 'Account locked':
                res.status(403).send( new ApiSuccessBody('fail', [error.friendlyMessage]));
                break;
            default:
                this.handleOtherError(error, res);
        }
    }

    private handleOtherError(error: any, res: Response) {
        console.log('Default Error', error);
        res.status(500).send('Internal server error');
    };
}