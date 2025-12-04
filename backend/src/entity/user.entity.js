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
            nullable: true,
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
            nullable: true
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
        },
        creditos: {
            type: Number,
            default: 0
        }
    },
});

export default UserEntity;