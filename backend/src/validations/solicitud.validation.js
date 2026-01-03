"use strict";

import Joi from "joi";
import { ESTADOS_SOLICITUD, TIPOS_SOLICITUD } from "../constants/solicitud.constants.js";

export const createSolicitudValidation = Joi.object({
  tipo: Joi.string()
    .valid(...Object.values(TIPOS_SOLICITUD))
    .required(),

  id_electivo: Joi.when("tipo", {
    is: TIPOS_SOLICITUD.INSCRIPCION_ASIGNATURA,
    then: Joi.number().integer().positive().required(),
    otherwise: Joi.forbidden(),
  }),

  creditos_solicitados: Joi.when("tipo", {
    is: TIPOS_SOLICITUD.MAS_CREDITOS,
    then: Joi.number().integer().min(1).required(),
    otherwise: Joi.forbidden(),
  }),

  motivo: Joi.string().min(5).max(255).optional(),
});

export const aprobarSolicitudValidation = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const rechazarSolicitudValidation = Joi.object({
  motivo_rechazo: Joi.string().min(5).max(255).required(),
});
