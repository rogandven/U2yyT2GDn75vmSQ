"use strict";

import { EntitySchema } from "typeorm";

export const ElectivoCarreraEntity = new EntitySchema({
    name: "ElectivoCarrera",
    tableName: "electivo_carrera",
    columns: {
        id_relacion: {
            type: Number,
            primary: true,
            generated: true,
        },
        cupos: {
            type: Number,
        },
    },
    relations: {
        electivo: {
            type: "many-to-one",
            target: "Electivo",
            joinColumn: { name: "id_electivo" },
            onDelete: "CASCADE",
        },
        carrera: {
            type: "many-to-one",
            target: "Carrera",
            joinColumn: { name: "id_carrera" },
            onDelete: "CASCADE",
        },
    },
});

export default ElectivoCarreraEntity;