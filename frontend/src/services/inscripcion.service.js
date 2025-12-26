import axios from '@services/root.service.js';

const routeHelper = async (URL, body, axiosFunction) => {
  try {
    let response = null;
    if (!body) {
      response = await axiosFunction(URL);
    } else {
      response = await axiosFunction(URL, body);
    }
    
    return {data: response.data, status: response.status, message: response.message};
  } catch (error) {
    console.log("ERROR EN INSCRIPCION.SERVICE: ");
    console.error(error);
    return {status: 500, data: error.response?.data || undefined, message: error.response?.message};
  }
}

export async function private_getInscripciones() {
  return await routeHelper("/inscripciones/admin/", undefined, axios.get);
}

export async function private_getInscripcionesByUser(id) {
  return await routeHelper(`/inscripciones/admin/user/${id}`, undefined, axios.get);
}

export async function private_getInscripcion(id) {
  return await routeHelper(`/inscripciones/admin/inscripcion/${id}`, undefined, axios.get);
}

export async function private_getInscripcionesSinAprobar() {
  return await routeHelper(`/inscripciones/admin/pendiente/`, undefined, axios.get);
}

export async function private_createInscripcion(inscripcionData) {
  return await routeHelper(`/inscripciones/admin/`, inscripcionData, axios.post);
}

export async function private_updateInscripcion(id, inscripcionData) {
  return await routeHelper(`/inscripciones/admin/${id}`, inscripcionData, axios.patch);
}

export async function private_deleteInscripcion(id) {
  return await routeHelper(`/inscripciones/admin/${id}`, undefined, axios.delete);
}

export async function private_approveInscripcion(id) {
  return await routeHelper(`/inscripciones/aprobar/${id}`, undefined, axios.post);
}

export async function private_rejectInscripcion(id) {
  return await routeHelper(`/inscripciones/rechazar/${id}`, undefined, axios.post);
}

export async function public_getInscripcion(id) {
  return await routeHelper(`/inscripciones/${id}`, undefined, axios.patch);
}

export async function public_getInscripcionesByUser() {
  return await routeHelper(`/inscripciones/`, undefined, axios.get);
}

export async function public_createInscripcion(inscripcionData) {
  return await routeHelper(`/inscripciones/`, inscripcionData, axios.post);
}

export async function public_updateInscripcion(id, inscripcionData) {
  return await routeHelper(`/inscripciones/${id}`, inscripcionData, axios.patch);
}

export async function public_deleteInscripcion(id) {
  return await routeHelper(`/inscripciones/${id}`, undefined, axios.patch);
}