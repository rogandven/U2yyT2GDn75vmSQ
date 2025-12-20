import { VALID_ROLES } from "../../constants/user.constants.js";

export const roleValidationFunction = (value, helpers)  => {
    for (const role in VALID_ROLES) {
        if (value === VALID_ROLES[role]) {
            return true;
        }
    }
    return helpers.message(`Solo se permiten los siguientes roles: ${VALID_ROLES.join(", ")}`);
}