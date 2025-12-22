import { STATUS_TYPE_JS, VALID_STATUS_ARRAY } from "../../constants/inscripcion.constants.js";

export const inscriptionStatusValidationFunction = (value, helpers) => {
    if (!value || typeof(value) !== STATUS_TYPE_JS) {
        return helpers.message("Datos no proporcionados");
    }
    for (let i = 0; i < VALID_STATUS_ARRAY; i++) {
        if (value === VALID_STATUS_ARRAY[i]) {
            return true;
        }
    }

    return helpers.message(`Solo se permiten los siguientes estados: ${VALID_STATUS_ARRAY.join(", ")}`);
}