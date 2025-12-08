"use strict";

import { EntitySchema } from "typeorm";
import { obtenerEstadosValidosComoArray } from "../helpers/electivo.helper.js";
import { arrayDeStringAArrayDeSQL } from "../helpers/sql.helpers.js";
/* export enum EstadoElectivo{
    PENDIENTE = 'pendiente'
}*/ 


export const ARRAY_ESTADOS_VALIDOS = obtenerEstadosValidosComoArray();


export const ElectivoEntity = new EntitySchema({
    name: "Electivo",
    tableName: "Electivo",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        nombre: {
            type: String,
            unique: false,
            nullable: false,
        },
        profesor: {
            type: String,
            unique: false,
            nullable: false,
        },
        cupos: {
            type: Number,
            unique: false,
            nullable: false,
        },
        creditos: {
            type: Number,
            unique: false,
            nullable: false
        },
        descripcion: {
            type: String,
            nullable: false,
        },
        estado: {
            type: String,
            unique: false,
            nullable: false,
        },
    },
    checks: [
        { expression: `"estado" IN ${arrayDeStringAArrayDeSQL(ARRAY_ESTADOS_VALIDOS)}` },
    ],
});

export default ElectivoEntity;