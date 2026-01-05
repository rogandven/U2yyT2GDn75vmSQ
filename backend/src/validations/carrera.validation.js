import Joi from "joi";
import { MIN_CAREER, MAX_CAREER, CAREER_REGEXP } from "../constants/validationConstants.js";
import { SIGLA_PATTERN,MIN_STRING,MAX_STRING, NOMBRE_PATTERN,SIGLA_OBLIGATORIA,NOMBRE_OBLIGATORIO,CAMPOS_ADICIONALES } from "../constants/career.constants.js";

const OBJETO_DESCONOCIDO = "Objeto desconocido";

export const integrityValidation = Joi.object({

  sigla: Joi.string()
    .min(MIN_STRING)
    .max(MAX_STRING)
    .pattern(SIGLA_PATTERN)
    .messages({
      "string.pattern.base":
        "La sigla solo puede contener letras, números y guiones bajos.",
      "string.min": `La sigla debe tener al menos ${MIN_STRING} caracteres.`,
      "string.max": `La sigla  no puede exceder los ${MAX_STRING} caracteres.`,
    }),
  nombre: Joi.string()
    .min(MIN_STRING)
    .max(MAX_STRING)
    .pattern(NOMBRE_PATTERN)
    .messages({
      "string.pattern.base":
        "El nombre de carrera solo puede contener letras, números y guiones bajos.",
      "string.min": `La sala debe tener al menos ${MIN_STRING} caracteres.`,
      "string.max": `La sala  no puede exceder los ${MAX_STRING} caracteres.`,
    }),
});

export const createValidation = Joi.object({

  sigla: Joi.any().required().messages({
      "any.required": SIGLA_OBLIGATORIA,
    }),
  nombre: Joi.any().required().messages({
      "any.required": NOMBRE_OBLIGATORIO,
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": CAMPOS_ADICIONALES,
  });

export const updateValidation = Joi.object({
  sigla: Joi.any(),
  nombre: Joi.any(),
}).min(1).unknown(false).messages({
    "object.min": "Se requiere al menos un campo para actualizar",
    "object.unknown": CAMPOS_ADICIONALES,
});

export const joiCareerValidation = Joi.object({
    carrera: Joi.string().required().min(MIN_CAREER).max(MAX_CAREER).regex(CAREER_REGEXP).messages({
        "string.base": "La carrera debe ser un string",
        "string.min": "La carrera no puede ser vacía",
        "string.empty": "La carrera no puede ser vacía",
        //"string.max": `La fecha debe ser de menos de ${MAX_CAREER}`,
        "string.pattern.base": "La carrera solo puede tener letras mayúsculas",
        "any.required": "La carrera es obligatoria",
    })
}).unknown(false).min(1).max(1).messages({
    "any.unknown": OBJETO_DESCONOCIDO,
    "object.unknown": OBJETO_DESCONOCIDO,
    "any.min": OBJETO_DESCONOCIDO,
    "object.min": OBJETO_DESCONOCIDO,            
    "any.max": OBJETO_DESCONOCIDO,
    "object.max": OBJETO_DESCONOCIDO,       
});

export const careerValidationFunction = (value, helpers) => {
    const validationResult = joiCareerValidation.validate({carrera: value});
    if (validationResult.error) {
        return helpers.message(validationResult.error.message);
    }
    return true;
}