import { Application } from "express";

const menuRoutes = require('./menu_routes');

module.exports = (app: Application, db: any) => {
    menuRoutes(app, db);
};