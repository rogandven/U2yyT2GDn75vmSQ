"use strict";

import { EntitySchema } from "typeorm";

export const ElectivoEntity = new EntitySchema({
    name: "Electivo",
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
});

export default ElectivoEntity;