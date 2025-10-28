"use strict";

import { EntitySchema } from "typeorm";

export const ClaseEntity = new EntitySchema({
    name: "Clase",
    tableName: "clases",
    columns: {
        id_electivo: {
            type: Number,
            primary: true,
            generated: true,
        },

        
        profesor: {
            type: String,
            unique: true,
            nullable: false,
        },
        nombreEl: {
            type: String,
            unique: true,
            nullable: false,
        },
        sala: {
            type: String,
            unique: true,
            nullable: false,
        },
        horario: {
            type: String,
            nullable: false,
        },
        fecha_inicio_clases: {
            type: String,
            nullable:false
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: () => "CURRENT_TIMESTAMP",
        },
    },
});

export default ClaseEntity;