"use strict";

import { EntitySchema } from "typeorm";

export const PreinscriptionEntity = new EntitySchema({
    name: "preinscription",
    tableName: "preinscriptions",
    columns: {
        id: {
            type: Number,
            primary: true,
            nullable: false,
            generated: true,
        },
        date: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        status: {
            type: String,
            nullable: false,
        }
    },
});

export default PreinscriptionEntity;