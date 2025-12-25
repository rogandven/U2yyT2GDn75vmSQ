import axios from "@services/root.service.js";

// services de estudiantes
/*
export async function createInscripcion(electivoId, inscripcionData) {
  try {
    const response = await axios.post(`/Inscripciones/Crear/${electivoId}`, inscripcionData);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener la Inscripcion:", error);
    throw error;
  }
}
*/
export async function createInscripcion(electivoId) {
  try {
    const response = await axios.post(
      `/Inscripciones/Crear/${electivoId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error al crear la Inscripción:", error);
    throw error;
  }
}


export async function getUnaInscripciones() {
  try {
    const response = await axios.get(`/Inscripciones/ObtenerAlumno`,);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener la Inscripcion:", error);
    throw error;
  }
}


export async function DeleteInscripcion(inscripcionId) {
  try {
    const response = await axios.delete(`/Inscripciones/Eliminar/${inscripcionId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al eliminar Inscripcion:", error);
    throw error;
  }
}
// services de admin
export async function getInscripciones() {
    try {
        const response = await axios.get('/Inscripciones/admin/en-espera');
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener Inscripciones:", error);
    }
}

export async function gestionarInscripcion(inscripcionId,data) {
    try {
        const response = await axios.put(`/Inscripciones/gestionar/${inscripcionId}`,data);
        return response.data;
    } catch (error) { 
        console.error("Error al gestionar las inscripciones:", error);
    }
}
export async function getNotificaciones() {
    try {
        const response = await axios.get(`/Inscripciones/notificar`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
    }
}
//servicess de docente
export async function getInscripcionesRechazar(data) {
    try {
        const response = await axios.get(`/Inscripciones/Obtener`,data);
        return response.data;
    } catch (error) { 
        console.error("Error al gestionar las inscripciones:", error);
    }
}
export async function gestionarInscripcionesRechazar(inscripcionId,data) {
    try {
        const response = await axios.put(`/Inscripciones/gestionar/Docente/${inscripcionId}`,data);
        return response.data;
    } catch (error) { 
       console.log(error.response?.status); 
       console.log(error.response?.data);
        console.error("Error al gestionar las inscripciones:", error);
    }
}