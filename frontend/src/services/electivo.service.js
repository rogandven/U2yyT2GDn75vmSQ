import axios from '@services/root.service.js';

const routeHelper = async (URL, body, axiosFunction) => {
  let response = null;
  try {
    response = await axiosFunction(URL, body);
    return {data: response.data?.data, status: response.status, message: response.data?.message};
  } catch (error) {
    // console.log(error);
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

export async function getElectivosProfesor() {
  // console.log("GET ELECTIVOS PROFESOR");
  return await routeHelper("/electivos/electivos_profesor/", null, axios.get);
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


// import axios from '@services/root.service.js';




// import axios from '@services/root.service.js';


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




/*const routeHelper4 = async (URL, body, axiosFunction) => {
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
};*/

export async function getElectivos2() {
  return (await routeHelper("/electivos/get/", null, axios.get))?.data;
}

export async function getElectivoById2(id) {
  return await routeHelper(`/electivos/get/${id}`, null, axios.get);
}

export async function getElectivosSinAprobar2() {
  return await routeHelper(`/electivos/get_private/`, null, axios.get);
}

export async function createElectivoProfesor2(electivoData) {
  return await routeHelper("/electivos", electivoData, axios.post);
}

export async function createElectivoJefeDeCarrera2(electivoData) {
  return await routeHelper("/electivos/private", electivoData, axios.post);
}

export async function approveElectivo2(id) {
  return await routeHelper(`/electivos/private/approve/${id}`, null, axios.post);
}

export async function rejectElectivo2(id) {
  return await routeHelper(`/electivos/private/reject/${id}`, null, axios.post);
}

export async function editElectivo2(id, electivoData) {
  return await routeHelper(`/electivos/${id}`, electivoData, axios.patch);
}

export async function deleteElectivo2(id) {
  return await routeHelper(`/electivos/${id}`, null, axios.delete);
}

export async function FRONTEND_getElectivoList2() {
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
// import axios from '@services/root.service.js';

/*const routeHelper5 = async (URL, body, axiosFunction) => {
  try {
    const response = await axiosFunction(URL, body);
    return {data: response.data?.data, status: response.status, message: response.data?.message};
  } catch (error) {
    console.error(error);
    return error.response?.data || null;
  }
}*/

export async function getElectivos5() {
  return (await routeHelper("/electivos/get/", null, axios.get))?.data;
}

export async function getElectivoById5(id) {
  return await routeHelper(`/electivos/get/${id}`, null, axios.get);
}

export async function getElectivosSinAprobar5() {
  return await routeHelper(`/electivos/get_private`, null, axios.get);
}

export async function createElectivoProfesor5(electivoData) {
  return await routeHelper("/electivos", electivoData, axios.post);
}

export async function createElectivoJefeDeCarrera5(electivoData) {
  return await routeHelper(`/electivos/private`, electivoData, axios.post);
}

export async function approveElectivo5(id) {
  return await routeHelper(`/electivos/private/approve/${id}`, undefined, axios.post);
}

export async function rejectElectivo5(id) {
  return await routeHelper(`/electivos/private/reject/${id}`, undefined, axios.post);
}

export async function editElectivo5(id, electivoData) {
  return await routeHelper(`/electivos/${id}`, electivoData, axios.patch);
}

export async function updateElectivo5(id, electivoData) {
  return await editElectivo(id, electivoData, axios.patch);
}

export async function deleteElectivo5(id) {
  return await routeHelper(`/electivos/${id}`, undefined, axios.delete);
}



// import axios from '@services/root.service.js';


export async function FRONTEND_getElectivoList5() {
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

const routeHelper3 = async (URL, body, axiosFunction) => {
  let response = null;
  try {
    response = await axiosFunction(URL, body);
    return {data: response.data?.data, status: response.status, message: response.data?.message};
  } catch (error) {
    // console.log(error);
    response = error.response;
    if (response.data.message) {
      response.data.message = String(response.data.message).replaceAll("AAAA-MM-DD", "DD-MM-AAAA");
    }
    
    Object.assign(response.data, {status: response.status});
    return response.data || null;
  }
}

export async function getElectivos6() {
  return await routeHelper("/electivos/get/", null, axios.get);
}

export async function getElectivoById6(id) {
  return await routeHelper(`/electivos/get/${id}`, null, axios.get);
}

export async function getElectivosSinAprobar6() {
  return await routeHelper(`/electivos/get_private`, null, axios.get);
}

export async function createElectivoProfesor6(electivoData) {
  return await routeHelper("/electivos", electivoData, axios.post);
}

export async function createElectivoJefeDeCarrera6(electivoData) {
  return await routeHelper(`/electivos/private`, electivoData, axios.post);
}

export async function approveElectivo6(id) {
  if (typeof(id) !== "number") {
    console.error(id);
  }
  return await routeHelper(`/electivos/private/approve/${id}`, undefined, axios.post);
}

export async function rejectElectivo6(id, motivoData) {
  return await routeHelper(`/electivos/private/reject/${id}`, motivoData, undefined, axios.post);
}

export async function editElectivo6(id, electivoData) {
  return await routeHelper(`/electivos/${id}`, electivoData, axios.patch);
}

export async function updateElectivo2(id, electivoData) {
  return await editElectivo(id, electivoData);
}

export async function deleteElectivo6(id) {
  return await routeHelper(`/electivos/${id}`, undefined, axios.delete);
}


// import axios from '@services/root.service.js';




// import axios from '@services/root.service.js';


export async function FRONTEND_getElectivoList6() {
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


const routeHelper2 = async (URL, body, axiosFunction) => {
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

export async function getElectivos3() {
  return (await routeHelper("/electivos/get/", null, axios.get))?.data;
}

export async function getElectivoById3(id) {
  return await routeHelper(`/electivos/get/${id}`, null, axios.get);
}

export async function getElectivosSinAprobar3() {
  return await routeHelper(`/electivos/get_private/`, null, axios.get);
}

export async function createElectivoProfesor3(electivoData) {
  return await routeHelper("/electivos", electivoData, axios.post);
}

export async function createElectivoJefeDeCarrera3(electivoData) {
  return await routeHelper("/electivos/private", electivoData, axios.post);
}

export async function approveElectivo3(id) {
  return await routeHelper(`/electivos/private/approve/${id}`, null, axios.post);
}

export async function rejectElectivo3(id) {
  return await routeHelper(`/electivos/private/reject/${id}`, null, axios.post);
}

export async function editElectivo3(id, electivoData) {
  return await routeHelper(`/electivos/${id}`, electivoData, axios.patch);
}

export async function deleteElectivo3(id) {
  return await routeHelper(`/electivos/${id}`, null, axios.delete);
}

export async function FRONTEND_getElectivoList3() {
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
