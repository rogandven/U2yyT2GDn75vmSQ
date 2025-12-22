import axios from '@services/root.service.js';

export const getTimetables = async () => {
    try {
        console.log(axios.defaults.baseURL);
        const response = await axios.get('/horarios');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los horarios:', error);
        throw error;
    }
};

const parseResponseCode = (error) => {
    const DEFAULT_RESPONSE = 500;

    if (error && error.response && error.response.status) {
        if (isNaN(error.response.status)) {
            return DEFAULT_RESPONSE;
        }
        return error.response.status;
    }
    return DEFAULT_RESPONSE;
};

const parseErrorData = (error) => {
    if (!error) {
        return null;
    }
    if (!(error.response)) {
        return null;
    }
    if (!(error.response.data)) {
        return null;
    }
    return error.response.data;
}

export const assignTimetable = async (horarioData) => {
    try {
        const idElectivo = horarioData.id_electivo;
        delete horarioData.id_electivo;
        const response = await axios.post('/horarios/asignar/' + String(idElectivo), horarioData);
        return {data: response.data, error: null, status: response.status};
    } catch (error) {
        console.error('Error al asignar el horario:', error);
        return {data: parseErrorData(error), error: error, status: parseResponseCode(error)}
    }
};


export const updateTimetable = async (id_horario, updatedData) => {
    try {
        delete updatedData.id_horario;
        // console.log("¿Qué se va a actualizar?");
        // console.log(updatedData);
        const response = await axios.patch(`/horarios/${id_horario}`, updatedData);
        return response.data;
    } catch (error) {
        // console.log(JSON.stringify(error));
        // console.log(JSON.stringify(updatedData));
        console.error('Error al actualizar el horario:', error);
        throw error;
    }
};

export const deleteTimetable = async (id_horario) => {
    try {
        const response = await axios.delete(`/horarios/${id_horario}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el horario:', error);
        throw error;
    }
};
