"use strict";

import { EntitySchema } from "typeorm";

export const CareerEntity = new EntitySchema({
    name: "Career",
    tableName: "careers",
    columns: {
        start_time: {
            type: "time",
            nullable: false,
        },
        end_time: {
            type: "time",
            nullable: false,
        },
        classroom: {
            type: String,
            nullable: false,
        }
    },
});

export default CareerEntity;