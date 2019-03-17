import { Application, NextFunction, Request, Response } from "express";
import {AuthService} from "../services/auth.service";

module.exports = (app: Application, db: any) => {
    const authService = new AuthService(db);

    app.post('/authenticate', (req: Request, res: Response, next: NextFunction) => {
        authService.authenticateUser(req, res, next);
    });
};