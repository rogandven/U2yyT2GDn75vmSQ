"use strict";
import Joi from "joi";
import { HORARIO_PATTERN, SALA_PATTERN, MIN_STRING, MAX_STRING, SALA_OBLIGATORIA, DIA_OBLIGATORIO, HORA_INICIO_OBLIGATORIA, HORA_TERMINO_OBLIGATORIA, CAMPOS_ADICIONALES, DIAS_SEMANA } from "../constants/horarioConstants.js";


export const validateDay = (helpers, value) => {
  if (!DIAS_SEMANA.includes(value.toLowerCase())) {
    return helpers.message("El día debe ser uno de los siguientes: " + DIAS_SEMANA.join(", "));
  }
  return true;
};

const inRange = (integer = 0, min = 0, max = 0) => {
  const _integer = Math.trunc(Number(integer || 0));
  let temp = null;
  let _min = Math.trunc(Number(min || 0));
  let _max = Math.trunc(Number(max || 0));
  if (_min > _max) {
    temp = _max;
    _max = _min;
    _min = temp;
  }
  return (_integer >= _min && _integer <= _max);
}

export const validateHourIntegrity = (hour, hourName) => {
  const parsedHour = String(hour);
  const separatedHour = parsedHour.split(":");
  if (separatedHour.length !== 2) {
    return `La ${hourName} debe estar en formato XX:XX`;
  }
  if (!(inRange(separatedHour[0], 0, 24))) {
    return "Las horas solo pueden ser de 0 a 23";
  }
  if (!(inRange(separatedHour[1], 0, 59))) {
    return "Los minutos solo pueden ser de 0 a 59";
  }
  return null;
}

export const validateHourBusiness = (hora_inicio, hora_termino) => {
  const _hora_inicio = String(hora_inicio);
  const _hora_termino = String(hora_termino);
  if (_hora_inicio.localeCompare(_hora_termino) >= 0) {
    return "La hora de término debe ser posterior a la hora de inicio";
  }
  return null;
}

export const integrityValidation = Joi.object({
  hora_inicio: Joi.string().pattern(HORARIO_PATTERN).messages({
        "string.base": "La hora de inicio debe estar adentro de una cadena de caracteres",
        "string.pattern.base": "El formato de la hora es incorrecto" 
    }),

  hora_termino: Joi.string().pattern(HORARIO_PATTERN).messages({
        "string.base": "La hora de termino debe estar adentro de una cadena de caracteres",
        "string.pattern.base": "El formato de la hora es incorrecto",
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
    .valid(...DIAS_SEMANA)
    .custom(validateDay)
    .messages({
      "string.pattern.base":
        "La sala solo puede contener letras, números y guiones bajos.",
      "string.min": `La sala debe tener al menos ${MIN_STRING} caracteres.`,
      "string.max": `La sala  no puede exceder los ${MAX_STRING} caracteres.`,
      "any.valid": `El día debe ser uno de los siguientes: ${DIAS_SEMANA.join(", ")}`,
      "string.valid": `El día debe ser uno de los siguientes: ${DIAS_SEMANA.join(", ")}`,
    }),
});

// Esquema de validación para el registro de usuarios
export const assignationValidation = Joi.object({
  hora_inicio: Joi.any().required().messages({
        "any.required": HORA_INICIO_OBLIGATORIA,
    }),

  hora_termino: Joi.any().required().messages({
        "any.required": HORA_TERMINO_OBLIGATORIA, 
    }),

  sala: Joi.any().required().messages({
      "any.required": SALA_OBLIGATORIA,
    }),
  dia: Joi.any().required().messages({
      "any.required": DIA_OBLIGATORIO,
      "any.valid": `El día debe ser uno de los siguientes: ${DIAS_SEMANA.join(", ")}`,
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": CAMPOS_ADICIONALES,
  });

export const updateValidation = Joi.object({
  hora_inicio: Joi.any(),
  hora_termino: Joi.any(),
  sala: Joi.any(),
  dia: Joi.any(),
}).min(1).unknown(false).messages({
    "object.min": "Se requiere al menos un campo para actualizar",
    "object.unknown": CAMPOS_ADICIONALES,
});

//MINUTO 5:04 VIDEO ROGER
