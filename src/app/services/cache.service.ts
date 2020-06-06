import { CustomRequest } from "../classes/request/customRequest";
import { NextFunction, Response } from "express";
import emitter from "./events.service";
import { EventEmitter } from "events";
import { UsersService } from "./users.service";

const Memcached = require('memcached');
const globalAny:any = global;

export interface CustomResponse extends Response {
    sendResponse: any;
    send: any;
}

export class KeyValuePair {
    key: string;
    value: string;
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}

export class CacheKey {
    optionalArgs?: Array<KeyValuePair>;
    route: string;

    constructor(route: string, optionalArgs?: Array<KeyValuePair>) {
        if(optionalArgs) { this.optionalArgs = optionalArgs }
        this.route =  route;
    }

    toString() {
        return this.optionalArgs
            .map((arg: KeyValuePair) => (`__${arg.key}__${arg.value}`))
            .join()
            .concat(`__route__${this.route}`);
    }
}

export class CacheService {
    cache: any;
    name: string;
    emitter: EventEmitter

    constructor(name?: string) {
        this.name = name;
        this.emitter = emitter;
        this.cache = new Memcached(`${globalAny.config.memcachedAddress}:${globalAny.config.memcachedPort}`);
        this.cacheUserRoute = this.cacheUserRoute.bind(this);
        this.cacheTenantRoute = this.cacheTenantRoute.bind(this);
        this.listen();
    }

    listen() {
        if (this.name) {
            this.emitter.addListener(`${this.name}:bust-route`, this.bustRoute.bind(this));
        }
        // this.cache.on('issue', (details: any) => console.log('issue event', details));
        // this.cache.on('failure', (details: any) => console.log('failure event', details));
        // this.cache.on('reconnecting', (details: any) => console.log('reconnecting event', details));
        // this.cache.on('reconnect', (details: any) => console.log('reconnect event', details));
        // this.cache.on('remove', (details: any) => console.log('issue event', details));
    }

    cacheRoute(duration: number, optionalArgs?: Array<KeyValuePair>) {
        return (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
            if (req.method === 'GET') {
                const key = new CacheKey(req.originalUrl || req.url, optionalArgs);
                const keyString = key.toString();
                const getCachedBody = (): Promise<any> => {
                    return new Promise((resolve, reject) => {
                            this.cache.get(keyString, (err: any, value: any) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(value);
                        })
                    })
                }

                getCachedBody().then((cachedBody:any) => {
                    if (cachedBody) {
                        res.send(cachedBody);
                        console.log(`returning from cache`, keyString, cachedBody);
                        return;
                    } else {
                        console.log('not in cache', keyString);
                        res.sendResponse = res.send;
                        res.send = (body: any) => {
                            this.cache.set(keyString, body, duration * 1000, (err: any) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            res.sendResponse(body);
                        }
                        next();
                    }
                }).catch((err) => {
                    console.log(err);
                    throw err;
                });
            } else {
                 next();
            }
        }
    };

    bustRoute(route: string, optionalArgs?: Array<KeyValuePair>) {
        const key = new CacheKey(route, optionalArgs);
        const keyString = key.toString();
        this.cache.del(keyString, (err: any) => {
            if (err) throw err;
        });
    }

    private bustCache() {
        this.cache.clear();
    }

    bustRoutes(routes: Array<string>, optionalArgs?: Array<KeyValuePair>) {
        routes.forEach((route: string) => this.bustRoute(route, optionalArgs));
    };

    cacheUserRoute(req: CustomRequest, res: CustomResponse, next: NextFunction) {
        const userId = UsersService.getUserIdFromAuth(req.headers.authorization);
        const cachePrefix = new KeyValuePair('user', userId);
        return this.cacheRoute(600, [cachePrefix])(req, res, next);
    }

    cacheTenantRoute(req: CustomRequest, res: CustomResponse, next: NextFunction) {
        const cachePrefix = new KeyValuePair('tenant', req.headers["tenant-id"]);
        return this.cacheRoute(600, [cachePrefix])(req, res, next);
    }
}