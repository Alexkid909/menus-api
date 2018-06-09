import { Meal } from './meal'
import { MenuDay } from './menuDay';

export interface Menu {
    id: string;
    startDate: Date;
    days: {
      0: Meal;
      1: Meal;
      2: Meal;
      3: Meal;
      4: Meal;
      5: Meal;
      6: Meal;
    };
}