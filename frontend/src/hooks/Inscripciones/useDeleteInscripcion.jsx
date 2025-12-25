import Swal from "sweetalert2";
import { DeleteInscripcion } from "@services/Inscripcion.service.js";
export const useDeleteInscripcion = (fetchMisInscripciones) => {
const handleDeleteInscripcion = async (inscripcionId) => {
const confirm = await Swal.fire({
  title: "Eliminar inscripcion",
  text:"¿Esta seguro de eliminar la inscripcion?",
  showCancelButton: true,
  confirmButtonText: "Eliminar",
  confirmButton: true,
  confirmButtonColor:"#008000",
  cancelButtonText:"Cancelar",
  cancelButtonColor:"#e74c3c",
  focusConfirm: false,
});
if (confirm.isConfirmed) {
      try {
        await DeleteInscripcion(inscripcionId);
        await Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La Inscripcion fue eliminada correctamente.",
          confirmButtonColor: "#4CAF50",
        });
        await fetchMisInscripciones(); 
      } catch (error) {
        console.error("Error al eliminar la inscripcion:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el electivo. Intenta nuevamente.",
          confirmButtonColor: "#e74c3c",
        });
      }
    }
  };

  return { handleDeleteInscripcion };
};

export default useDeleteInscripcion;