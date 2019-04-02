import { Application, NextFunction, Response } from "express";
import { TenantsService } from "../services/tenants.service";
import { CustomRequest } from "../classes/request/customRequest";

module.exports = (app: Application, db: any) => {
    const tenantService = new TenantsService(db);

    app.post('/tenants', (req: CustomRequest, res: Response, next: NextFunction) => {
        tenantService.createTenant(req, res, next);
    });

    app.get('/tenants/:tenantId', (req: CustomRequest, res: Response, next: NextFunction) => {
        tenantService.getTenant(req, res, next);
    });

    app.get('/tenants', (req: CustomRequest, res: Response, next: NextFunction) => {
        tenantService.getTenants(req, res, next);
    });


    app.put('/tenants/:tenantId', (req: CustomRequest, res: Response, next: NextFunction) => {
        tenantService.updateTenant(req, res, next);
    });

    app.delete('/tenants/:tenantId', (req: CustomRequest, res: Response, next: NextFunction) => {
        tenantService.deleteTenant(req, res, next);
    });
};