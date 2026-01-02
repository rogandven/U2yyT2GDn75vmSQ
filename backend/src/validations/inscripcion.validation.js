/* id_inscripcion: {
    type: "int",
},
fecha_hora: {
    type: "timestamp",
},
estado: {
    type: String,
},
id_usuario: {
    type: USER_ID_TYPE,
    nullable: false,
},
id_electivo: {
    type: ELECTIVO_ID_TYPE,
}, */


"use strict";
import Joi from "joi";
import { idValidationFunction } from "./modules/id.validation.js";
import { MAX_DATE_LENGTH, MIN_DATE_LENGTH } from "../constants/user.constants.js";
import { timestampValidationFunction } from "./modules/timestamp.validation.js";
import { MAX_STATUS, MIN_STATUS } from "../constants/inscripcion.constants.js";
import { inscriptionStatusValidationFunction } from "./modules/inscripcion.status.validation.js";

export const integrityValidation = Joi.object({
    id_inscripcion: Joi.any().custom(idValidationFunction),
    fecha_hora: Joi.string().min(MIN_DATE_LENGTH).max(MAX_DATE_LENGTH).custom(timestampValidationFunction).messages({
        "string.base":"La fecha debe estar en formato string",
        "string.min":"La fecha no puede ser vacía",
        "string.max":`La fecha no puede ser de más de ${MAX_DATE_LENGTH} caracteres`,
    }),
    estado: Joi.string().min(MIN_STATUS).max(MAX_STATUS).custom(inscriptionStatusValidationFunction).messages({
        "string.base":"El estado debe estar en formato string",
        "string.min":"El estado no puede ser vacío",
        "string.max":`El estado no puede ser de más de ${MAX_STATUS} caracteres`,
    }),
    id_usuario: Joi.any().custom(idValidationFunction),
    id_electivo: Joi.any().custom(idValidationFunction),
});

export const createValidation = Joi.object({
    estado: Joi.any().required().messages({
        "any.required": "El estado es obligatorio",
    }),
    id_usuario: Joi.any().required().messages({
        "any.required": "El ID del usuario es obligatorio",
    }),
    id_electivo: Joi.any().required().messages({
        "any.required": "El ID de la instancia es obligatorio",
    }),
}).unknown(false).messages({
    "any.unknown": "No se permiten campos adicionales",
    "object.unknown": "No se permiten campos adicionales",
});

export const updateValidation = Joi.object({
    estado: Joi.any(),
    fecha_hora: Joi.any(),
    id_usuario: Joi.any(),
    id_electivo: Joi.any(),
}).unknown(false).min(1).messages({
    "any.unknown": "No se permiten campos adicionales",
    "object.unknown": "No se permiten campos adicionales",
    "object.min": "Debe proporcionar un campo para actualizar",
});

export const findValidation = Joi.object({
    id_inscripcion: Joi.any().required().custom(idValidationFunction)
}).unknown(false).messages({
    "any.unknown": "No se permiten campos adicionales",
    "object.unknown": "No se permiten campos adicionales",
    "any.required": "El ID es obligatorio",
});

export const warningValidation = Joi.object({
    id_electivo: Joi.number().required(),
}).unknown(false);