"use strict";
import Joi from "joi";

// Esquema de validación para el registro de usuarios
export const assignationValidation = Joi.object({
  sala: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.pattern.base":
        "La sala solo puede contener letras, números y guiones bajos.",
      "string.min": "La sala debe tener al menos 3 caracteres.",
      "string.max": "La sala  no puede exceder los 30 caracteres.",
      "string.empty": "La sala  es obligatoria.",
    }),
   horario: Joi.string().required().pattern(/^([0-9]{2})\:([0-9]{2})$/).messages({
        "string.base": "La hora debe estar adentro de una cadena de caracteres",
        "any.required": "La hora es obligatoria",
        "string.pattern": "El formato de la hora es incorrecto" 
    }),
    cupos: Joi.number()
        .required()
        .messages({
            "number.base": "los cupos deben ser un numero",
            "any.required": "Debe proporcionar los cupos de la actividad a eliminar",
        }),
    profesor: Joi.any().required(),
    nombreEl: Joi.any().required()
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });

export const updateValidation = Joi.object({
    sala: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.pattern.base":
        "La sala solo puede contener letras, números y guiones bajos.",
      "string.min": "La sala debe tener al menos 3 caracteres.",
      "string.max": "La sala  no puede exceder los 30 caracteres.",
    }),
    horario: Joi.string().pattern(/^([0-9]{2})\:([0-9]{2})$/).messages({
        "string.base": "La hora debe estar adentro de una cadena de caracteres",
        "any.required": "La hora es obligatoria",
        "string.pattern": "El formato de la hora es incorrecto" 
    }),
    cupos: Joi.number().min(1).max(100).messages({
        "any.required": "Los cupos son obligatorios",
        "number.base": "Los cupos deben ser un número",
        "number.min": "Los cupos deben ser al menos 1",
        "number.max": "Los cupos no pueden exceder 100"
    })
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales",
});
