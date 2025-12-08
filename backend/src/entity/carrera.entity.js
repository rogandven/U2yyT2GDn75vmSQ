import { EntitySchema } from "typeorm";

export const CarreraEntity=new EntitySchema({
  name: "Carrera",
  tableName: "carrera",
  columns: {
    id_carrera: {
        primary: true,
        type: "int",
        generated: true,
        nullable: false,
    },
    sigla: {
        unique: true,
        type: String,
    },
    nombre: {
        unique: false,
        type: String,
    }
  },
});

export default CarreraEntity;