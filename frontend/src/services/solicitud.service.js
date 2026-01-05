import axios from "@services/root.service.js";

const routeHelper = async (URL, body, axiosFunction) => {
  let response = null;
  try {
    response = await axiosFunction(URL, body);
    return {
      data: response.data?.data,
      status: response.status,
      message: response.data?.message
    };
  } catch (error) {
    // console.log(error);
    response = error.response;

    Object.assign(response.data, { status: response.status });
    return response.data || null;
  }
};

export async function createSolicitudAlumno(data) {
  return await routeHelper("/solicitudes/Alumno/Crear", data, axios.post);
}

export async function getSolicitudesAlumno() {
  return await routeHelper("/solicitudes/Alumno/Obtener", null, axios.get);
}

export async function getSolicitudesJefe() {
  return await routeHelper("/solicitudes/JefedeCarrera/Obtener", null, axios.get);
}

export async function approveSolicitud(id) {
  return await routeHelper(`/solicitudes/JefedeCarrera/aprobar/${id}`, undefined, axios.post);
}

export async function rejectSolicitud(id, motivoData) {
  return await routeHelper(`/solicitudes/JefedeCarrera/rechazar/${id}`, motivoData, axios.post);
}