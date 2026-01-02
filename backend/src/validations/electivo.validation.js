
"use strict";
import Joi from "joi";
import { timeValidationFunction } from "./modules/timestamp.validation.js";
import { FULLNAME_REGEX, MAX_DATE_LENGTH, MIN_DATE_LENGTH } from "../constants/user.constants.js";
import { MIN_FULLNAME, MAX_FULLNAME } from "../constants/user.constants.js";
import { fullnameRegexMessageGenerator } from "../constants/user.constants.js";
import { MAX_CUPOS, MAX_INSCRITOS, MIN_CUPOS, MIN_INSCRITOS } from "../constants/electivo.constants.js";
import validateGeneration from "./modules/generation.validation.js"; 
import { ARRAY_ESTADOS_VALIDOS } from "../entity/electivo.entity.js";
import { careerArrayValidationFunction } from "./modules/carreraArray.validation.js";
import { idValidationFunction } from "./modules/id.validation.js";

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

const getAllowedAreasInUppercase = () => {
  const array = [];
  for (let i = 0; i < AREAS_PERMITIDAS.length; i++) {
    array.push(String(AREAS_PERMITIDAS[i].toUpperCase().trim()));
  }
  return array;
}

const AREAS_PERMITIDAS_EN_MAYUSCULA = getAllowedAreasInUppercase();

export const getElectivosIntegrityValidation = Joi.object({
  filtro: Joi.string().pattern(FULLNAME_REGEX).min(MIN_FULLNAME).max(MAX_FULLNAME).messages({
    "string.base":"El filtro debe ser un string",
    "string.min": `El filtro debe ser de ${MIN_FULLNAME} caracteres o más`,
    "string.max": `El filtro debe ser de ${MAX_FULLNAME} caracteres o menos`,
    "string.pattern.base": fullnameRegexMessageGenerator('El', 'filtro'),
  }),
  area: Joi.string().pattern(FULLNAME_REGEX).min(MIN_FULLNAME).max(MAX_FULLNAME).messages({
    "string.base":"El área debe ser un string",
    "string.min": `El área debe ser de ${MIN_FULLNAME} caracteres o más`,
    "string.max": `El área debe ser de ${MAX_FULLNAME} caracteres o menos`,
    "string.pattern.base": fullnameRegexMessageGenerator('El', 'área'),
  }),
  apertura: Joi.string().min(MIN_DATE_LENGTH).max(MAX_DATE_LENGTH).custom(timeValidationFunction).messages({
    "string.base":"La fecha de apertura debe ser un string",
    "string.empty": "La fecha de apertura no puede ser vacía",
    "string.min": "La fecha de apertura no puede ser vacía",
    "string.max": `La fecha de apertura ser de menos de ${MAX_DATE_LENGTH}`,       
  }),
  cierre: Joi.string().custom(timeValidationFunction).messages({
    "string.base":"La fecha de cierre debe ser un string",
    "string.empty": "La fecha de cierre no puede ser vacía",
    "string.min": "La fecha de cierre no puede ser vacía",
    "string.max": `La fecha de cierre ser de menos de ${MAX_DATE_LENGTH}`,     
  }),
});

export const integrityValidation = Joi.object({
  nombre: Joi.string().regex(FULLNAME_REGEX).min(MIN_FULLNAME).max(MAX_FULLNAME).messages({
    "string.base": "El nombre debe ser una string",
    "string.empty": "El nombre del electivo es obligatorio.",
    "string.min": `El nombre debe tener al menos ${MIN_FULLNAME} caracteres.`,
    "string.max": `El nombre no puede superar los ${MAX_FULLNAME} caracteres.`,
    "string.pattern.base": `El nombre del electivo solo puede tener letras y espacios.`,
  }),
  cupos: Joi.number().integer().min(MIN_CUPOS).max(MAX_CUPOS).messages({
      "number.base": "El campo 'cupos' debe ser un número.",
      "number.min": `Debe haber al menos ${MIN_CUPOS} cupo disponible.`,
  }),
  inscritos: Joi.number().integer().min(MIN_INSCRITOS).max(MAX_INSCRITOS).default(0).messages({
    "number.base": "El campo 'inscritos' debe ser un número.",
    "number.min": "El número de inscritos no puede ser negativo.",
  }),
  apertura: Joi.date().messages({
      "date.base": "La fecha de apertura debe tener un formato válido (AAAA-MM-DD).",
      "date.min": "No se puede establecer una fecha de apertura que ya ha pasado.",
    }),
  cierre: Joi.date()
    .greater(Joi.ref("apertura"))
    .messages({
      "date.base": "La fecha de cierre debe tener un formato válido (AAAA-MM-DD).",
    }),
  area: Joi.string()
    .min(MIN_FULLNAME)
    .max(MAX_FULLNAME)
    .valid(...getAllowedAreasInUppercase())
    .messages({
      "string.empty": "El área del electivo es obligatoria.",
      "string.min": `El área debe tener al menos ${MIN_FULLNAME} caracteres.`,
      "string.max": `El área no puede exceder los ${MAX_FULLNAME} caracteres.`,
      "any.required": "Debe ingresar el área del electivo.",
      "any.valid": `Solo se permiten las siguientes áreas: ${AREAS_PERMITIDAS_EN_MAYUSCULA.join(", ")}`,
      "string.valid": `Solo se permiten las siguientes áreas: ${AREAS_PERMITIDAS_EN_MAYUSCULA.join(", ")}`,
    }),
  descripcion: Joi.string()
    .min(MIN_FULLNAME)
    .max(MAX_FULLNAME)
    .messages({
      "string.empty": "La descripción es obligatoria.",
      "string.min": `La descripción debe tener al menos ${MIN_FULLNAME} caracteres.`,
      "string.max": `La descripción no puede superar los ${MAX_FULLNAME} caracteres.`,
    }),
  estado: Joi.string().min(MIN_FULLNAME).max(MAX_FULLNAME).valid(...ARRAY_ESTADOS_VALIDOS).messages({
      "string.min": `El estado debe tener al menos ${MIN_FULLNAME} caracteres.`,
      "string.max": `El estado no puede exceder los ${MAX_FULLNAME} caracteres.`,
      "string.base":"El estado debe ser una cadena de caracteres",
      "string.valid": `Solo se permiten los siguientes estados: ${ARRAY_ESTADOS_VALIDOS.join(", ")}`,
      "any.valid": `Solo se permiten los siguientes estados: ${ARRAY_ESTADOS_VALIDOS.join(", ")}`
  }),
  semestre_minimo: Joi.custom(validateGeneration),
  carreras: Joi.custom(careerArrayValidationFunction),
  id_profesor: Joi.custom(idValidationFunction)
});


export const createValidation = Joi.object({
  nombre: Joi.any().required().messages({
    "any.required": "El nombre es obligatorio",
  }),
  cupos: Joi.any().required().messages({
    "any.required": "Los cupos son obligatorios",
  }),
  apertura: Joi.any().required().messages({
    "any.required": "La fecha de apertura es obligatoria",
  }),
  cierre: Joi.any().required().messages({
    "any.required": "La fecha de cierre es obligatoria",
  }),
  area: Joi.any().required().messages({
    "any.required": "El área es obligatoria",
  }),
  descripcion: Joi.any().required().messages({
    "any.required": "La descripción es obligatoria",
  }),
  estado: Joi.any().required().messages({
    "any.required": "El estado es obligatorio",
  }),
  semestre_minimo: Joi.any().required().messages({
    "any.required": "El semestre mínimo es obligatorio",
  }),
  carreras: Joi.any().required().messages({
    "any.required": "Las carreras son obligatorias",
  }),
  id_profesor: Joi.any().required().messages({
    "any.required": "El ID del profesor es obligatorio",
  }),
  motivo: Joi.string().min(100).max(500).required().messages({
      "string.empty": "El motivo no puede estar vacío",
      "string.min": "El motivo debe tener al menos 100 caracteres",
      "string.max": "El motivo no puede superar los 500 caracteres",
      "any.required": "El motivo es requerido",
  })
}).unknown(false).messages({
    "any.unknown": "No se permiten campos adicionales"
});

export const updateValidation = Joi.object({
  nombre: Joi.any(),
  cupos: Joi.any(),
  apertura: Joi.any(),
  cierre: Joi.any(),
  area: Joi.any(),
  descripcion: Joi.any(),
  aprobado: Joi.any(),
  semestre_minimo: Joi.any(),
  carreras: Joi.any(),
  id_profesor: Joi.any(),
  motivo: Joi.any(),
}).min(1).messages({
  "object.min":"Debe proporcionar un campo para actualizar",
  "any.min":"Debe proporcionar un campo para actualizar",
});

export const dateCreationValidation = Joi.object({
  apertura: Joi.date().min(Date.now()).messages({
      "date.base": "La fecha de apertura debe tener un formato válido (AAAA-MM-DD).",
      "date.min": "La fecha de apertura especificada ya pasó",
    }),
  cierre: Joi.date().min(Date.now()).messages({
      "date.base": "La fecha de cierre debe tener un formato válido (AAAA-MM-DD).",
      "date.min": "La fecha de cierre especificada ya pasó",
    }),
}).unknown(true);

/*
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
}); */

