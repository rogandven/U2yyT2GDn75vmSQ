"use strict";

import { EntitySchema } from "typeorm";

export const PreinscripcionEntity = new EntitySchema({
    name: "Preinscripcion",
    tableName: "preinscripciones",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        estado: {
            type: String,
            default: "PENDIENTE",
        },
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: { name: "id_usuario" },
            onDelete: "CASCADE",
        },
        electivo: {
            type: "many-to-one",
            target: "Electivo",
            joinColumn: { name: "id_electivo" },
            onDelete: "CASCADE",
        },
    },
});

export default PreinscripcionEntity;

