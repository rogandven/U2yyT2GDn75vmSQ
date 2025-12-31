"use strict";

import { EntitySchema, JoinColumn } from "typeorm";

export const carreraEntity= new EntitySchema({
    name:"Carrera",
    table_name:"carerras",
    columns: {
        id_carrera:{
            primary:true,
            type: int,
            generated:true
        },

        sigla:{
            primary:false,
            type: String,
            nullable:false
        },

        nombre:{
            primary:false,
            type: String,
            nullable:false
        }
    },


})