
"use strict";

import { EntitySchema } from "typeorm";
import { obtenerEstadosValidosComoArray } from "../helpers/electivo.helper.js";
import { arrayDeStringAArrayDeSQL } from "../helpers/sql.helpers.js";
import UserEntity from "./user.entity.js";
/* export enum EstadoElectivo{
    PENDIENTE = 'pendiente'
}*/ 


export const ARRAY_ESTADOS_VALIDOS = obtenerEstadosValidosComoArray();

/*
export const ElectivoEntity = new EntitySchema({
    name: "Electivo",
    tableName: "Electivo",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        nombre: {
            type: String,
            unique: false,
            nullable: false,
        },
        profesor: {
            type: String,
            unique: false,
            nullable: false,
        },
        cupos: {
            type: Number,
            unique: false,
            nullable: false,
        },
        creditos: {
            type: Number,
            unique: false,
            nullable: false
        },
        descripcion: {
            type: String,
            nullable: false,
        },
        estado: {
            type: String,
            unique: false,
            nullable: false,
        },
    },
    checks: [
        { expression: `"estado" IN ${arrayDeStringAArrayDeSQL(ARRAY_ESTADOS_VALIDOS)}` },
    ],
});

export default ElectivoEntity;

/*
import { EntitySchema } from "typeorm";

export const ElectivoEntity=new EntitySchema({
  name: "Electivo",
  tableName: "electivos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
    },
    cupos: {
      type: "int",
    },
    inscritos: {
      type: "int",
      default: 0,
    },
    apertura: {
      type: "date",
    },
    cierre: {
      type: "date",
    },
    area: {
      type: "varchar",
      length: 100,
    },
    descripcion: {
      type: "text",
    },
  },
});

export default ElectivoEntity;
*/
/*
"use strict";

import { EntitySchema } from "typeorm";

export const ElectivoEntity = new EntitySchema({
  name: "Electivo",
  tableName: "electivos",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },

    descripcion: {
      type: "text",
      nullable: false,
    },

    cupos: {
      type: "int",
      nullable: false,
    },

    inscritos: {
      type: "int",
      default: 0,
    },

    apertura: {
      type: "date",
      nullable: false,
    },

    cierre: {
      type: "date",
      nullable: false,
    },

    area: {
      type: "varchar",
      length: 100,
      nullable: false,
    },

    //campos del mer demas compas opcional
    cupos_por_carrera: {
      type: "int",
      nullable: true,
    },

    creditos_requeridos: {
      type: "int",
      nullable: true,
    },

    semestre_minimo: {
      type: "int",
      nullable: true,
    },

    estado: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
  },

  relations: {},
});

export default ElectivoEntity;
*/
// import { EntitySchema } from "typeorm";

export const ElectivoEntity = new EntitySchema({
  name: "Electivo",
  tableName: "electivos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
    }, 
    descripcion: {
      type: "text",
    },
    cupos: {
      type: "int",
    },
    inscritos: {
      type: "int",
      default: 0,
    }, 
    creditos_requeridos:{
      type: "int",
      default: 0,
    },
    semestre_minimo:{
      type: "varchar",
      length: 10,
    },
    estado:{
      type: String,
      default: true,
    },
    apertura: {
      type: "date",
    },
    cierre: {
      type: "date",
    },
    area: {
      type: "varchar",
      length: 100,
    },
    profesorId: {
      type: "int",
      generated:false
    },
  },
  relations:{
    profesor:{
      type:"many-to-one",
      target: UserEntity,
      JoinColumn:{name:"id"},
      onDelete:"CASCADE", 
    }
  }
});

export default ElectivoEntity;
