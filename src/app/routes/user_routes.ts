import {Application, NextFunction, Request, Response} from "express";
import { UsersService } from "../services/users.service";
import {ApiErrorBody} from "../classes/apiErrorBody";

module.exports = (app: Application, db: any) => {
    const userService = new UsersService(db);

    app.post('/users', (req: Request, res: Response, next: NextFunction) => {
        userService.createUser(req, res, next);
    });

    app.post('/users/authenticate', (req: Request, res: Response, next: NextFunction) => {
        userService.authenticateUser(req, res, next);
    });

    app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
        res.status(501).send(new ApiErrorBody(['Route not implemented']));
        // userService.getUser(req, res, next);
    });

    app.get('/users', (req: Request, res: Response, next: NextFunction) => {
        res.status(501).send(new ApiErrorBody(['Route not implemented']));
        // userService.getUsers(req, res, next);
    });


    app.put('/users/:userId', (req: Request, res: Response, next: NextFunction) => {
        res.status(501).send(new ApiErrorBody(['Route not implemented']));
        // userService.updateUser(req, res, next);
    });

    app.delete('/users/:userId', (req: Request, res: Response, next: NextFunction) => {
        res.status(501).send(new ApiErrorBody(['Route not implemented']));
        // userService.deleteUser(req, res, next);
    });
};