import axios from '@services/root.service.js';

const routeHelper = async (URL, body, axiosFunction) => {
  let response = null;
  try {
    response = await axiosFunction(URL, body);
    return {data: response.data?.data, status: response.status, message: response.data?.message};
  } catch (error) {
    console.log(error);
    response = error.response;
    if (response.data.message) {
      response.data.message = String(response.data.message).replaceAll("AAAA-MM-DD", "DD-MM-AAAA");
    }
    
    Object.assign(response.data, {status: response.status});
    return response.data || null;
  }
}

export async function getElectivos() {
  return await routeHelper("/electivos/get/", null, axios.get);
}

export async function getElectivoById(id) {
  return await routeHelper(`/electivos/get/${id}`, null, axios.get);
}

export async function getElectivosSinAprobar() {
  return await routeHelper(`/electivos/get_private`, null, axios.get);
}

export async function createElectivoProfesor(electivoData) {
  return await routeHelper("/electivos", electivoData, axios.post);
}

export async function createElectivoJefeDeCarrera(electivoData) {
  return await routeHelper(`/electivos/private`, electivoData, axios.post);
}

export async function approveElectivo(id, body = undefined) {
  if (typeof(id) !== "number") {
    console.error(id);
  }
  return await routeHelper(`/electivos/private/approve/${id}`, body, axios.post);
}

export async function rejectElectivo(id, formValues) {
  return await routeHelper(`/electivos/private/reject/${id}`, formValues, axios.post);
}

export async function editElectivo(id, electivoData) {
  return await routeHelper(`/electivos/${id}`, electivoData, axios.patch);
}

export async function updateElectivo(id, electivoData) {
  return await editElectivo(id, electivoData);
}

export async function deleteElectivo(id) {
  return await routeHelper(`/electivos/${id}`, undefined, axios.delete);
}

/* export async function getElectivos() {
    try {
        const response = await axios.get('/electivos');
        return response.data.data;
    } catch (error) {
        // console.error("Error al obtener electivos:", error);
    }
}

const cambiarEstadoHelper = async (verbo, id) => {
    try {
        const response = await axios.post(`/electivos/${id}/${verbo}`);
        // // console.log(response);
        return {data: response.data, code: response.status || 500};
    } catch (error) {
        // console.error("Error al aprobar el electivo: ", error);
        return null;
    }
}

export async function aprobarElectivos(id) {
    return await cambiarEstadoHelper('aprobar', id);
}

export async function rechazarElectivos(id) {
    return await cambiarEstadoHelper('rechazar', id);
}

export async function editElectivo(electivoId, electivoData) { 
    try {
        const response = await axios.patch(`/electivos/${electivoId}`, electivoData);
        return response.data;
    } catch (error) {
        // console.error("Error al editar el electivo:", error);
    }
}

export async function deleteElectivo(electivoId) {
    try {
        const response = await axios.delete(`/electivos/${electivoId}`);
        return response.data;
    } catch (error) {
        // console.error("Error al eliminar el electivo:", error);
    }
}


// import axios from "@services/root.service.js";
/* import axios from "@services/root.service.js";


export async function getElectivos(query = "") {
  try {
    const response = await axios.get(`/electivos${query}`);
    return response.data.data || [];
  } catch (error) {
    // console.error("Error al obtener electivos:", error);
    throw error;
  }
}

export async function createElectivo(electivoData) {
  try {
    const response = await axios.post("/electivos", electivoData);
    return response.data.data || response.data;
  } catch (error) {
    // console.error("Error al crear electivo:", error);
    throw error;
  }
}

export async function updateElectivo(id, electivoData) {
  try {
    const response = await axios.patch(`/electivos/${id}`, electivoData);
    return response.data.data || response.data;
  } catch (error) {
    // console.error("Error al actualizar electivo:", error);
    throw error;
  }
}


export async function deleteElectivo(id) {
  try {
    const response = await axios.delete(`/electivos/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    // console.error("Error al eliminar electivo:", error);
    throw error;
  }
}
*/

// import axios from '@services/root.service.js';
/*
export async function getElectivos() {
    try {
        const response = await axios.get('/electivos');
        return response.data.data;
    } catch (error) {
        // console.error("Error al obtener electivos:", error);
    }
}

export async function editElectivo(electivoId, electivoData) { 
    try {
        const response = await axios.patch(`/electivos/${electivoId}`, electivoData);
        return response.data;
    } catch (error) {
        // console.error("Error al editar el electivo:", error);
    }
}

export async function deleteElectivo(electivoId) {
    try {
        const response = await axios.delete(`/electivos/${electivoId}`);
        return response.data;
    } catch (error) {
        // console.error("Error al eliminar el electivo:", error);
    }
}
    */



/* export async function getElectivos() {
    try {
        const response = await axios.get('/electivos');
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener electivos:", error);
    }
}

const cambiarEstadoHelper = async (verbo, id) => {
    try {
        const response = await axios.post(`/electivos/${id}/${verbo}`);
        // // console.log(response);
        return {data: response.data, code: response.status || 500};
    } catch (error) {
        console.error("Error al aprobar el electivo: ", error);
        return null;
    }
}

export async function aprobarElectivos(id) {
    return await cambiarEstadoHelper('aprobar', id);
}

export async function rechazarElectivos(id) {
    return await cambiarEstadoHelper('rechazar', id);
}

export async function editElectivo(electivoId, electivoData) { 
    try {
        const response = await axios.patch(`/electivos/${electivoId}`, electivoData);
        return response.data;
    } catch (error) {
        console.error("Error al editar el electivo:", error);
    }
}

export async function deleteElectivo(electivoId) {
    try {
        const response = await axios.delete(`/electivos/${electivoId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el electivo:", error);
    }
}


// import axios from "@services/root.service.js";
/* import axios from "@services/root.service.js";


export async function getElectivos(query = "") {
  try {
    const response = await axios.get(`/electivos${query}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error al obtener electivos:", error);
    throw error;
  }
}

export async function createElectivo(electivoData) {
  try {
    const response = await axios.post("/electivos", electivoData);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al crear electivo:", error);
    throw error;
  }
}

export async function updateElectivo(id, electivoData) {
  try {
    const response = await axios.patch(`/electivos/${id}`, electivoData);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al actualizar electivo:", error);
    throw error;
  }
}


export async function deleteElectivo(id) {
  try {
    const response = await axios.delete(`/electivos/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al eliminar electivo:", error);
    throw error;
  }
}
*/

// import axios from '@services/root.service.js';
/*
export async function getElectivos() {
    try {
        const response = await axios.get('/electivos');
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener electivos:", error);
    }
}

export async function editElectivo(electivoId, electivoData) { 
    try {
        const response = await axios.patch(`/electivos/${electivoId}`, electivoData);
        return response.data;
    } catch (error) {
        console.error("Error al editar el electivo:", error);
    }
}

export async function deleteElectivo(electivoId) {
    try {
        const response = await axios.delete(`/electivos/${electivoId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el electivo:", error);
    }
}
    */


export async function FRONTEND_getElectivoList() {
    const BASE_CASE = [];

    try {
        const response = await axios.get('/electivos/frontend_list');
        // console.log(response);
        const lista = response?.data?.lista;
        if (!Array.isArray(lista)) {
            return BASE_CASE;
        }
        return lista || BASE_CASE;
    } catch (res) {
        return res.status(404).json({message: "Error al conseguir electivos"});
    }
}