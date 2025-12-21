import { MAX_GENERATION, MAX_SEMESTER, MIN_GENERATION, MIN_SEMESTER } from "../../constants/generation.constants.js";
import { MIN_FULLNAME, MAX_FULLNAME } from "../../constants/user.constants.js";
import { GENERATION_REGEX } from "../../constants/user.constants.js";
import Joi from "joi";

const validateGenerationIntegrity = Joi.object({
    generation: Joi.string().min(MIN_FULLNAME).max(MAX_FULLNAME).regex(GENERATION_REGEX).messages({
                    "string.base": "La generación debe ser una cadena de caracteres",
                    "string.min": `La generación debe tener a lo menos ${MIN_FULLNAME} caracteres`,
                    "string.max": `La generación debe menos de ${MAX_FULLNAME} caracteres`,
                    "string.pattern.base": "La generación debe estar en un formato XXXX-X",
    }),
});

const validateGenerationBusiness = (string) => {
    if (!string || typeof(string) !== "string" || (string = string.trim()).length <= 0) {
        return String("Generación no proporcionada");
    }
    const stringArray = string.split("\-");
    if (stringArray.length !== 2) {
        return String("La generación no está en formato XXXX-X");
    }
    const anio = parseInt(stringArray[0]);
    const semestre = parseInt(stringArray[1]);
    if (isNaN(anio) || anio < MIN_GENERATION || anio > MAX_GENERATION) {
        return String("El año se sale de los límites");
    }
    if (isNaN(semestre) || semestre < MIN_SEMESTER || semestre > MAX_SEMESTER) {
        return String("El semestre se sale de los límites");
    }
    return undefined;
}

export const validateGeneration = (value, helpers) => {
    const integrityResult = validateGenerationIntegrity.validate({generation: value});
    if (integrityResult.error) {
        return helpers.message(integrityResult.error.message);
    }
    const businessResult = validateGenerationBusiness(value);
    if (!businessResult) {
        return true;
    }
    return helpers.message(businessResult);
}

export default validateGeneration;