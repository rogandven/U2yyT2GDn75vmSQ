import { ADMIN_ROLE } from "../../constants/user.constants.js";

export const shallBeAllowedToMakeChanges = (user_role, user_career, careerString) => {
    if (!user_career || !user_role || !careerString) {
        throw new Error("Función mal llamada");
    }
    if (user_role === ADMIN_ROLE) {
        return true;
    }
    const careerArray = String(careerString).split(",");
    for (let i = 0; i < careerArray.length; i++) {
        if (careerArray[i].trim().toUpperCase() === String(user_career).trim().toUpperCase()) {
            return true;
        }
    }
    return false;
}