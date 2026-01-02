import Swal from "sweetalert2";
import { deleteCarrera } from "@services/carrera.service.js";

async function confirmDeleteCarrera() {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    theme: "dark",
  });
  return result.isConfirmed;
}

async function confirmAlert() {
  await Swal.fire({
    title: "Carrera eliminada",
    text: "La Carrera ha sido eliminado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
    theme: "dark",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar la carrera",
    icon: "error",
    confirmButtonText: "Aceptar",
    theme: "dark",
  });
}

export const DeleteCarrera = (fetchCarrera) => {
  const handleDeleteCarrera = async (id_carrera) => {
    try {
      const isConfirmed = await confirmDeleteCarrera();
      if (isConfirmed) {
        const response = await deleteCarrera(id_carrera);
        if (response) {
          confirmAlert();
          await fetchCarrera();
        }
      }
    } catch (error) {
      console.error("Error al eliminar la Carrera:", error);
      confirmError();
    }
  };

  return { handleDeleteCarrera };
};

export default DeleteCarrera;