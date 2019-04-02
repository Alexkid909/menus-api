import {Application, Response} from "express";
import {MongoError} from "mongodb";
import {ObjectID} from "bson";
import { Menu } from '../interfaces/menu'
import { CustomRequest } from "../classes/request/customRequest";


module.exports = (app: Application, db: any) => {
    const menuCollection = db.collection('menus');
    const standardErrorMessage = () => {
        return {error: 'An error has occured'}
    };

    app.post('/menus', () => {
       // const menu: Menu = {
       //
       // }
    });

};