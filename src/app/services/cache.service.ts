const mcache = require('memory-cache');

import {CustomRequest} from "../classes/request/customRequest";
import {NextFunction, Response} from "express";

interface CustomResponse extends Response {
    sendResponse: any;
    send: any;
}

const cache = (duration: number) => {
    return  (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
        if (req.method === 'GET') {
            const key = `__express__${req.originalUrl || req.url}___tenant__${req.headers["tenant-id"]}`;
            const cachedBody = mcache.get(key);
            if (cachedBody) {
                res.send(cachedBody);
                logCache();
                return;
            } else {
                res.sendResponse = res.send;
                res.send = (body: any) => {
                    mcache.put(key, body, duration * 1000);
                    logCache();
                    res.sendResponse(body);
                }
            }
        }
        next();
    };
};

const bustCache = (routes: Array<string>, tenantId: string = null) => {
    routes.forEach((route: string) => {
        const key = `__express__${route}${tenantId ? `__tenant__${tenantId}` : ``}`;
        mcache.del(key);
    });
};

const logCache = () => {
    console.log('cache data', JSON.parse(mcache.exportJson()));
};

export {cache, bustCache};