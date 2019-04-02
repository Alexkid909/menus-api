import { Request } from "express";
import { IncomingHttpHeaders } from "http";

interface CustomHeaders extends IncomingHttpHeaders{
    'tenant-id': string;
}

export interface CustomRequest extends Request {
    headers: CustomHeaders;
}