export const ESTADOS_VALIDOS = {
    PENDIENTE: 'pendiente',
    APROBADO: 'aprobado',
    RECHAZADO: 'rechazado',
    ACTIVO: 'activo',
    INACTIVO: 'inactivo'
};

export const MIN_CUPOS = 1;
export const MAX_CUPOS = 500;
export const MIN_INSCRITOS = 0;
export const MAX_INSCRITOS = MAX_CUPOS;

export const DeleteNotification = (electivoData, deletedBy) => {
    return {
        textContent: `Estimado usuario,

        Se le informa que el electivo "${electivoData.nombre}" ha sido eliminado del sistema.

        Detalles:
        - Electivo: ${electivoData.nombre}
        - Descripción: ${electivoData.descripcion || "Sin descripción"}
        - Eliminado por: ${deletedBy.nombre} (${deletedBy.rol})
        - Fecha: ${new Date().toLocaleDateString()}
        - Hora: ${new Date().toLocaleTimeString()}
        
        Esta es una notificación automática del sistema.
        No responda a este correo.

        Sistema Inscripcion Electivos 2025-2 UBB
        ${new Date().getFullYear()}`,
    }
};