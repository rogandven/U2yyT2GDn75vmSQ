import Swal from "sweetalert2";
import { private_deleteInscripcion } from "../../services/inscripcion.service.js";
import { public_deleteInscripcion } from "../../services/inscripcion.service.js";
import { isAdminOrProfesor } from "../../services/admin.service";
import { fireDynamicSwal } from "../utils/dynamicSwal";

async function confirmDeleteInscripcion() {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  return result.isConfirmed;
}

async function confirmAlert() {
  await Swal.fire({
    title: "Inscripción eliminada",
    text: "La inscripción ha sido eliminado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar el inscripcion",
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

export const useDeleteInscripcion = (fetchInscripciones) => {
  const handleDeleteInscripcion = async (inscripcionId) => {
    try {
      let response = null;
      const isConfirmed = await confirmDeleteInscripcion();
      if (isConfirmed) {
        if (isAdminOrProfesor()) {
          response = await private_deleteInscripcion(inscripcionId);
        } else {
          response = await public_deleteInscripcion(inscripcionId);
        }
        if (response) {
          if (response.data) {
            Object.assign(response, response.data);
          }
          fireDynamicSwal(response.status, response.message, response.message);
          // confirmAlert();
          await fetchInscripciones();
        }
      }
    } catch (error) {
      console.error("Error al eliminar inscripcion:", error);
      confirmError();
    }
  };

  return { handleDeleteInscripcion };
};

export default useDeleteInscripcion;
