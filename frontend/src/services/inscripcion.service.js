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
    // console.log("ERROR EN INSCRIPCION.SERVICE: ");
    // console.error(error);
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

export async function private_approveInscripcion(id, body) {
  return await routeHelper(`/inscripciones/aprobar/${id}`, body, axios.post);
}

export async function private_rejectInscripcion(id, body) {
  return await routeHelper(`/inscripciones/rechazar/${id}`, body, axios.post);
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
  return await routeHelper(`/inscripciones/${id}`, undefined, axios.delete);
}

export async function shallDisplayWarning(id_electivo, id_usuario) {
  return await SDWrouteHelper(`/inscripciones/sdw`, {id_electivo: Number(id_electivo), id_usuario: Number(id_usuario)});
}

const SDWrouteHelper = async (URL, body) => {
  try {
    let response = null;
    response = await axios.get(URL, body, { withCredentials: true });
    return Boolean(response?.result) || false;
  } catch (error) {
    return true;
  }
}

const routeHelper_2 = async (URL, body, axiosFunction) => {
  try {
    let response = null;
    if (!body) {
      response = await axiosFunction(URL);
    } else {
      response = await axiosFunction(URL, body);
    }
    
    return {data: response.data, status: response.status, message: response.message};
  } catch (error) {
    // console.log("ERROR EN INSCRIPCION.SERVICE: ");
    // console.error(error);
    return {status: 500, data: error.response?.data || undefined, message: error.response?.message};
  }
}

export async function private_getInscripciones_2() {
  return await routeHelper("/inscripciones/admin/", undefined, axios.get);
}

export async function private_getInscripcionesByUser_2(id) {
  return await routeHelper(`/inscripciones/admin/${id}`, undefined, axios.get);
}

export async function private_getInscripcion_2(id) {
  return await routeHelper(`/inscripciones/admin/inscripcion/${id}`, undefined, axios.get);
}

export async function private_getInscripcionesSinAprobar_2() {
  return await routeHelper(`/inscripciones/admin/pendiente/`, undefined, axios.get);
}

export async function private_createInscripcion_2(inscripcionData) {
  return await routeHelper(`/inscripciones/admin/`, inscripcionData, axios.post);
}

export async function private_updateInscripcion_2(id, inscripcionData) {
  return await routeHelper(`/inscripciones/admin/${id}`, inscripcionData, axios.patch);
}

export async function private_deleteInscripcion_2(id) {
  return await routeHelper(`/inscripciones/admin/${id}`, undefined, axios.delete);
}

export async function private_approveInscripcion_2(id) {
  return await routeHelper(`/inscripciones/aprobar/${id}`, undefined, axios.post);
}

export async function private_rejectInscripcion_2(id, motivoData) {
  return await routeHelper(`/inscripciones/rechazar/${id}`, motivoData, undefined, axios.post);
}

export async function public_getInscripcion_2(id) {
  return await routeHelper(`/inscripciones/${id}`, undefined, axios.patch);
}

export async function public_getInscripcionesByUser_2() {
  return await routeHelper(`/inscripciones/`, undefined, axios.get);
}

export async function public_createInscripcion_2(inscripcionData) {
  return await routeHelper(`/inscripciones/`, inscripcionData, axios.post);
}

export async function public_updateInscripcion_2(id, inscripcionData) {
  return await routeHelper(`/inscripciones/${id}`, inscripcionData, axios.patch);
}

export async function public_deleteInscripcion_2(id) {
  return await routeHelper(`/inscripciones/${id}`, undefined, axios.delete);
}

export async function shallDisplayWarning_2(id_electivo, id_usuario) {
  return await SDWrouteHelper(`/inscripciones/sdw`, {id_electivo: Number(id_electivo), id_usuario: Number(id_usuario)});
}

const SDWrouteHelper_2 = async (URL, body) => {
  try {
    let response = null;
    response = await axios.get(URL, body, { withCredentials: true });
    return Boolean(response?.result) || false;
  } catch (error) {
    return true;
  }
}