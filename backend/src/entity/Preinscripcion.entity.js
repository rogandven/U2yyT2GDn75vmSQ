"use strict";
import { EntitySchema } from "typeorm";

export const PreinscripcionEntity=new EntitySchema({
    name:"Preinscripcion",
    table_name:"Preinscripciones",
    columns:{
        id:{
            primary:true,
            type:"integer",
            generated:false

        },

        usuariosId:{
            primary:false,
            type:"integer",
            generated:false

        },
        electivoId:{
            primary:false,
            type:"integer",
            generated:false

        },
        estado:{
            type: String,
            nullable:false
        },
        motivo: {
            type: String,
            nullable:true
        }
    },
    relations:{
        usuarios:{
           type: "many-to-one",
            target:"users",
            JoinColumn:{name:"id_usuario"},
            onDelete:"CASCADE",  
        },
        electivo:{
           type: "many-to-one",
            target:"electivos",
            JoinColumn:{name:"id_electivo"},
            onDelete:"CASCADE", 
        },
    }
});

export default PreinscripcionEntity;