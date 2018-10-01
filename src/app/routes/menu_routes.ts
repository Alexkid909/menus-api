import {Application, Request, Response} from "express";
// import { Note } from "../interfaces/note";
import {MongoError} from "mongodb";
import {ObjectID} from "bson";
import { Menu } from '../interfaces/menu'

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