
const DeleteInscripcion = (fetchMisInscripciones) => {
  const handleDeleteInscripcion = async (inscripcionId, motivo) => {
    try {
      const response = await fetch(`http://localhost:3000/api/Inscripciones/Eliminar/` + inscripcionId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ motivo: motivo })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (fetchMisInscripciones) {
          await fetchMisInscripciones();
        }
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Error al cancelar la inscripción' };
    }
  };

  return { handleDeleteInscripcion };
};

export default DeleteInscripcion;