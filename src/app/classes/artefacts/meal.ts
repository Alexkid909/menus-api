import {Food} from "./food";
import {Artefact} from "./artefact";

export class Meal extends Artefact {
    constructor(name: string, tenantId: string , foods?: Array<Food>) {
        super(tenantId);
        this.name = name;
        this.foods = foods || [];
    }
    name: string;
    foods?: Array<Food>
}