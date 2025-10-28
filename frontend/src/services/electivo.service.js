import axios from '@services/root.service.js';

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
        const response = await axios.put(`/electivo/${electivoId}`, electivoData);
        return response.data;
    } catch (error) {
        console.error("Error al editar el electivo:", error);
    }
}

export async function deleteElectivo(electivoId) {
    try {
        const response = await axios.delete(`/electivo/${electivoId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar electivo:", error);
    }
}