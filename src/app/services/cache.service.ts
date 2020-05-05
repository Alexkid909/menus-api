import {CustomRequest} from "../classes/request/customRequest";
import {NextFunction, Response} from "express";
const cache = require('memory-cache');


export interface CustomResponse extends Response {
    sendResponse: any;
    send: any;
}

export class CacheService {
    cache: any;

    constructor() {
        this.cache = new cache.Cache()
    }

    cacheRoute(duration: number, keyPrefix = '') {
        return (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
            this.logCache();
            if (req.method === 'GET') {
                const key = `__express__${keyPrefix}__route__${req.originalUrl || req.url}__tenant__${req.headers["tenant-id"]}`;
                const cachedBody = this.cache.get(key);
                if (cachedBody) {
                    res.send(cachedBody);
                    return;
                } else {
                    res.sendResponse = res.send;
                    res.send = (body: any) => {
                        this.cache.put(key, body, duration * 1000);
                        res.sendResponse(body);
                    }
                }
            }
            this.logCache();
            next();
        }
    };

    bustRoutes(routes: Array<string>, tenantId: string = null) {
        routes.forEach((route: string) => this.bustRoute(route, tenantId));
    };

    bustRoute(route: string, tenantId: string = null) {
        const key = `__express__${route}${tenantId ? `__tenant__${tenantId}` : ``}`;
        this.cache.del(key);
    };

    logCache() {
        console.log('cache data', JSON.parse(this.cache.exportJson()));
    };
}
