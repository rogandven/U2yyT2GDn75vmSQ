"use strict";
import Joi from "joi";
import { HORARIO_PATTERN, SALA_PATTERN, MIN_STRING, MAX_STRING, SALA_OBLIGATORIA, DIA_OBLIGATORIO, HORA_INICIO_OBLIGATORIA, HORA_TERMINO_OBLIGATORIA, CAMPOS_ADICIONALES, DIAS_SEMANA } from "../constants/horarioConstants.js";

export const integrityValidation = Joi.object({
  horario_inicio: Joi.string().pattern(HORARIO_PATTERN).messages({
        "string.base": "La hora de inicio debe estar adentro de una cadena de caracteres",
        "string.pattern": "El formato de la hora es incorrecto" 
    }),

  horario_termino: Joi.string().pattern(HORARIO_PATTERN).messages({
        "string.base": "La hora de termino debe estar adentro de una cadena de caracteres",
        "string.pattern": "El formato de la hora es incorrecto" 
    }),

  sala: Joi.string()
    .min(MIN_STRING)
    .max(MAX_STRING)
    .pattern(SALA_PATTERN)
    .messages({
      "string.pattern.base":
        "La sala solo puede contener letras, números y guiones bajos.",
      "string.min": `La sala debe tener al menos ${MIN_STRING} caracteres.`,
      "string.max": `La sala  no puede exceder los ${MAX_STRING} caracteres.`,
    }),
  dia: Joi.string()
    .min(MIN_STRING)
    .max(MAX_STRING)
    .pattern(SALA_PATTERN)
    .messages({
      "string.pattern.base":
        "La sala solo puede contener letras, números y guiones bajos.",
      "string.min": `La sala debe tener al menos ${MIN_STRING} caracteres.`,
      "string.max": `La sala  no puede exceder los ${MAX_STRING} caracteres.`,
    }),
});

// Esquema de validación para el registro de usuarios
export const assignationValidation = Joi.object({
  horario_inicio: Joi.any().required().messages({
        "any.required": HORA_INICIO_OBLIGATORIA,
        "any.valid": `El día debe ser uno de los siguientes: ${DIAS_SEMANA.join(", ")}`
    }),

  horario_termino: Joi.any().required().messages({
        "any.required": HORA_TERMINO_OBLIGATORIA, 
    }),

  sala: Joi.any().min(MIN_STRING).max(MAX_STRING).required().pattern(SALA_PATTERN).messages({
      "any.required": SALA_OBLIGATORIA,
    }),
  dia: Joi.any().required().messages({
      "any.required": DIA_OBLIGATORIO,
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": CAMPOS_ADICIONALES,
  });

export const updateValidation = Joi.object({
   horario_inicio: Joi.any(),
  horario_termino: Joi.any(),
  sala: Joi.any(),
  dia: Joi.any(),
}).min(1).unknown(false).messages({
    "object.min": "Se requiere al menos un campo para actualizar",
    "object.unknown": CAMPOS_ADICIONALES,
});

//MINUTO 5:04 VIDEO ROGER
