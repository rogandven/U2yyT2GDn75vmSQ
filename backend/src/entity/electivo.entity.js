"use strict";

import { EntitySchema } from "typeorm";

export const ElectivoEntity = new EntitySchema({
    name: "electivo",
    tableName: "electivos",
    columns: {
        id: {
            type: Number,
            primary: true,
        },
        nombre: {
            type: String,
            nullable: false,
        }
    },
    relations: {
        preinscripcion: {
            type: 'one-to-many',
            target: 'preinscripcion',
            inverseSide: 'preinscripcion',
            joinColumn: true
        },
    },
});

export default ElectivoEntity;