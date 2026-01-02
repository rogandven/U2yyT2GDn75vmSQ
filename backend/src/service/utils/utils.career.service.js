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
/*
import { ADMIN_ROLE } from "../../constants/user.constants.js";

export const shallBeAllowedToMakeChanges = (user_role, user_career, careerString) => {
    if (!user_role || !careerString) {
        throw new Error("Función mal llamada");
    }
    if (user_role === ADMIN_ROLE) {
        return true;
    }
    if (!user_career) {
        // No career info for non-admin user: deny instead of throwing
        return false;
    }
    // Normalize user_career: accept object with 'sigla' or 'nombre', or string
    let userCareerString = "";
    try {
        if (typeof user_career === 'string') {
            userCareerString = user_career;
        } else if (user_career && typeof user_career === 'object') {
            userCareerString = (user_career.sigla || user_career.nombre || user_career.id_carrera || "");
        } else {
            userCareerString = String(user_career || "");
        }
    } catch (e) {
        userCareerString = String(user_career || "");
    }
    const careerArray = String(careerString).split(",");
    for (let i = 0; i < careerArray.length; i++) {
        if (String(careerArray[i] || "").trim().toUpperCase() === String(userCareerString || "").trim().toUpperCase()) {
            return true;
        }
    }
    return false;
}
*/