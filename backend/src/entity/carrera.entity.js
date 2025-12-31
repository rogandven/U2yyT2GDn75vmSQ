"use strict";

import { EntitySchema, JoinColumn } from "typeorm";

export const carreraEntity= new EntitySchema({
    name:"Carrera",
    table_name:"carerras",
    columns: {
        id:{
            primary:true,
            type: "integer",
            generated:true
        },
        sigla:{
            primary:false,
            type: String,
            nullable:false,
            unique: true,
        },
        nombre:{
            primary:false,
            type: String,
            nullable:false
        }
    },
});

export default carreraEntity;