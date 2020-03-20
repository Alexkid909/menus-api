import {Artefact} from "./artefact";

export class Food extends Artefact {
    name: string;
    measurement: string;

    constructor(
        name: string, measurement: string, tenantId?: string, creatorId?: string, updatorId?: string, imgSrc?: string) {
        super(tenantId, creatorId, updatorId, imgSrc);
        this.name = name;
        this.measurement = measurement;
    }
}
