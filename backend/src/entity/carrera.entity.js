"use strict";

import { EntitySchema } from "typeorm";

export const CarreraEntity = new EntitySchema({
    name: "Carrera",
    tableName: "carreras",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        sigla: {
            type: String,
            nullable: false, 
        },
        nombre: {
            type: String,
            nullable: false, 
        },
    },
    relations: {
        usuarios: {
            type: "one-to-many",
            target: "Usuario",
            inverseSide: "carrera",
        },
        electivosCarrera: {
            type: "one-to-many",
            target: "ElectivoCarrera",
            inverseSide: "carrera",
        },
    },
});

export default CarreraEntity;