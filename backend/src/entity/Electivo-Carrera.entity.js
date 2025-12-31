"use strict";
import { EntitySchema } from "typeorm";

export const ElectivoCarreraEntity=new EntitySchema({
    name:"ElectivoCarrera",
    table_name:"Electivo_carerras",
    columns:{
        id_electivo:{
            primary:true,
            type:int,
            generated:false

        },
        id_carreras:{
            primary:true,
            type:int,
            generated:false

        },
        cupos:{
            type:int,
            nullable:false
        },
        
    },
    relations:{
        electivo:{
           type: "many-to-one",
            target:"electivos",
            JoinColumn:{name:"id_electivo"},
            onDelete:"CASCADE", 
        },
        carrera:{
           type: "many-to-one",
            target:"carreras",
            JoinColumn:{name:"id_carreras"},
            onDelete:"CASCADE",  
        }
        
    }
})