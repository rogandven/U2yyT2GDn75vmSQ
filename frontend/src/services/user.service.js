import axios from '@services/root.service.js';


export async function createUser(userData) { 
    try {
        const response = await axios.post(`/users/`, userData);
        Object.assign(response.data, {status: response.status});
        return response.data;
    } catch (error) {
        console.error("Error al editar usuario:", error);
        if (error.response?.data) {
            Object.assign(error.response.data, {status: 500});
            return error.response.data;
        }
        return {message: "Error desconocido", status: 500};
    }
}

export async function getUsers() {
    try {
        const response = await axios.get('/users/get');
        return response.data?.data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
}

export async function editUser(userId, userData) { 
    try {
        const response = await axios.patch(`/users/${userId}`, userData);
        Object.assign(response.data, {status: response.status});
        return response.data;
    } catch (error) {
        console.error("Error al editar usuario:", error);
        if (error.response?.data) {
            Object.assign(error.response.data, {status: 500});
            return error.response.data;
        }
        return {message: "Error desconocido", status: 500};
    }
}

export async function deleteUser(userId) {
    try {
        const response = await axios.delete(`/users/${userId}`);
        Object.assign(response.data, {status: response.status});
        return response.data;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return error.response || {status: 500, message: "Error desconocido"};
    }
}

export async function getProfile() { 
    try {
        const response = await axios.get('/users/profile');
        // console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        return null;
    }
}

export async function FRONTEND_getUserList() {
    const BASE_CASE = [];

    try {
        const response = await axios.get('/users/frontend_list');
        // console.log(response);
        const lista = response?.data?.lista;
        if (!Array.isArray(lista)) {
            return BASE_CASE;
        }
        return lista || BASE_CASE;
    } catch (error) {
        return BASE_CASE;
    }
}