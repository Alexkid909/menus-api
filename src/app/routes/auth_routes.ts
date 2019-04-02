import { Application, NextFunction, Response } from "express";
import {AuthService} from "../services/auth.service";
import { CustomRequest } from "../classes/request/customRequest";

module.exports = (app: Application, db: any) => {
    const authService = new AuthService(db);

    app.post('/authenticate', (req: CustomRequest, res: Response, next: NextFunction) => {
        authService.authenticateUser(req, res, next);
    });
};