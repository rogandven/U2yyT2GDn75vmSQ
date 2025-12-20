import Swal from "sweetalert2";
import { deleteTimetable } from "@services/horario.service.js";

async function confirmDeleteTimetable() {
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
    title: "Horario eliminado",
    text: "El horario ha sido eliminado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar el horario",
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

export const DeleteTimetable = (fetchTimetable) => {
  const handleDeleteTimetable = async (id_horario) => {
    try {
      const isConfirmed = await confirmDeleteTimetable();
      if (isConfirmed) {
        const response = await deleteTimetable(id_horario);
        if (response) {
          confirmAlert();
          await fetchTimetable();
        }
      }
    } catch (error) {
      console.error("Error al eliminar el horario:", error);
      confirmError();
    }
  };

  return { handleDeleteTimetable };
};

export default DeleteTimetable;