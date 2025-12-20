import axios from '@services/root.service.js';

export const getTimetables = async () => {
    try {
        const response = await axios.get('/horarios');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los horarios:', error);
        throw error;
    }
};

export const assignTimetable = async (horarioData) => {
    try {
        const idElectivo = horarioData.id_electivo;
        delete horarioData.id_electivo;
        const response = await axios.post('/horarios/asignar/' + String(idElectivo), horarioData);
        return response.data;
    } catch (error) {
        console.error('Error al asignar el horario:', error);
        throw error;
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
