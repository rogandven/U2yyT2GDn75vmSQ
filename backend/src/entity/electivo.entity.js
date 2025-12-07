"use strict";

import { EntitySchema } from "typeorm";

/* export enum EstadoElectivo{
    PENDIENTE = 'pendiente'
}*/ 

export const ESTADOS_VALIDOS = {
    PENDIENTE: 'pendiente',
    APROBADO: 'aprobado',
    RECHAZADO: 'rechazado',
    ACTIVO: 'activo',
    INACTIVO: 'inactivo'
};

export const obtenerEstadosValidosComoArray = () => {
    const array = [];
    for (const key in ESTADOS_VALIDOS) {
        if (ESTADOS_VALIDOS.hasOwnProperty(key)) {
            array.push(String(ESTADOS_VALIDOS[key]));
        }
    }
    return array;
}

export const ARRAY_ESTADOS_VALIDOS = obtenerEstadosValidosComoArray();

export const arrayDeStringAArrayDeSQL = (array) => {
    let resultado = "('";
    if (!array || !Array.isArray(array)) {
        throw Error("No se pasó ningún array");
    }
    resultado += array.join("','");
    resultado += "')";
    // console.log(resultado);
    return resultado;
}

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