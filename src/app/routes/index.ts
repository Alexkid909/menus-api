import { Application } from "express";

const menuRoutes = require('./menu_routes');
const foodRoutes = require('./food_routes');

module.exports = (app: Application, db: any) => {
    menuRoutes(app, db);
    foodRoutes(app, db);
};