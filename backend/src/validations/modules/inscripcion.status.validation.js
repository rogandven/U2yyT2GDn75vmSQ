/*
import { STATUS_TYPE_JS, VALID_STATUS_ARRAY } from "../../constants/inscripcion.constants.js";

export const inscriptionStatusValidationFunction = (value, helpers) => {
    if (!value || typeof(value) !== STATUS_TYPE_JS) {
        return helpers.message("Datos no proporcionados");
    }
    for (let i = 0; i < VALID_STATUS_ARRAY.length; i++) {
        if (value === VALID_STATUS_ARRAY[i]) {
            return true;
        }
    }

    return helpers.message(`Solo se permiten los siguientes estados: ${VALID_STATUS_ARRAY.join(", ")}`);
}*/

"use strict";

import Joi from "joi";

export const PENDIENTE = "PENDIENTE";
export const APROBADA = "APROBADA";
export const RECHAZADA = "RECHAZADA";

export const VALID_STATUS_ARRAY = [PENDIENTE, APROBADA, RECHAZADA];

export const inscripcionStatusValidation = Joi.string()
    .valid(...VALID_STATUS_ARRAY)
    .required()
    .messages({
        "any.only": "Estado de inscripción inválido",
        "string.base": "El estado debe ser texto",
        "any.required": "El estado es obligatorio",
    });
