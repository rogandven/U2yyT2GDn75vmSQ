"use strict";

import { EntitySchema } from "typeorm";

export const CareerEntity = new EntitySchema({
    name: "Career",
    tableName: "careers",
    columns: {
        acronym: {
            type: String,
            unique: true,
            nullable: false,
        },
        name: {
            type: String,
            unique: true,
            nullable: false,
        },
    },
});

export default CareerEntity;