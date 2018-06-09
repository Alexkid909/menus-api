import { Food } from './food';

export interface Meal {
    name: string;
    id: string;
    foods: Array<Food>
}