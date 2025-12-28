import { ESTADOS_VALIDOS } from "../constants/electivo.constants.js";

export const obtenerEstadosValidosComoArray = () => {
    const array = [];
    for (const key in ESTADOS_VALIDOS) {
        if (ESTADOS_VALIDOS.hasOwnProperty(key)) {
            array.push(String(ESTADOS_VALIDOS[key]));
        }
    }
    return array;
}