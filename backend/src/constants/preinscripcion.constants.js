/*
export const AWAITING = 'EN_ESPERA';
export const APPROVED = 'APROBADA';
export const REJECTED = 'RECHAZADA';
export const VALID_STATUS_ARRAY = [AWAITING, APPROVED, REJECTED];
export const MIN_STATUS = 1;
export const MAX_STATUS = 100;
export const STATUS_TYPE_JS = "string";
export const STATUS_TYPE_JOI = String;
export const MAX_INSCRIPCIONES = 3;
*/

export const ESTADO_PREINSCRIPCION = {
    PENDIENTE: "PENDIENTE",
    APROBADA: "APROBADA",
    RECHAZADA: "RECHAZADA",
};


export const ESTADOS_PREINSCRIPCION_VALIDOS = Object.values(ESTADO_PREINSCRIPCION);


export const MAX_PREINSCRIPCIONES_POR_ALUMNO = 3;