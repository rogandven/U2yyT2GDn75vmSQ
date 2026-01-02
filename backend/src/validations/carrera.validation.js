import Joi from "joi";
import { MIN_CAREER, MAX_CAREER, CAREER_REGEXP } from "../constants/validationConstants.js";

const OBJETO_DESCONOCIDO = "Objeto desconocido";

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