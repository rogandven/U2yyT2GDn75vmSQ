import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { CAREER_HEAD_ROLE, isAdminOrProfesor } from "../../services/admin.service.js";
import { private_createInscripcion, public_createInscripcion, shallDisplayWarning } from "../../services/inscripcion.service.js";
import { StaticDropdownList } from "../utils/DropdownList.jsx";

async function createInscripcionInfo(electivoNames, userNames) {
  const { value: formValues } = await Swal.fire({
    title: "Crear Inscripcion",
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

export const useCreateInscripcion = (fetchInscripciones) => {
  const handleCreateInscripcion = async (electivoNames, userNames) => {
    try {
      let response = null;
      const formValues = await createInscripcionInfo(electivoNames, userNames);
      if (!formValues) return;

      response = await private_createInscripcion(formValues);
      // console.log("LA RESPUESTA: ");
      // console.log(response);
      if (response) {
        await fetchInscripciones();
        fireDynamicSwal(response?.status, null, response?.data?.message || response?.data?.details);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al crear inscripción:", error);
    }
  };

  return { handleCreateInscripcion };
};

export const useCreateInscripcion_PUBLIC = () => {
  const handleCreateInscripcion_PUBLIC = async (id_electivo, isAdmin) => {
    if (isAdmin) {
      return fireDynamicSwal(500, null, "Acceso denegado");
    }
    if (await shallDisplayWarning()) {
      const shallReturn = await Swal.fire({
        showCancelButton: true,
        title: "Advertencia",
        text: "Existe una alta posibilidad que su inscripción sea rechazada. ¿Está seguro que desea continuar?",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        icon: "warning",
        theme: "dark",
      });
      if (!shallReturn.isConfirmed) {
        return;
      }
    }
    try {
      const response = await public_createInscripcion({id_electivo: id_electivo});
      if (response) {
        fireDynamicSwal(response?.status, null, response?.data?.message || response?.data?.details);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al crear inscripción:", error);
    }
  } 

  return { handleCreateInscripcion_PUBLIC };
}

export default useCreateInscripcion;
