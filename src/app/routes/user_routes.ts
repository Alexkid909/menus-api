import {Application, NextFunction, Request, Response} from "express";
import { UsersService } from "../services/users.service";
import {ApiErrorBody} from "../classes/response/apiErrorBody";
import { CustomRequest } from "../classes/request/customRequest";

module.exports = (app: Application, db: any) => {
    const userService = new UsersService(db);

    app.post('/users', (req: CustomRequest, res: Response, next: NextFunction) => {
        userService.createUser(req, res, next);
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
};