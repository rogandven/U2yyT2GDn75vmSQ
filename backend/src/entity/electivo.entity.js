import { EntitySchema } from "typeorm";
import { ELECTIVO_ID_TYPE } from "../constants/entity.constants.js";

export const ElectivoEntity=new EntitySchema({
  name: "Electivo",
  tableName: "electivo",
  columns: {
    id_instancia: {
      primary: true,
      type: ELECTIVO_ID_TYPE,
      generated: true,
    },
    id: {
      type: "int",
      length: 255,
    },
    nombre: {
      type: "varchar",
      length: 255,
    },
    descripcion: {
      type: "text",
    },    
    cupos_por_carrera: {
      type: "int",
    },
    creditos_requeridos: {
      type: "int",
    },
    generacion_minima: {
      type: "varchar",
      length: 255,
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
    aprobado: {
      type: Boolean,
      nullable: false,
      default: false
    },
  },
});

export default ElectivoEntity;