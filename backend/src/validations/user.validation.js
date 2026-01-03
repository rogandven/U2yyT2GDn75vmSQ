"use strict";
import Joi from "joi";
import { idValidationFunction } from "./modules/id.validation.js";
import { timestampValidationFunction } from "./modules/timestamp.validation.js";
import { emailDomainValidationFunction } from "./modules/email.validation.js";
import { roleValidationFunction } from "./modules/role.validation.js"; 
import { rutValidationFunction } from "./modules/rut.validation.js";
import { MAX_FULLNAME, MIN_FULLNAME, GENERATION_REGEX, FULLNAME_REGEX, MIN_CREDITOS, MAX_CREDITOS } from "../constants/user.constants.js";
import { MIN_DATE_LENGTH, MAX_DATE_LENGTH } from "../constants/user.constants.js";
import { careerValidationFunction } from "./carrera.validation.js";
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
        "string.empty": "El nombre no puede ser vacío",
        "string.min": `El nombre debe al menos ser de ${MIN_FULLNAME} caracteres`,
        "string.max": `El nombre no puede tener más de ${MAX_FULLNAME} caracteres`,
        "string.pattern.base": "El nombre solo puede tener letras y espacios"
    }),
    username: Joi.string().alphanum().min(MIN_FULLNAME).max(MAX_FULLNAME).messages({
        "string.base": "El nombre de usuario debe ser un string",
        "string.alphanum": "El nombre de usuario debe ser alfanumerico",
        "string.empty": "El nombre de usuario no puede ser vacío",
        "string.min": `El nombre de usuario debe al menos ser de ${MIN_FULLNAME} caracteres`,
        "string.max": `El nombre de usuario no puede tener más de ${MAX_FULLNAME} caracteres`,
    }),
    rut: Joi.string().min(1).max(MAX_FULLNAME).custom(rutValidationFunction).messages({
        "string.empty": "El RUT no puede ser vacío",
        "string.min": "El RUT no puede ser vacío",
        "string.base": "El RUT debe ser un string",
        "string.max": `El RUT no debe ser de más de ${MAX_FULLNAME} caracteres`,
    }),
    email: Joi.string().email().min(1).max(MAX_FULLNAME).custom(emailDomainValidationFunction).messages({
        "string.base": "El correo debe ser un string",
        "string.min": "El correo no puede ser vacío",
        "string.empty": "El correo no puede ser vacío",
        "string.email": "Correo malformado",
        "string.max": `El correo no debe ser de más de ${MAX_FULLNAME} caracteres`,
    }),
    password: Joi.string().min(1).max(MAX_FULLNAME).messages({
        "string.base": "La contraseña debe ser un string",
        "string.min": "La contraseña no puede ser vacía",
        "string.empty": "La contraseña no puede ser vacía",
        "string.max": `La contraseña debe tener menos de ${MAX_FULLNAME} caracteres`,
    }),
    role: Joi.string().min(1).max(MAX_FULLNAME).custom(roleValidationFunction).messages({
        "string.base": "El rol debe ser un string",
        "string.min": "El rol no puede ser vacío",
        "string.empty": "El rol no puede ser vacío",
        "string.max": `El rol no debe ser de más de ${MAX_FULLNAME} caracteres`,
    }),
    generation: Joi.string().min(1).max(MAX_FULLNAME).pattern(GENERATION_REGEX).messages({
        "string.base": "La generación debe ser un string",
        "string.min": "La generación no puede ser vacía",
        "string.pattern.base": "Generación malformada",
        "string.empty": "La generación no puede ser vacía",
        "string.max": `La generación no puede ser de más de ${MAX_FULLNAME} caracteres`,
    }),
    createdAt: Joi.string().min(MIN_DATE_LENGTH).max(MAX_DATE_LENGTH).custom(timestampValidationFunction).messages({
        "string.base": "La fecha de creación debe ser un string",
        "string.min": "La fecha de creación no puede ser vacía",
        "string.empty": "La fecha de creación no puede ser vacía",
        "string.max": `La fecha debe ser de menos de ${MAX_DATE_LENGTH}`,
    }),
    updatedAt: Joi.string().min(MIN_DATE_LENGTH).max(MAX_DATE_LENGTH).custom(timestampValidationFunction).messages({
        "string.base": "La fecha de actualización debe ser un string",
        "string.min": "La fecha de actualización no puede ser vacía",
        "string.empty": "La fecha de actualización no puede ser vacía",
        "string.max": `La fecha debe ser de menos de ${MAX_DATE_LENGTH}`,        
    }),
    id_carrera: Joi.custom(idValidationFunction),
    creditos: Joi.number().integer().min(MIN_CREDITOS).max(MAX_CREDITOS).messages({
        "number.base": "El número de créditos debe ser un número",
        "number.integer": "El número de créditos debe ser un entero",
        "number.min": `El número de créditos debe ser mayor o igual a ${MIN_CREDITOS}`,
        "number.max": `El número de créditos debe ser menor que ${MAX_CREDITOS}`,
    }),
}).unknown(false).messages({
    "any.unknown":"No se permiten campos adicionales",
    "object.unknown":"No se permiten campos adicionales",
});

export const updateValidation = Joi.object({
    fullname: Joi.any(),
    username: Joi.any(),
    rut: Joi.any(),
    email: Joi.any(),
    password: Joi.any(),
    role: Joi.any(),
    generation: Joi.any(),
    id_carrera: Joi.any(),
    creditos: Joi.any(),    
}).min(1).unknown(false).messages({
    "object.min":"Debe proporcionar al menos un campo para actualizar",
    "any.min":"Debe proporcionar al menos un campo para actualizar",
    "any.unknown":"No se permiten campos adicionales",
    "object.unknown":"No se permiten campos adicionales",    
});

export const createValidation = Joi.object({
    fullname: Joi.any().required().messages({
        "any.required":"El nombre completo es obligatorio"
    }),
    username: Joi.any().required().messages({
        "any.required":"El nombre de usuario es obligatorio"
    }),
    rut: Joi.any().required().messages({
        "any.required":"El RUT es obligatorio"
    }),
    email: Joi.any().required().messages({
        "any.required":"El correo electrónico es obligatorio"
    }),
    password: Joi.any().required().messages({
        "any.required":"La contraseña es obligatria"
    }),
    role: Joi.any().required().messages({
        "any.required":"El rol es obligatorio"
    }),
    generation: Joi.any().required().messages({
        "any.required":"La generación es obligatoria"
    }),
    id_carrera: Joi.any().required().messages({
        "any.required":"La carrera es obligatoria"
    }),
    creditos: Joi.any().required().messages({
        "any.required":"Los créditos son obligatorios"
    })
}).min(1).unknown(false).messages({
    "object.min":"Debe proporcionar al menos un campo para actualizar",
    "any.min":"Debe proporcionar al menos un campo para actualizar",
    "any.unknown":"No se permiten campos adicionales",
    "object.unknown":"No se permiten campos adicionales",    
});


export const loginValidation = Joi.object({
    email: Joi.any().required().messages({
        "any.required":"El correo electrónico es obligatorio"
    }),
    password: Joi.any().required().messages({
        "any.required":"La contraseña es obligatria"
    }),
}).min(1).unknown(false).messages({
    "object.min":"Debe proporcionar al menos un campo para entrar",
    "any.min":"Debe proporcionar al menos un campo para entrar",
    "any.unknown":"No se permiten campos adicionales",
    "object.unknown":"No se permiten campos adicionales",    
});
