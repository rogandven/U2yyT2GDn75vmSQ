"use strict";

import { EntitySchema } from "typeorm";

export const PreinscripcionEntity = new EntitySchema({
    name: "Preinscripcion",
    tableName: "preinscripciones",
    columns: {
        userId: {
            type: Number,
            primary: true,
        },
        electivoId: {
            type: Number,
            primary: true,
        },
        preinscriptionDate: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        semestreId: {
            type: String,
            primary: true,
        },
    },
});

export default PreinscripcionEntity;