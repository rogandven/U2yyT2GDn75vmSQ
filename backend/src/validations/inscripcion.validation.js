"use strict";

import Joi from "joi";

export const inscripcionValidation = Joi.object({
  electivoId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID del electivo debe ser un número",
      "number.integer": "El ID del electivo debe ser un número entero",
      "number.positive": "El ID del electivo debe ser positivo",
      "any.required": "El ID del electivo es obligatorio"
    })
});
export const inscripcionesEnEsperaValidation = Joi.object({
  id: Joi.number()
  .integer()
  .positive()
  .required()
  .messages({
      "number.base": "El ID del electivo debe ser un número",
      "number.integer": "El ID del electivo debe ser un número entero",
      "number.positive": "El ID del electivo debe ser positivo",
      "any.required": "El ID del electivo es obligatorio"
    }),
  periodo: Joi.string()
  .pattern(/^\d{4}-[12]$/)
  .optional()
  .messages({
      "number.base": "El periodo debe ser un número",
      "number.positive": "El periodo debe ser positivo"
    })
});

export const cancelarInscripcionValidation = Joi.object({
  inscripcionId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de la Inscripcion debe ser un número",
      "number.integer": "El ID de la Inscripcion debe ser un número entero",
      "number.positive": "El ID de la inscripcion debe ser positivo",
      "any.required": "El ID de la inscripcion es obligatorio"
    })
});

export const gestionarInscripcionValidation = Joi.object({
  accion: Joi.string()
    .valid("aprobar", "rechazar")
    .required()
    .messages({
      "string.base": "La acción debe ser un texto",
      "any.only": "La acción debe ser aprobar o rechazar",
      "any.required": "La acción es obligatoria",
    }),

  motivo: Joi.when("accion", {
    is: "rechazar",
    then: Joi.string()
      .min(3)
      .max(500)
      .required()
      .messages({
        "string.base": "El motivo debe ser texto",
        "string.min": "El motivo debe tener al menos 3 caracteres",
        "string.max": "El motivo no puede exceder 500 caracteres",
        "any.required": "El motivo es obligatorio cuando se rechaza una inscripción",
      }),
    otherwise: Joi.optional().allow(null, ""),
  }),
});

export const consultarInscripcionesValidation = Joi.object({
  periodo: Joi.string()
    .pattern(/^\d{4}-[12]$/)
    .optional()
    .messages({
      "string.pattern.base": "El formato del período debe ser YYYY-1 o YYYY-2 (ej: 2024-1)"
    }),
  estado: Joi.string()
    .valid("en espera","aceptada", "rechazada", "retirada")
    .optional()
    .messages({
      "any.only": "El estado debe ser: en espera, aceptada, rechazada o retirada"
    })
});