"use strict";

import { EntitySchema } from "typeorm";

export const PreinscripcionEntity = new EntitySchema({
    name: "preinscripcion",
    tableName: "preinscripciones",
    columns: {
        user: {
            type: Number,
            primary: true,
        },
        electivo: {
            type: Number,
            primary: true,
        },
        preinscriptionDate: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        semestre: {
            type: String,
            primary: true,
        },
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'user',
            inverseSide: 'user',
            joinColumn: true
        },
        electivo: {
            type: 'many-to-one',
            target: 'electivo',
            inverseSide: 'electivo',
            joinColumn: true
        },     
    },
});

export default PreinscripcionEntity;