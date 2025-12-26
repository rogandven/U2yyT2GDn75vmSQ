"use strict";

import { EntitySchema } from "typeorm";
import { USER_ID_TYPE } from "../constants/entity.constants.js";

export const UserEntity = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            type: USER_ID_TYPE,
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
            nullable: false,
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
        carrera: {
            type: String,
            nullable: true,
        },
        creditos: {
            type: Number,
            default: 0
        }
    },
});

export default UserEntity;