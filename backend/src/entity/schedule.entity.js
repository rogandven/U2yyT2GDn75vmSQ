"use strict";

import { EntitySchema } from "typeorm";

export const ScheduleEntity = new EntitySchema({
    name: "schedule",
    tableName: "schedule",
    columns: {
        id: {
            type: Number,
            generated: true,
            primary: true,
        },
        start_time: {
            type: "timestamp",
            nullable: false,
        },
        end_time: {
            type: "timestamp",
            nullable: false,
        },
        classroom: {
            type: String,
            nullable: false,
        },
    },
    relations: {
        subject: {
            type: 'many-to-one',
            target: 'subject',
            inverseSide: 'subject',
            joinColumn: true
        },     
    },
});

export default ScheduleEntity;