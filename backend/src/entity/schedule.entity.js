"use strict";

import { EntitySchema } from "typeorm";

export const ScheduleEntity = new EntitySchema({
    name: "Schedule",
    tableName: "schedules",
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

export default ScheduleEntity;