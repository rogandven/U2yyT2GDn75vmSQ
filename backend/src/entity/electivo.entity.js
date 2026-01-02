"use strict";

import { EntitySchema } from "typeorm";

export const ElectivoEntity = new EntitySchema({
    name: "Electivo",
    tableName: "electivos",
    columns: {
        id_electivo: {
            type: Number,
            primary: true,
            generated: true,
        },
        nombre_electivo: {
            type: String,
        },
        descripcion: {
            type: "text",
        },
        cupos: {
            type: Number,
        },
        prerequisitos_asignaturas: {
            type: "text",
            nullable: true,
        },
        fecha_inicio: {
            type: "date",
        },
        fecha_fin: {
            type: "date",
        },
        area_electivo: {
            type: String,
        },
        creditos_minimos_aprobados: {
            type: Number,
        },
        link_programa: {
            type: String,
            nullable: true,
        },
        estado: {
            type: String,
            default: "PENDIENTE", 
        },
        motivo_rechazo: {
            type: "text",
            nullable: true, 
        },
    },
    relations: {
        profesor: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: { name: "id_profesor" },
            onDelete: "CASCADE",
        },
        carreras: {
            type: "one-to-many",
            target: "ElectivoCarrera",
            inverseSide: "electivo",
        },
        preinscripciones: {
            type: "one-to-many",
            target: "Preinscripcion",
            inverseSide: "electivo",
        },
        horarios: {
            type: "one-to-many",
            target: "Horario",
            inverseSide: "electivo",
        },
    },
});

export default ElectivoEntity;