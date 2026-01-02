"use strict";

import { EntitySchema } from "typeorm";

export const UsuarioEntity = new EntitySchema({
    name: "Usuario",
    tableName: "usuarios",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        rut: {
            type: String,
        },
        nombre: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        clave: {
            type: String,
        },
        creditos: {
            type: Number,
            default: 0,
        },
        rol: {
            type: String, 
        },
        generacion: {
            type: String,
        },
        fechaCreacion: {
            type: "timestamp",
            createDate: true,
        },
        fechaActualizacion: {
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        carrera: {
            type: "many-to-one",
            target: "Carrera",
            joinColumn: { name: "id_carrera" },
            onDelete: "SET NULL",
        },
        electivosCreados: {
            type: "one-to-many",
            target: "Electivo",
            inverseSide: "profesor",
        },
        preinscripciones: {
            type: "one-to-many",
            target: "Preinscripcion",
            inverseSide: "usuario",
        },
    },
});

export default UsuarioEntity;