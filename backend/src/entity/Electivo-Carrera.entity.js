"use strict";
import { EntitySchema } from "typeorm";
import ElectivoEntity from "./electivo.entity.js";
import carreraEntity from "./carrera.entity.js";

export const ElectivoCarreraEntity=new EntitySchema({
    name:"ElectivoCarrera",
    table_name:"Electivo_carerras",
    columns:{
        electivoId:{
            primary:true,
            type:"integer",
            generated:false

        },
        carreraId:{
            primary:true,
            type:"integer",
            generated:false

        },
        cupos:{
            type:"integer",
            nullable:false
        },
        
    },
    relations:{
        electivo:{
           type: "many-to-one",
            target:ElectivoEntity,
            JoinColumn:{name:"id"},
            onDelete:"CASCADE", 
        },
        carrera:{
           type: "many-to-one",
            target:carreraEntity,
            JoinColumn:{name:"id"},
            onDelete:"CASCADE",  
        }
    }
});

export default ElectivoCarreraEntity;