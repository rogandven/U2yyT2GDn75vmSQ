import axios from '@services/root.service.js';

export const getTimetables = async () => {
    try {
        const response = await axios.get('/horarios');
        return response.data;
    } catch (error) {
        // console.error('Error al obtener los horarios:', error);
        throw error;
    }
};

/*export async function getHorariosByIdElectivo(id) {
  try{
    const response = await axios.get(`/horarios/${id}`);
    return response.data;
  }catch(error){
    console.error('Error al obtener los horarios:', error);
        throw error;
  }
}*/

export const assignTimetable = async (horarioData) => {
    try {
        // console.log(horarioData);
        const idElectivo = horarioData.id_electivo;
        delete horarioData.id_electivo;
        const response = await axios.post('/horarios/asignar/' + String(idElectivo), horarioData);
        const status = {status: response?.status || 500};
        try {
            Object.assign(response.data, status);
        } catch (error) {
            
        }
        return response.data;
    } catch (error) {
        // console.error('Error al asignar el horario:', error);
        return error.response || {message: "Error desconocido", status: 500};
    }
};


export const updateTimetable = async (id_horario, updatedData) => {
    let response = null;
    try {
        delete updatedData.id_horario;
        // // console.log("¿Qué se va a actualizar?");
        // // console.log(updatedData);
        response = await axios.patch(`/horarios/${id_horario}`, updatedData);
        const status = {status: response?.status || 500};
        Object.assign(response.data, status)
        return response.data;
    } catch (error) {
        response = error?.response || {message: "Error desconocido", status: 500};
        const status = {status: response?.status || 500};
        Object.assign(response.data || response, status);
        // console.error('Error al actualizar el horario:', error);
        return response.data || response;
    }
};

export const deleteTimetable = async (id_horario) => {
    try {
        const response = await axios.delete(`/horarios/${id_horario}`);
        return response.data;
    } catch (error) {
        // console.error('Error al eliminar el horario:', error);
        throw error;
    }
}
