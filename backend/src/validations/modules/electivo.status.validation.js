"use strict";

import Joi from "joi";

export const ELECTIVO_STATUS = ["PENDIENTE", "APROBADO", "RECHAZADO"];

export const electivoStatusValidation = Joi.string()
    .valid(...ELECTIVO_STATUS)
    .required()
    .messages({
        "any.only": "Estado de electivo inválido",
        "string.base": "El estado del electivo debe ser texto",
        "any.required": "El estado del electivo es obligatorio",
    });
