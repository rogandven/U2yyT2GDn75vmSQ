import { EntitySchema } from "typeorm";

const CarreraEntity = new EntitySchema({
  name: "carrera",
  tableName: "carrera",
  columns: {
    id_carrera: {
      type: "integer",
      primary: true,
      generated: true,
    },
    sigla: {
      type: String,
      nullable: false,
    },
  },
});

export default CarreraEntity;
