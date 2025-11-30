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
    codigo: {
      type: "varchar",
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
  },
});

export default ElectivoEntity;