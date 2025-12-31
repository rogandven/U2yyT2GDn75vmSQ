import { EntitySchema } from "typeorm";
import { ELECTIVO_ID_TYPE, USER_ID_TYPE } from "../constants/entity.constants.js";
import { AWAITING, STATUS_TYPE_JOI } from "../constants/inscripcion.constants.js";

export const InscripcionEntity=new EntitySchema({
  name: "Inscripcion",
  tableName: "inscripcion",
  columns: {
    id_inscripcion: {
        primary: true,
        type: "int",
        generated: true,
        nullable: false,
    },
    fecha_hora: {
        primary: true,
        type: "timestamp",
        nullable: false,
        default: () => "CURRENT_TIMESTAMP",        
    },
    estado: {
        type: STATUS_TYPE_JOI,
        nullable: false,
        default: AWAITING,
    },

    /*id_usuario: {
        type: USER_ID_TYPE,
        nullable: false,
    },
    id_electivo: {
        type: ELECTIVO_ID_TYPE,
        nullable: false,
    },*/
  },
});

export default InscripcionEntity;