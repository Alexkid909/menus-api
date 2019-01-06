import { Application } from "express";

const menuRoutes = require('./menu_routes');
const foodRoutes = require('./food_routes');
const mealRoutes = require('./meal_routes');
const mealFoodRoutes = require('./meal-food_routes');

module.exports = (app: Application, db: any) => {
    menuRoutes(app, db);
    foodRoutes(app, db);
    mealRoutes(app, db);
    mealFoodRoutes(app, db);
};