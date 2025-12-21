import axios from './root.service.js';

export const getMensajes = async (userId) => {
  try {
    const response = await axios.get(`/chat/mensajes?userId=${userId}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener mensajes'
    };
  }
};

export const marcarMensajesLeidos = async (userId) => {
  try {
    await axios.patch('/chat/mensajes/leidos', { userId });
    return { success: true };
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return { success: false };
  }
};
