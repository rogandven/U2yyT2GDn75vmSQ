"use strict";

import { EntitySchema } from "typeorm";

export const SubjectEntity = new EntitySchema({
    name: "subject",
    tableName: "subjects",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            type: String,
            unique: true,
            nullable: false,
        },
        description: {
            type: String,
            unique: true,
            nullable: false,
        },        
        spots_per_career: {
            type: Number,
            nullable: false,
        },
        required_credits: {
            type: Number,
            nullable: true,
        },        
        minimum_semester: {
            type: "timestamp",
            nullable: true,
        },
    },
    relations: {
        career: {
            type: 'many-to-many',
            target: 'career',
            inverseSide: 'career',
            joinColumn: {
                name: 'career-subject',
            }
        },    
        schedule: {
            type: 'one-to-many',
            target: 'schedules',
            inverseSide: 'schedules',
            joinColumn: true
        },     
    },
});

export default SubjectEntity;