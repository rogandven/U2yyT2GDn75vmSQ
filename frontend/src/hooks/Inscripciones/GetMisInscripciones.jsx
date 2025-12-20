
const GetMisInscripciones = () => {
  
  const fetchMisInscripciones = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/Inscripciones/Obtener`);
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Error al cargar las inscripciones' };
    }
  };

  return { fetchMisInscripciones };
};

export default GetMisInscripciones;