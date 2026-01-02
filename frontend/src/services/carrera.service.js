import axios from '@services/root.service.js';

export const getCarreras = async () => {
    try {
        const response = await axios.get('/carreras');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las carreras:', error);
        throw error;
    }
};

export async function createCarrera  (carreraData) {
    try {
        const response = await axios.post('/carreras/crear', carreraData);
        return response.data;
    } catch (error) {
        console.error('Error al crear la carrera:', error);
        throw error;
    }
};

export const updateCarrera = async (id_carrera, updateData) => {

    if (!id_carrera) {
        throw new Error("ID de carrera es requerido");
    }

    try {
        const response = await axios.patch(`carreras/${id_carrera}`, {
            id_carrera: updateData.id_carrera,
            sigla: updateData.sigla,
            nombre: updateData.nombre
        });
        console.log("Respuesta del servidor:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error al actualizar carrera service:", error);
        throw error.response?.data || error;
    }
}

export const deleteCarrera = async (id_carrera) => {
    try {
        const response = await axios.delete(`/carreras/${id_carrera}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la carreras:', error);
        throw error;
    }
};