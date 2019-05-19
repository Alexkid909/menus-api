import {Application, NextFunction, Response} from "express";
import { ApiErrorBody } from "../classes/response/apiErrorBody";
import { CustomRequest } from "../classes/request/customRequest";
import { UsersHandlers } from "./handlers/users";

module.exports = (app: Application, db: any) => {
    const usersHandlers = new UsersHandlers(db);

    app.post('/users/register', (req: CustomRequest, res: Response, next: NextFunction) => {
        usersHandlers.createUserHandler(req, res, next);
    });

    app.get('/users/:id', (req: CustomRequest, res: Response, next: NextFunction) => {
        res.status(501).send(new ApiErrorBody(['Route not implemented']));
        // userService.getUser(req, res, next);
    });

    app.get('/users', (req: CustomRequest, res: Response, next: NextFunction) => {
        res.status(501).send(new ApiErrorBody(['Route not implemented']));
        // userService.getUsers(req, res, next);
    });


    app.put('/users/:userId', (req: CustomRequest, res: Response, next: NextFunction) => {
        res.status(501).send(new ApiErrorBody(['Route not implemented']));
        // userService.updateUser(req, res, next);
    });

    app.delete('/users/:userId', (req: CustomRequest, res: Response, next: NextFunction) => {
        res.status(501).send(new ApiErrorBody(['Route not implemented']));
        // userService.deleteUser(req, res, next);
    });

    app.post('/users/authenticate', (req: CustomRequest, res: Response, next: NextFunction) => {
        usersHandlers.authenticateUserHandler(req, res, next);
    });

    app.get('/users/:userId/tenants', (req: CustomRequest, res: Response, next: NextFunction) => {
        // res.status(501).send(new ApiErrorBody(['Route not implemented']));
        usersHandlers.getUserTenantsHandler(req, res, next);
    });

};