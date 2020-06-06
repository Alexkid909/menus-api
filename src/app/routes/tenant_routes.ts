import { Application, NextFunction, Response } from "express";
import { CustomRequest } from "../classes/request/customRequest";
import { TenantsHandlers } from "./handlers/tenant_handlers";

module.exports = (app: Application, db: any) => {
    const tenantHandlers = new TenantsHandlers(db);

    app.post('/tenants', (req: CustomRequest, res: Response, next: NextFunction) => {
        tenantHandlers.createTenantHandler(req, res, next);
    });

    app.get('/tenants/:tenantId', (req: CustomRequest, res: Response, next: NextFunction) => {
        tenantHandlers.getTenantHandler(req, res, next);
    });

    app.get('/tenants', (req: CustomRequest, res: Response, next: NextFunction) => {
        tenantHandlers.getTenantsHandler(req, res, next);
    });

    app.put('/tenants/:tenantId', (req: CustomRequest, res: Response, next: NextFunction) => {
        tenantHandlers.updateTenantHandler(req, res, next);
    });

    app.delete('/tenants/:tenantId', (req: CustomRequest, res: Response, next: NextFunction) => {
        tenantHandlers.deleteTenantHandler(req, res, next);
    });
};
