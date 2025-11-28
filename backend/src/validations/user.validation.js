"use strict";
import Joi from "joi";
import { idValidation } from "./modules/id.validation.js";
import { MAX_FULLNAME, MIN_FULLNAME, VALID_EMAIL_DOMAINS, VALID_ROLES } from "../constants/user.constants.js";
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

const emailDomainValidationFunction = (value, helpers) => {
    for (const domain in VALID_EMAIL_DOMAINS) {
        if (value.endsWith && value.endsWith(domain)) {
            return true;
        }
    }
    return helpers.message(`Solo se permiten los siguientes dominios: ${VALID_EMAIL_DOMAINS.join(", ")}`);
}

const roleValidationFunction = (value, helpers)  => {
    for (const role in VALID_ROLES) {
        if (value === role) {
            return true;
        }
    }
    return helpers.message(`Solo se permiten los siguientes roles: ${VALID_ROLES.join(", ")}`);
}

export const idValidationFunction = (value, helpers) => {
    const result = idValidation.validate({id: value});
    if (result.error) {
        return helpers.message(result.error.message ? result.error.message : "El ID no es válido");
    }
    return true;
}

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
    generation: Joi.string().min(1).pattern(/[1-9]*-[1-2]/).custom().messages({
        "string.base": "La generación debe ser un string",
        "string.min": "La generación no puede ser vacía",
        "string.pattern.base": "Generación malformada",
    }),
    createdAt:
    updatedAt:
    id_carrera:
});