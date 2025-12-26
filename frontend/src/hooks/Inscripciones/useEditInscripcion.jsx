import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { private_updateInscripcion, public_updateInscripcion } from "../../services/inscripcion.service.js";
import { isAdminOrProfesor } from "../../services/admin.service.js";

async function editInscripcionInfo(inscripcion) {
 const { value: formValues } = await Swal.fire({
    title: "Crear Usuario",
    html: `
      ${createSwalField(1, "Usuario", inscripcion.id_usuario)}
      ${createSwalField(2, "Inscripcion", inscripcion.id_electivo)}
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

export const useEditInscripcion = (fetchInscripciones) => {
  const handleEditInscripcion = async (electivoId, electivo) => {
    try {
      let response = null;
      const formValues = await editInscripcionInfo(electivo);
      if (!formValues) return;
      if (isAdminOrProfesor()) {
        response = await private_updateInscripcion(electivoId, formValues);
      } else {
        response = await public_updateInscripcion(electivoId, formValues);
      }
      if (response) {
        console.log(response);
        if (response.data) {
          Object.assign(response, response.data);
        }
        await fetchInscripciones();
        fireDynamicSwal(response.status, response.message === response.details ? null : response.message, response.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al editar electivo:", error);
    }
  };

  return { handleEditInscripcion };
};

export default useEditInscripcion;
