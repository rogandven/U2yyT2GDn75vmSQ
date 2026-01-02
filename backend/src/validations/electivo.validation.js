/*
"use strict";
import Joi from "joi";
import { timeValidationFunction } from "./modules/timestamp.validation.js";
import { FULLNAME_REGEX, MAX_CREDITOS, MAX_DATE_LENGTH, MIN_CREDITOS, MIN_DATE_LENGTH } from "../constants/user.constants.js";
import { MIN_FULLNAME, MAX_FULLNAME } from "../constants/user.constants.js";
import { fullnameRegexMessageGenerator } from "../constants/user.constants.js";
import { MAX_CUPOS, MIN_CUPOS } from "../constants/electivo.constants.js";
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
      "number.max": `No puede haber más de ${MAX_CUPOS} cupos.`,
  }),
  creditos_requeridos: Joi.number().integer().min(MIN_CREDITOS).max(MAX_CREDITOS).messages({
      "number.base": "Los créditos requeridos deben ser un número.",
      "number.min": `Debe haber al menos ${MIN_CUPOS} créditos requeridos.`,
      "number.max": `No puede haber más de ${MAX_CUPOS} cupos.`,
  }),
  apertura: Joi.date().messages({
      "date.base": "La fecha de apertura debe tener un formato válido (AAAA-MM-DD).",
      "date.min": "No se puede establecer una fecha de apertura que ya ha pasado.",
    }),
  cierre: Joi.date()
    .greater(Joi.ref("apertura"))
    .messages({
      "date.base": "La fecha de cierre debe tener un formato válido (AAAA-MM-DD).",
      "any.greater": "La fecha de cierre debe ser mayor que la fecha de apertura.",
      "date.greater": "La fecha de cierre debe ser mayor que la fecha de apertura.",
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
      "any.only": `Solo se permiten las siguientes áreas: ${AREAS_PERMITIDAS_EN_MAYUSCULA.join(", ")}`,
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
  creditos_requeridos: Joi.any().required().messages({
    "any.required": "Los créditos requeridos son obligatorios",
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
  creditos_requeridos: Joi.any(),
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
*/

"use strict";
import Joi from "joi";

//Estados válidos según tu entity actual
const ESTADOS_ELECTIVO = ["PENDIENTE", "APROBADO", "RECHAZADO"];

//si quieres permitir que profesor cree electivo siempre PENDIENTE,
//en createValidation no exigimos "estado" (lo pone el backend).
export const electivoIntegrityValidation = Joi.object({
  id_electivo: Joi.number().integer().min(1),
  nombre_electivo: Joi.string().min(3).max(120).messages({
    "string.base": "El nombre del electivo debe ser texto.",
    "string.min": "El nombre del electivo debe tener al menos 3 caracteres.",
    "string.max": "El nombre del electivo no puede exceder 120 caracteres.",
  }),
  descripcion: Joi.string().min(5).messages({
    "string.base": "La descripción debe ser texto.",
    "string.min": "La descripción debe tener al menos 5 caracteres.",
  }),
  cupos: Joi.number().integer().min(1).max(500).messages({
    "number.base": "Los cupos deben ser un número.",
    "number.integer": "Los cupos deben ser un entero.",
    "number.min": "Los cupos deben ser al menos 1.",
    "number.max": "Los cupos no pueden superar 500.",
  }),
  prerequisitos_asignaturas: Joi.string().allow(null, ""),
  fecha_inicio: Joi.date().messages({
    "date.base": "La fecha de inicio debe tener formato válido (AAAA-MM-DD).",
  }),
  fecha_fin: Joi.date().greater(Joi.ref("fecha_inicio")).messages({
    "date.base": "La fecha de fin debe tener formato válido (AAAA-MM-DD).",
    "date.greater": "La fecha de fin debe ser posterior a la fecha de inicio.",
    "any.greater": "La fecha de fin debe ser posterior a la fecha de inicio.",
  }),
  area_electivo: Joi.string().min(3).max(80),
  creditos_minimos_aprobados: Joi.number().integer().min(0).max(1000),
  link_programa: Joi.string().uri().allow(null, "").messages({
    "string.uri": "El link_programa debe ser una URL válida.",
  }),
  estado: Joi.string().valid(...ESTADOS_ELECTIVO),
  motivo_rechazo: Joi.string().allow(null, ""),
  carreras: Joi.array().items(Joi.number().integer().min(1)).messages({
    "array.base": "Carreras debe ser un arreglo de IDs.",
  }),
})
  .unknown(false)
  .messages({ "object.unknown": "No se permiten campos adicionales" });

export const createElectivoValidation = Joi.object({
  nombre_electivo: Joi.any().required().messages({
    "any.required": "El nombre del electivo es obligatorio.",
  }),
  descripcion: Joi.any().required().messages({
    "any.required": "La descripción es obligatoria.",
  }),
  cupos: Joi.any().required().messages({
    "any.required": "Los cupos son obligatorios.",
  }),
  fecha_inicio: Joi.any().required().messages({
    "any.required": "La fecha de inicio es obligatoria.",
  }),
  fecha_fin: Joi.any().required().messages({
    "any.required": "La fecha de fin es obligatoria.",
  }),
  area_electivo: Joi.any().required().messages({
    "any.required": "El área del electivo es obligatoria.",
  }),
  creditos_minimos_aprobados: Joi.any().required().messages({
    "any.required": "Los créditos mínimos aprobados son obligatorios.",
  }),
  carreras: Joi.any().required().messages({
    "any.required": "Debe indicar al menos una carrera (IDs).",
  }),
  prerequisitos_asignaturas: Joi.any(),
  link_programa: Joi.any(),
})
  .unknown(false)
  .messages({ "object.unknown": "No se permiten campos adicionales" });

export const updateElectivoValidation = Joi.object({
  nombre_electivo: Joi.any(),
  descripcion: Joi.any(),
  cupos: Joi.any(),
  prerequisitos_asignaturas: Joi.any(),
  fecha_inicio: Joi.any(),
  fecha_fin: Joi.any(),
  area_electivo: Joi.any(),
  creditos_minimos_aprobados: Joi.any(),
  link_programa: Joi.any(),
})
  .min(1)
  .unknown(false)
  .messages({
    "object.min": "Debe proporcionar al menos un campo para actualizar.",
    "object.unknown": "No se permiten campos adicionales",
  });

export const rejectElectivoValidation = Joi.object({
  motivo_rechazo: Joi.string().min(3).required().messages({
    "any.required": "El motivo de rechazo es obligatorio.",
    "string.min": "El motivo de rechazo debe tener al menos 3 caracteres.",
  }),
})
  .unknown(false)
  .messages({ "object.unknown": "No se permiten campos adicionales" });
