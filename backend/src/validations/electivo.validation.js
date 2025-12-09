
"use strict";
import Joi from "joi";

const AREAS_PERMITIDAS = [
  "Desarrollo de Software",
  "Bases de Datos y Sistemas de Información",
  "Ciencias de la Computación",
  "Inteligencia Artificial y Ciencia de Datos",
  "Redes y Telecomunicaciones",
  "Ciberseguridad",
  "Ingeniería de Software y Gestión TI",
  "Sistemas Operativos e Infraestructura",
  "Desarrollo Móvil e Interfaces",
  "Innovación y Habilidades Blandas"
];

export const createElectivoValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.empty": "El nombre del electivo es obligatorio.",
      "string.min": "El nombre debe tener al menos 3 caracteres.",
      "string.max": "El nombre no puede superar los 255 caracteres.",
      "any.required": "Debe ingresar el nombre del electivo.",
    }),

  cupos: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "El campo 'cupos' debe ser un número.",
      "number.min": "Debe haber al menos 1 cupo disponible.",
      "any.required": "El campo 'cupos' es obligatorio.",
    }),

  inscritos: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      "number.base": "El campo 'inscritos' debe ser un número.",
      "number.min": "El número de inscritos no puede ser negativo.",
    }),

  apertura: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha de apertura debe tener un formato válido (AAAA-MM-DD).",
      "any.required": "Debe ingresar una fecha de apertura.",
    }),

  cierre: Joi.date()
    .greater(Joi.ref("apertura"))
    .required()
    .messages({
      "date.base": "La fecha de cierre debe tener un formato válido (AAAA-MM-DD).",
      "date.greater": "La fecha de cierre debe ser posterior a la de apertura.",
      "any.required": "Debe ingresar una fecha de cierre.",
    }),

  area: Joi.string()
    .valid(...AREAS_PERMITIDAS)
    .required()
    .messages({
      "any.only": "El área seleccionada no es válida.",
      "any.required": "Debe seleccionar un área.",
    }),

  descripcion: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.empty": "La descripción es obligatoria.",
      "string.min": "La descripción debe tener al menos 10 caracteres.",
      "string.max": "La descripción no puede superar los 500 caracteres.",
      "any.required": "Debe ingresar una descripción para el electivo.",
    }),
});

export const updateElectivoValidation = Joi.object({
  nombre: Joi.string().min(3).max(255).messages({
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede superar los 255 caracteres.",
  }),

  cupos: Joi.number().integer().min(1).messages({
    "number.base": "El campo 'cupos' debe ser un número.",
    "number.min": "Debe haber al menos 1 cupo disponible.",
  }),

  inscritos: Joi.number().integer().min(0).messages({
    "number.base": "El campo 'inscritos' debe ser un número.",
    "number.min": "El número de inscritos no puede ser negativo.",
  }),

  apertura: Joi.date().messages({
    "date.base": "La fecha de apertura debe tener un formato válido (AAAA-MM-DD).",
  }),

  cierre: Joi.date().greater(Joi.ref("apertura")).messages({
    "date.base": "La fecha de cierre debe tener un formato válido (AAAA-MM-DD).",
    "date.greater": "La fecha de cierre debe ser posterior a la de apertura.",
  }),

  area: Joi.string().min(3).max(100).messages({
    "string.min": "El área debe tener al menos 3 caracteres.",
    "string.max": "El área no puede exceder los 100 caracteres.",
  }),

  descripcion: Joi.string().min(10).max(500).messages({
    "string.min": "La descripción debe tener al menos 10 caracteres.",
    "string.max": "La descripción no puede superar los 500 caracteres.",
  }),
})
  .min(1)
  .messages({
    "object.min": "Debe proporcionar al menos un campo para actualizar.",
  });
