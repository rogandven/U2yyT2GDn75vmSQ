"use strict";
import Joi from "joi";
import { idValidation } from "./modules/id.validation.js";
import { MAX_FULLNAME, MIN_FULLNAME } from "../constants/user.constants.js";
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

export const idValidationFunction = (value, helpers) => {
    const result = idValidation.validate({id: value});
    if (result.error) {
        return helpers.message(result.error.message ? result.error.message : "El ID no es válido");
    }
    return true;
}

export const fullNameValidationFunction = (value, helpers) => {
    
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
    password: Joi.string().min(1) 
});