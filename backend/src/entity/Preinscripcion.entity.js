"use strict";
import { EntitySchema } from "typeorm";
import ElectivoEntity from "./electivo.entity";
import UserEntity from "./user.entity";

export const ElectivoCarreraEntity=new EntitySchema({
    name:"Preinscripcion",
    table_name:"Preinscripciones",
    columns:{
        id:{
            primary:true,
            type:int,
            generated:false

        },

        id_usuario:{
            primary:false,
            type:int,
            generated:false

        },
        id_electivo:{
            primary:false,
            type:int,
            generated:false

        },
        
        estado:{
            type: String,
            nullable:false
        },
        
    },
    relations:{
        usuarios:{
           type: "many-to-one",
            target:UserEntity,
            JoinColumn:{name:"id_usuario"},
            onDelete:"CASCADE",  
        },
        electivo:{
           type: "many-to-one",
            target:ElectivoEntity,
            JoinColumn:{name:"id_electivo"},
            onDelete:"CASCADE", 
        },
        
    }
})