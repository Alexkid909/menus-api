import {Food} from "./food";
import {Artefact} from "./artefact";

export class Meal extends Artefact {
    name: string;
    foods?: Array<Food>;

    constructor(name: string, tenantId: string, creatorId?: string, updatorId?: string, imgSrc?: string, foods?: Array<Food>) {
        super(tenantId, creatorId, updatorId, imgSrc);
        this.name = name;
        this.foods = foods || [];
    }
}