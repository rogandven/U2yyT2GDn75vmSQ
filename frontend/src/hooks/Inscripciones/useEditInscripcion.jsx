import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { private_updateInscripcion, public_updateInscripcion } from "../../services/inscripcion.service.js";
// import { isAdminOrProfesor } from "../../services/admin.service.js";
import { StaticDropdownList } from "../utils/DropdownList.jsx";

const getSelectedNameElectivo = (inscripcion, electivoNames) => {
  try {
    for (let i = 0; i < electivoNames.length; i++) {
      if (inscripcion.id_electivo === String(electivoNames[i]).split(".")[0]) {
        return electivoNames[i];
      }
    }
  } catch (error) {
    return "";
  }
}

const getSelectedNameUsuario = (inscripcion, userNames) => {
  try {
    for (let i = 0; i < userNames.length; i++) {
      if (inscripcion.id_usuario === String(userNames[i]).split(".")[0]) {
        return userNames[i];
      }
    }
  } catch (error) {
    return "";
  }
}

async function editInscripcionInfo_PRIVATE(inscripcion, electivoNames, userNames) {
 const { value: formValues } = await Swal.fire({
    title: "Editar Inscripción",
    html: `
      ${StaticDropdownList(userNames, getSelectedNameUsuario(inscripcion, userNames), "swal2-input1", "mb-1", false)}
      ${StaticDropdownList(electivoNames, getSelectedNameElectivo(inscripcion, electivoNames), "swal2-input2", "mb-1", false)}
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

async function editInscripcionInfo_PUBLIC(inscripcion, electivoNames) {
 const { value: formValues } = await Swal.fire({
    title: "Editar Inscripción",
    html: `
      ${StaticDropdownList(electivoNames, getSelectedNameElectivo(inscripcion, electivoNames), "swal2-input2", "mb-1", false)}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const id_electivo = String(gebi('swal2-input2')?.value).split(".")[0];

      return {id_electivo};
    },
    theme: "dark",
  });
  if (formValues) {
    return formValues;
  }
}

export const useEditInscripcion = (fetchInscripciones) => {
  const handleEditInscripcion = async (inscripcionId, inscripcion, electivoNames, userNames, canModerateInscriptions) => {
    try {
      let response = null;
      let formValues = null;
      if (isAdmin) {
        formValues = await editInscripcionInfo_PRIVATE(inscripcion, electivoNames, userNames);
        if (!formValues) return;
        response = await private_updateInscripcion(inscripcionId, formValues);
      } else {
        formValues = await editInscripcionInfo_PUBLIC(inscripcion, electivoNames);
        if (!formValues) return;
        response = await public_updateInscripcion(inscripcionId, formValues);
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
      // console.error("Error al editar inscripcion:", error);
    }
  };

  return { handleEditInscripcion };
};

export default useEditInscripcion;
