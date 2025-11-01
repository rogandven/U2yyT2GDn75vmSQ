"use strict";

import { EntitySchema, JoinColumn } from "typeorm";

export const InscriptionEntity = new EntitySchema({
    name: "inscription",
    tableName: "inscription",
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
    relations: {
        user: {
            type: 'many-to-one',
            target: 'user',
            inverseSide: 'user',
            joinTable: true,
        },
        subject: {
            type: 'many-to-one',
            target: 'subject',
            inverseSide: 'subject',
            joinTable: true,
        },
    },
});

export default InscriptionEntity;