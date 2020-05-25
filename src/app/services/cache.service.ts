import { CustomRequest } from "../classes/request/customRequest";
import { NextFunction, Response } from "express";
import emitter from "./events.service";
import { EventEmitter } from "events";
import { UsersService } from "./users.service";

const cache = require('memory-cache');

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
        return JSON.stringify(this);
    }
}

export class CacheService {
    cache: any;
    name: string;
    emitter: EventEmitter

    constructor(name?: string) {
        this.name = name;
        this.cache = new cache.Cache()
        this.emitter = emitter;
        this.cacheUserRoute = this.cacheUserRoute.bind(this);
        this.cacheTenantRoute = this.cacheTenantRoute.bind(this);
        this.listen();
    }

    listen() {
        if (this.name) {
            this.emitter.addListener(`${this.name}:bust-route`, this.bustRoute.bind(this));
        }
    }

    cacheRoute(duration: number, optionalArgs?: Array<KeyValuePair>) {
        return (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
            if (req.method === 'GET') {
                const key = new CacheKey(req.originalUrl || req.url, optionalArgs);
                const cachedBody = this.cache.get(key);
                if (cachedBody) {
                    res.send(cachedBody);
                    console.log(`returning from cache`, key);
                    return;
                } else {
                    console.log('not in cache', key);
                    res.sendResponse = res.send;
                    res.send = (body: any) => {
                        this.cache.put(key, body, duration * 1000);
                        res.sendResponse(body);
                    }
                }
            }
            next();
        }
    };

    bustRoute(route: string, optionalArgs?: Array<KeyValuePair>) {
        const key = new CacheKey(route, optionalArgs);
        this.cache.del(JSON.stringify(key));
        this.logCache();
    }

    private bustCache() {
        this.cache.clear();
    }

    bustRoutes(routes: Array<string>, optionalArgs?: Array<KeyValuePair>) {
        routes.forEach((route: string) => this.bustRoute(route, optionalArgs));
    };

    logCache() {
        console.log('cache data', JSON.parse(this.cache.exportJson()));
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
