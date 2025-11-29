"use strict";
import Joi from "joi";
import { idValidationFunction } from "./modules/id.validation.js";
import { timestampValidationFunction } from "./modules/timestamp.validation.js";
import { emailDomainValidationFunction } from "./modules/email.validation.js";
import { roleValidationFunction } from "./modules/role.validation.js"; 
import { MAX_FULLNAME, MIN_FULLNAME, GENERATION_REGEX } from "../constants/user.constants.js";
/*
        id
        fullname
        username
        rut
        email
        password
        role
        generation
        createdAt
        updatedAt
        id_carrera
*/

export const integrityValidation = Joi.object({
    id: Joi.any().custom(idValidationFunction),
    fullname: Joi.string().min(MIN_FULLNAME).max(MAX_FULLNAME).pattern(FULLNAME_REGEX).messages({
        "string.base": "El nombre debe ser un string",
        "string.min": `El nombre debe al menos ser de ${MIN_FULLNAME} caracteres`,
        "string.max": `El nombre no puede tener más de ${MAX_FULLNAME} caracteres`,
        "string.pattern.base": "El nombre solo puede tener letras y espacios"
    }),
    username: Joi.string().alphanum().min(MIN_FULLNAME).max(MAX_FULLNAME).messages({
        "string.base": "El nombre de usuario debe ser un string",
        "string.alphanum": "El nombre de usuario debe ser alfanumerico",
        "string.min": `El nombre de usuario debe al menos ser de ${MIN_FULLNAME} caracteres`,
        "string.max": `El nombre de usuario no puede tener más de ${MAX_FULLNAME} caracteres`,
    }),
    email: Joi.string().email().custom(emailDomainValidationFunction).messages({
        "string.base": "El correo debe ser un string",
        "string.email": "Correo malformado",
    }),
    password: Joi.string().min(1).messages({
        "string.base": "La contraseña debe ser un string",
        "string.min": "La contraseña no puede ser vacía",
    }),
    role: Joi.string().min(1).custom(roleValidationFunction).messages({
        "string.base": "El rol debe ser un string",
        "string.min": "El rol no puede ser vacío",
    }),
    generation: Joi.string().min(1).pattern(GENERATION_REGEX).messages({
        "string.base": "La generación debe ser un string",
        "string.min": "La generación no puede ser vacía",
        "string.pattern.base": "Generación malformada",
    }),
    createdAt: Joi.string().min(1).custom(timestampValidationFunction).messages({
        "string.base": "La fecha de creación debe ser un string",
        "string.min": "La fecha de creación no puede ser vacía",
    }),
    updatedAt: Joi.string().min(1).custom(timestampValidationFunction).messages({
        "string.base": "La fecha de actualización debe ser un string",
        "string.min": "La fecha de actualización no puede ser vacía",
    }),
    id_carrera: Joi.any().custom(idValidationFunction),
});