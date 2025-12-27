import Swal from "sweetalert2";
import { deleteUser } from "@services/user.service";
import { fireDynamicSwal } from "../utils/dynamicSwal";

async function confirmDeleteUser() {
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
    title: "Usuario eliminado",
    text: "El usuario ha sido eliminado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
    theme: "dark",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar el usuario",
    icon: "error",
    confirmButtonText: "Aceptar",
    theme: "dark",
  });
}

export const useDeleteUser = (fetchUsers) => {
  const handleDeleteUser = async (userId) => {
    try {
      const isConfirmed = await confirmDeleteUser();
      if (isConfirmed) {
        const response = await deleteUser(userId);
        if (response) {
          fireDynamicSwal(response.status, null, response.data.details || response.data.message);
          await fetchUsers();
        }
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      confirmError();
    }
  };

  return { handleDeleteUser };
};

export default useDeleteUser;
