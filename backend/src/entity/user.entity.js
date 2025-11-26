"use strict";

import { EntitySchema } from "typeorm";

export const UserEntity = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        fullname: {
            type: String,
            nullable: false,
        },
        username: {
            type: String,
            unique: true,
            nullable: false,
        },
        rut: {
            type: String,
            unique: true,
            nullable: false,
        },
        email: {
            type: String,
            unique: true,
            nullable: false,
        },
        password: {
            type: String,
            nullable: false,
        },
        role: {
            type: String,
            nullable: false,
        },
        generation: {
            type: String,
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: () => "CURRENT_TIMESTAMP",
        },
        id_carrera: {
            type: Number,
            nullable: true
        }
    },
});

export default UserEntity;