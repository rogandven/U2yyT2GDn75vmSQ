import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { CAREER_HEAD_ROLE, isAdminOrProfesor } from "../../services/admin.service.js";
import { private_createInscripcion } from "../../services/inscripcion.service.js";

async function createInscripcionInfo() {
  const { value: formValues } = await Swal.fire({
    title: "Crear Usuario",
    html: `
      ${createSwalField(1, "Usuario", "")}
      ${createSwalField(2, "Electivo", "")}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const id_usuario = gebi('swal2-input1')?.value;
      const id_electivo = gebi('swal2-input2')?.value;

      return {id_electivo, id_usuario};
    },
    theme: "dark",
  });
  if (formValues) {
    return formValues;
  }
}

export const useCreateInscripcion = (fetchInscripciones) => {
  const handleCreateInscripcion = async () => {
    try {
      let response = null;
      if (!isAdminOrProfesor()) {
        fireDynamicSwal(401, "Error", "Acceso denegado");
      }
      const formValues = await createInscripcionInfo();
      if (!formValues) return;

      response = await private_createInscripcion(formValues);
      console.log("LA RESPUESTA: ");
      console.log(response);
      if (response) {
        await fetchInscripciones();
        fireDynamicSwal(response.status, response.data?.message === response.data?.details ? null : response.data?.message, response.data?.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al crear inscripción:", error);
    }
  };

  return { handleCreateInscripcion };
};

export default useCreateInscripcion;
