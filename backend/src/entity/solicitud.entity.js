"use strict";

import { EntitySchema } from "typeorm";
import { ESTADOS_SOLICITUD, TIPOS_SOLICITUD } from "../constants/solicitud.constants.js";
import { arrayDeStringAArrayDeSQL } from "../helpers/sql.helpers.js";

export const SolicitudEntity = new EntitySchema({
  name: "Solicitud",
  tableName: "solicitudes",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },

    id_estudiante: {
      type: Number,
      nullable: false,
    },

    id_electivo: {
      type: Number,
      nullable: true,
    },

    tipo: {
      type: String,
      nullable: false,
    },

    estado: {
      type: String,
      default: ESTADOS_SOLICITUD.EN_ESPERA,
    },

    creditos_solicitados: {
      type: Number,
      nullable: true,
    },

    motivo: {
      type: String,
      nullable: true,
    },

    motivo_rechazo: {
      type: String,
      nullable: true,
    },

    fecha_creacion: {
      type: "timestamp",
      createDate: true,
    },
  },

  checks: [
    { expression: `"estado" IN ${arrayDeStringAArrayDeSQL(Object.values(ESTADOS_SOLICITUD))}` },
    { expression: `"tipo" IN ${arrayDeStringAArrayDeSQL(Object.values(TIPOS_SOLICITUD))}` },
  ],
});

export default SolicitudEntity;
