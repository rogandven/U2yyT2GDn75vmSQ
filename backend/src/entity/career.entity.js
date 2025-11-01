"use strict";

import { EntitySchema } from "typeorm";

export const CareerEntity = new EntitySchema({
    name: "career",
    tableName: "careers",
    columns: {
        acronym: {
            type: String,
            primary: true,
            nullable: false,
        },
        name: {
            type: String,
            nullable: false,
        },
    },
    relations: {
        subject: {
            type: 'many-to-many',
            target: 'subject',
            inverseSide: 'career-subject',
            joinTable: {
                name: 'career-subject',
            }
        },     
    },
});

export default CareerEntity;