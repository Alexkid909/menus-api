import { Collection } from "mongodb";
import { NextFunction, Response } from "express";
import { ApiSuccessBody } from "../classes/response/apiSuccessBody";
import { JwtService } from "./jwt.service";
const moment = require('moment');

export class AuthService {
    usersCollection: Collection;
    loginsCollection: Collection;

    constructor(db: any) {
        this.usersCollection = db.collection('users');
        this.usersCollection.createIndex({ 'email': 1, 'username': 1 },{ unique: true, sparse: true });
        this.loginsCollection = db.collection('logins');
        this.loginsCollection.createIndex({ 'identityKey': 1},{ unique: true, sparse: true });
    }

    canAuthenticate(key: string) {
        return this.loginsCollection.findOne({identityKey: key}).then((login: any) => {
            if(login) {

                let underTimeout = false;
                if (login.hasOwnProperty('timeoutExpiry')) {
                    const timeoutExpiry = moment(login.timeoutExpiry).add(5, 'minutes').toDate();
                    console.log('timeoutExpiry', timeoutExpiry);
                    console.log('time to expiry', moment(new Date()).toDate() - timeoutExpiry);
                    underTimeout = (moment(new Date()).toDate() - timeoutExpiry) < 0;
                }

                console.log('underTimeout', underTimeout);

                if(login.failedAttempts < 5 && !underTimeout) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        });
    };

    private loginInProgress() {
        //@TODO implement setting login in progress and handling where there is a login in progress.
    }

    failedLoginAttempt(key: string, next: NextFunction) {

        const query = {identityKey: key};
        const update = {$inc: {failedAttempts: 1}};
        const options = {setDefaultsOnInsert: true, upsert: true, returnOriginal: false};
        this.loginsCollection.findOneAndUpdate(query, update, options).then((success: any) => {
            if(success.value.failedAttempts > 4) {
                console.log();
                const update = {
                    $set: {
                        failedAttempts: 0,
                        timeoutExpiry: new Date()
                    },
                };
                this.loginsCollection.findOneAndUpdate(query, update, options)
            }
        }, (error: any) => {
            console.log('error', error);
        }).catch(next)
    }

    successfulLoginAttempt(key: string, next: NextFunction) {

        const query = {identityKey: key};
        const update = {$inc: {failedAttempts: 1}, $currentDate: {timeout: true}};

        this.loginsCollection.deleteOne(query).then((success: any) => {
        });
    }

    static verifyAuthentication(req: any, res: Response, next: NextFunction) {

        const jwtService = new JwtService();

        const checkForExpiredToken = (exp: string) => {
            const expiryDate: any = new Date(exp);
            const now: any = new Date();
            return !(expiryDate - now);
        };

        if(req.path == '/users/authenticate' || req.path == '/users/register') {
            next()
        } else {
            let token, payload;
            if(!req.headers.hasOwnProperty('authorization') || !req.headers.authorization) {
                res.status(401).send(new ApiSuccessBody('failure', ['User not authorized']))
            } else if (!req.headers.authorization.includes('Bearer ')) {
                res.status(401).send(new ApiSuccessBody('failure', ['Invalid auth type']))
            } else {
                token = req.headers.authorization.split(' ')[1];
                payload = jwtService.decode(token, 'quiet');
                if(!payload.sub || !payload.iss || req.clientIp !== payload.iss || !payload.exp) {
                    console.log(payload, req.clientIp);
                    res.status(401).send(new ApiSuccessBody('failure', ['Authentication failure']))
                } else if (checkForExpiredToken(payload.exp)) {
                    res.status(401).send(new ApiSuccessBody('failure', ['Token expired']))
                } else {
                    next();
                }
            }

        }
    }

    generateToken(clientIp: string, username: string) {
        const jwtService = new JwtService();

        const payload = {
            iss: clientIp,
            sub: username,
            exp: moment(new Date()).add(1, 'days').toString()
        };

        return jwtService.encode(payload, 'quiet');
    }
}