import { API_URL } from "../../config/env.config.js";

const CreateInscripcion = (fetchMisInscripciones) => {
  
  const handleCreateInscripcion = async (electivoId) => {
    try {
      const response = await fetch(`${API_URL}/api/Inscripciones/Crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ electivoId: electivoId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (fetchMisInscripciones) {
          await fetchMisInscripciones();
        }
        return { success: true, data: data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Error al crear la inscripción' };
    }
  };

  return { handleCreateInscripcion };
};

export default CreateInscripcion;