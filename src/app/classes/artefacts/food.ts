import {ObjectID} from "bson";
import {Artefact} from "./artefact";

export class Food extends Artefact {
    name: string;
    measurement: string;

    constructor(name: string, measurement: string, tenantId?: string) {
        super(tenantId);
        this.name = name;
        this.measurement = measurement;
    }
}
