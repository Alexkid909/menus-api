import {NextFunction, Response} from "express";
import { ApiSuccessBody } from "./response/apiSuccessBody";
import { ValidationError } from "./internalErrors/validationError";
import { AuthenticationError } from "./internalErrors/authError";
import { DatabaseError } from "./internalErrors/databaseError";
import { CustomRequest } from "./request/customRequest";

class BulkWriteError {

}


const mongoParse = require('mongo-error-parser');


export class CustomErrorHandler {
    handleErrors: any;
    constructor() {
        this.handleErrors = (error: any, req: CustomRequest, res: Response, next: any) => {
            console.log('error handler caught error', error);
            if (error.name === 'BulkWriteError') {
                this.handleBulkWriteError(error, res);
            } else {
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
            }
        };
    }

    private handleDatabaseError(error: DatabaseError, res: Response) {
        res.status(422).send(new ApiSuccessBody('fail', error.friendlyMessages, error.data));
    }
    private handleBulkWriteError(error: DatabaseError, res: Response) {
        const toCapitalizedWords = (name: string) => {
            const words = name.match(/[A-Za-z][a-z]*/g) || [];
            return words.map((word: string, index: number ) => (index) ? word.toLowerCase() : `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(" ");
        };
        const parsedError = mongoParse(error);
        const errorMessages = parsedError.index.replace(/_1/g,'').split('_').map((field: string) => {
            const fieldName = toCapitalizedWords(field);
            return `${fieldName} is already registered`;
        });
        if(parsedError.code === 11000) {
            res.status(400).send(new ApiSuccessBody('fail', errorMessages));
        } else {
            this.handleOtherError(error, res);
        }
    }

    private handleValidationError = (error: ValidationError, res: Response) => {
        if(error.data.details.some((data: any) => data.path.includes('params'))) {
            res.status(422).send(new ApiSuccessBody('fail', error.friendlyMessages));
        } else {
            res.status(400).send(new ApiSuccessBody('fail', error.friendlyMessages));
        }
    };

    private handleAuthError(error: AuthenticationError, res: Response) {
        const delay = 10;
        switch (error.message) {
            case 'Hash check failed':
            case 'No such user':
                setTimeout(() => {
                    res.status(404).send( new ApiSuccessBody('fail', error.friendlyMessages));
                }, delay);
                break;
            case 'Account locked':
                res.status(403).send( new ApiSuccessBody('fail', error.friendlyMessages));
                break;
            default:
                this.handleOtherError(error, res);
        }
    }

    private handleOtherError(error: any, res: Response) {
        res.status(500).send('Internal server error');
    };
}
