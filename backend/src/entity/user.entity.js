"use strict";

import { EntitySchema,JoinColumn } from "typeorm";
import { USER_ID_TYPE } from "../constants/entity.constants.js";
import {carrera, carreraEntity} from "./carrera.entity.js"

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
        creditos: {
            type: Number,
            default: 0
        },       
        id_carrera: {
            primary:false,
            type: "integer",
            nullable: true,
        },
    },
    relations:{
        carrera:{
            type:"many-to-one",
            target: carreraEntity,
            JoinColumn:{name:"id_carrera"}
        }
    }
});

export default UserEntity;