"use strict";

import { EntitySchema } from "typeorm";

export const InscriptionEntity = new EntitySchema({
    name: "inscription",
    tableName: "inscriptions",
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

export default InscriptionEntity;