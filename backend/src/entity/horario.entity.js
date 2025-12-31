"use strict";

import { EntitySchema, JoinColumn } from "typeorm";

export const HorarioEntity = new EntitySchema({
    name: "HorarioEntity",
    tableName: "horarios",
    columns: {
        id_horario: {
            type: Number,
            generated: true,
            primary: true,
        },
        id_electivo: {
            type: Number,
            primary: false,
            generated: false,
        },
        hora_inicio: {
            type: String,
            nullable: false,
        },
        hora_termino: {
            type: String,
            nullable: false,
        },
        sala: {
            type: String,
            nullable:false
        },
        dia: {
            type: String,
            nullable:false
        },

        status: {
            type: "varchar",
            default: "scheduled",
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
    relations:{
        electivo:{
            type: "many-to-one",
            target:"electivos",
            JoinColumn:{name:"id_electivo"},
            onDelete:"CASCADE",
        },
    },    
});

export default HorarioEntity;