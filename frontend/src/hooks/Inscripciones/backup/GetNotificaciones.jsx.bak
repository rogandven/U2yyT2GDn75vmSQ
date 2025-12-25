import { API_URL } from "../../config/env.config.js";

const GetNotificaciones = () => {
  
  const fetchNotificaciones = async () => {
    try {
      const response = await fetch(`${API_URL}/api/Inscripciones/notificar`);
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Error al obtener notificaciones' };
    }
  };

  return { fetchNotificaciones };
};

export default GetNotificaciones;