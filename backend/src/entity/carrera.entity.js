"use strict";

import { EntitySchema} from "typeorm";

export const carreraEntity= new EntitySchema({
    name:"Carrera",
    tableName:"carreras",
    columns: {
        id_carrera:{
            primary:true,
            type: Number,
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
        },
    },
    relations:{
        usuarios:{
            type: "one-to-many",
            target: "User",
            inverseSide: "carreras"
        }
    }

})
export default carreraEntity;