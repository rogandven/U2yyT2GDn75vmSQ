import { SEPARATOR } from "../../constants/career.constants.js";
import { joiCareerValidation } from "./carrera.validation.js";

const isCareerArrayValid = (string) => {
    if (!string || (typeof(string) !== "string")) {
        return "Carrera no proporcionada";
    }
    if (string.length <= 0) {
        return "Carrera no proporcionada";
    }
    const stringAsArray = string.split(SEPARATOR);
    let current = null;
    for (let i = 0; i < stringAsArray.length; i++) {
        if ((current = joiCareerValidation.validate({carrera: stringAsArray[i]}).error)) {
            return String(current.message);
        }
    }
    return null;
}

export const careerArrayValidationFunction = (value, helpers) => {
    let message = null;
    if ((message = isCareerArrayValid(value))) {
        return helpers.message(message);
    }
    return true;
}