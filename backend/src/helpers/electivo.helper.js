//import { ESTADOS_VALIDOS } from "../constants/electivo.constants.js";

export const obtenerEstadosValidosComoArray = () => {
    const array = [];
    for (const key in ESTADOS_VALIDOS) {
        if (ESTADOS_VALIDOS.hasOwnProperty(key)) {
            array.push(String(ESTADOS_VALIDOS[key]));
        }
    }
    return array;
}

export function prerequisitosArrayToString(prerequisitos) {
    if (!Array.isArray(prerequisitos)) return null;
    return prerequisitos.join(",");
}

export function prerequisitosStringToArray(prerequisitos) {
    if (!prerequisitos) return [];
    return prerequisitos.split(",").map(p => p.trim());
}

export function parseDateToISO(fecha) {
    if (!fecha) return null;
    const [dd, mm, yyyy] = fecha.split("-");
    return `${yyyy}-${mm}-${dd}`;
}
