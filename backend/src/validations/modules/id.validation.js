"use strict";
import Joi from "joi";

export const idValidation = Joi.object({
    id: Joi.number().required().integer().positive().messages({
        "any.required": "El ID es obligatorio",
        "number.required": "El ID es obligatorio",
        "number.base": "El ID tiene que ser un número",
        "number.integer": "El ID tiene que ser un entero",
        "number.positive": "El ID tiene que ser positivo"
    }),
}).unknown(false)
    .messages({
        "object.unknown": "No se permiten campos adicionales",
});