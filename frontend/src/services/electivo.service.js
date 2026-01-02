/*
import axios from '@services/root.service.js';

const routeHelper = async (URL, body, axiosFunction) => {
  try {
    const response = await axiosFunction(URL, body);
    return {data: response.data?.data, status: response.status, message: response.data?.message};
  } catch (error) {
    console.error(error);
    return error.response?.data || null;
  }
}

export async function getElectivos() {
  return (await routeHelper("/electivos/get/", null, axios.get))?.data;
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

export async function approveElectivo(id) {
  return await routeHelper(`/electivos/private/approve/${id}`, undefined, axios.post);
}

export async function rejectElectivo(id) {
  return await routeHelper(`/electivos/private/reject/${id}`, undefined, axios.post);
}

export async function editElectivo(id, electivoData) {
  return await routeHelper(`/electivos/${id}`, electivoData, axios.patch);
}

export async function updateElectivo(id, electivoData) {
  return await editElectivo(id, electivoData, axios.patch);
}

export async function deleteElectivo(id) {
  return await routeHelper(`/electivos/${id}`, undefined, axios.delete);
}


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
}*/

/*
import axios from '@services/root.service.js';


const routeHelper = async (URL, body, axiosFunction) => {
  try {
    const token = sessionStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response =
      axiosFunction === axios.get || axiosFunction === axios.delete
        ? await axiosFunction(URL, config)
        : await axiosFunction(URL, body, config);

    return {
      data: response.data?.data,
      status: response.status,
      message: response.data?.message,
    };
  } catch (error) {
    console.error(error);
    return error.response?.data || null;
  }
};


export async function getElectivos() {
  return (await routeHelper("/electivos/get/", null, axios.get))?.data;
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


export async function approveElectivo(id) {
  return await routeHelper(
    `/electivos/private/approve/${id}`,
    undefined,
    axios.post
  );
}

export async function rejectElectivo(id) {
  return await routeHelper(
    `/electivos/private/reject/${id}`,
    undefined,
    axios.post
  );
}


export async function editElectivo(id, electivoData) {
  return await routeHelper(`/electivos/${id}`, electivoData, axios.patch);
}


export async function updateElectivo(id, electivoData) {
  return await routeHelper(`/electivos/${id}`, electivoData, axios.patch);
}



export async function deleteElectivo(id) {
  return await routeHelper(`/electivos/${id}`, undefined, axios.delete);
}



export async function FRONTEND_getElectivoList() {
  const BASE_CASE = [];

  try {
    const response = await axios.get('/electivos/frontend_list');
    const lista = response?.data?.lista;

    if (!Array.isArray(lista)) {
      return BASE_CASE;
    }

    return lista;
  } catch (error) {
    console.log("Error al obtener electivos: ", error);
    return BASE_CASE;
  }
}
*/

import axios from '@services/root.service.js';

const routeHelper = async (URL, body, axiosFunction) => {
  try {
    let response;

    // axios.get y axios.delete NO reciben body
    if (axiosFunction === axios.get || axiosFunction === axios.delete) {
      response = await axiosFunction(URL);
    } else {
      response = await axiosFunction(URL, body);
    }

    return {
      data: response.data?.data,
      status: response.status,
      message: response.data?.message,
    };
  } catch (error) {
    console.error(error);
    return error.response?.data || null;
  }
};

export async function getElectivos() {
  return (await routeHelper("/electivos/get/", null, axios.get))?.data;
}

export async function getElectivoById(id) {
  return await routeHelper(`/electivos/get/${id}`, null, axios.get);
}

export async function getElectivosSinAprobar() {
  return await routeHelper(`/electivos/get_private/`, null, axios.get);
}

export async function createElectivoProfesor(electivoData) {
  return await routeHelper("/electivos", electivoData, axios.post);
}

export async function createElectivoJefeDeCarrera(electivoData) {
  return await routeHelper("/electivos/private", electivoData, axios.post);
}

export async function approveElectivo(id) {
  return await routeHelper(`/electivos/private/approve/${id}`, null, axios.post);
}

export async function rejectElectivo(id) {
  return await routeHelper(`/electivos/private/reject/${id}`, null, axios.post);
}

export async function editElectivo(id, electivoData) {
  return await routeHelper(`/electivos/${id}`, electivoData, axios.patch);
}

export async function deleteElectivo(id) {
  return await routeHelper(`/electivos/${id}`, null, axios.delete);
}

export async function FRONTEND_getElectivoList() {
  const BASE_CASE = [];
  try {
    const response = await axios.get('/electivos/frontend_list/');
    const lista = response?.data?.lista;
    if (!Array.isArray(lista)) return BASE_CASE;
    return lista;
  } catch {
    return BASE_CASE;
  }
}
