"use strict";

import { EntitySchema} from "typeorm";
import ElectivoEntity from "./electivo.entity.js";

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
        },
        electivo: {
            type:"one-to-many",
            target: "electivos",
            joinColumn:{name:"id_carrera"},
            onDelete:"RESTRICT",
            inverseSide: 'electivo',
        }
    }

})
export default carreraEntity;