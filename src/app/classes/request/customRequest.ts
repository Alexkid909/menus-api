import { Request } from "express";
import { IncomingHttpHeaders } from "http";

interface CustomHeaders extends IncomingHttpHeaders{
    'tenant-id': string;
    'user-id': string;
}

export interface CustomRequest extends Request {
    headers: CustomHeaders;
}