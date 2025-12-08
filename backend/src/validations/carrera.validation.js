"use strict";
import Joi from "joi";
import { idValidationFunction } from "./modules/id.validation.js";
import { FULLNAME_REGEX, MAX_FULLNAME, MIN_FULLNAME } from "../constants/user.constants.js";
import { MIN_SIGLA, MAX_SIGLA, SIGLA_DOMAIN } from "../constants/carrera.constants.js";

export const integrityValidation = Joi.object({
    id_carrera: Joi.any().custom(idValidationFunction),
    sigla: Joi.string().min(MIN_SIGLA).max(MAX_SIGLA).pattern(FULLNAME_REGEX).alphanum().messages({
        "string.base": "La sigla debe ser una cadena de caracteres",
        "string.min": `La sigla debe tener a lo menos ${MIN_SIGLA} caracteres`,
        "string.max": `La sigla debe tener menos de ${MAX_SIGLA} caracteres`,
        "string.pattern.base": SIGLA_DOMAIN,
        "string.alphanum": SIGLA_DOMAIN
    }),
    nombre: Joi.string().min(MIN_FULLNAME).max(MAX_FULLNAME).pattern(FULLNAME_REGEX).messages({
        "string.base": "El nombre debe ser una cadena de caracteres",
        "string.min": `El nombre debe tener a lo menos ${MIN_FULLNAME} caracteres`,
        "string.max": `El nombre debe tener menos de ${MAX_FULLNAME} caracteres`,
        "string.pattern.base": "El nombre solo puede tener letras mayúsculas y espacios",
    }),
});

export const createValidation = Joi.object({
    sigla: Joi.any().required().messages({
        "any.required": "La sigla es obligatoria"
    }),
    nombre: Joi.any().required().messages({
        "any.required": "El nombre es obligatorio"
    }),
}).unknown(false).messages({
    "any.unknown": "No se permiten campos adicionales",
    "object.unknown": "No se permiten campos adicionales",
});

export const updateValidation = Joi.object({
    sigla: Joi.any().required().messages({
        "any.required": "La sigla es obligatoria"
    }),
    nombre: Joi.any().required().messages({
        "any.required": "El nombre es obligatorio"
    }),
}).unknown(false).min(1).messages({
    "any.unknown": "No se permiten campos adicionales",
    "object.unknown": "No se permiten campos adicionales",
    "object.min": "Debe proporcionar al menos un campo para actualizar"
});