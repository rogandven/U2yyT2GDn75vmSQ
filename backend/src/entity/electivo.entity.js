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
