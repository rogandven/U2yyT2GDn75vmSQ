import axios from '@services/root.service.js';

export const getTimetables = async () => {
    try {
        const response = await axios.get('/api/horarios');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los horarios:', error);
        throw error;
    }
};

export const assignTimetable = async (horarioData) => {
    try {
        const response = await axios.post('/api/horarios/asignar', horarioData);
        return response.data;
    } catch (error) {
        console.error('Error al asignar el horario:', error);
        throw error;
    }
};


export const updateTimetable = async (id_horario, updatedData) => {
    try {
        const response = await axios.put(`/api/horarios/${id_horario}`, updatedData);
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
        const response = await axios.delete(`/api/horarios/${id_horario}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el horario:', error);
        throw error;
    }
};
