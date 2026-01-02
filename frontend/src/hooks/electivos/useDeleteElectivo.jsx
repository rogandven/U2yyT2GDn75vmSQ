import Swal from "sweetalert2";
import { deleteElectivo } from "@services/electivo.service";
import { fireDynamicSwal } from "../utils/dynamicSwal";

async function confirmDeleteElectivo() {
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
    title: "Electivo eliminado",
    text: "El electivo ha sido eliminado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
    theme: "dark",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar el electivo",
    icon: "error",
    confirmButtonText: "Aceptar",
    theme: "dark",
  });
}

export const useDeleteElectivo = (fetchElectivos) => {
  const handleDeleteElectivo = async (electivoId, isAdmin) => {
    if (!isAdmin) {
      return fireDynamicSwal(500, null, "Acceso denegado");
    }
    let response = null;
    let data = null;
    try {
      
      const isConfirmed = await confirmDeleteElectivo();
      if (isConfirmed) {
        response = await deleteElectivo(electivoId);
      } else {
        return;
      }
    } catch (error) {
      response = error?.response;
    }
    data = response?.data;
    if (data && response) {
      Object.assign(data, {status: response?.status});
    }
    fetchElectivos(); 
    fireDynamicSwal(response?.status, null, response?.message || response?.details);
  };

  return { handleDeleteElectivo };
};

export default useDeleteElectivo;
