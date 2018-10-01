import { MealFood } from './mealFood';

export class Meal {
    constructor(name: string, foods?: Array<MealFood>) {
        this.name = name;
        this.foods = foods;
    }
    name: string;
    foods?: Array<MealFood>
}