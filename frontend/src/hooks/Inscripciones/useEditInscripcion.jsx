import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { private_updateInscripcion, public_updateInscripcion } from "../../services/inscripcion.service.js";
import { isAdminOrProfesor } from "../../services/admin.service.js";
import { StaticDropdownList } from "../utils/DropdownList.jsx";

async function editInscripcionInfo(inscripcion, electivoNames, userNames) {
 const { value: formValues } = await Swal.fire({
    title: "Crear Usuario",
    html: `
      ${StaticDropdownList(userNames, "Usuario", "swal2-input1", "mb-1")}
      ${StaticDropdownList(electivoNames, "Electivo", "swal2-input2", "mb-1")}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const id_usuario = String(gebi('swal2-input1')?.value).split(".")[0];
      const id_electivo = String(gebi('swal2-input2')?.value).split(".")[0];

      return {id_electivo, id_usuario};
    },
    theme: "dark",
  });
  if (formValues) {
    return formValues;
  }
}

export const useEditInscripcion = (fetchInscripciones) => {
  const handleEditInscripcion = async (electivoId, electivo, electivoNames, userNames) => {
    try {
      let response = null;
      const formValues = await editInscripcionInfo(electivo, electivoNames, userNames);
      if (!formValues) return;
      if (isAdminOrProfesor()) {
        response = await private_updateInscripcion(electivoId, formValues);
      } else {
        response = await public_updateInscripcion(electivoId, formValues);
      }
      if (response) {
        // console.log(response);
        if (response.data) {
          Object.assign(response, response.data);
        }
        await fetchInscripciones();
        fireDynamicSwal(response?.status, null, response?.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al editar electivo:", error);
    }
  };

  return { handleEditInscripcion };
};

export default useEditInscripcion;
