import { createElectivoJefeDeCarrera, createElectivoProfesor } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { CAREER_HEAD_ROLE, getAllowedRoles, getUserRole } from "../../services/admin.service.js";

async function createElectivoInfo() {
  const { value: formValues } = await Swal.fire({
    title: "Crear Usuario",
    html: `
      ${createSwalField(1, "Nombre", "")}
      ${createSwalField(2, "Descripcion", "")}
      ${createSwalField(3, "Cupos", "")}
      ${createSwalField(4, "Apertura", "")}
      ${createSwalField(5, "Cierre", "")}
      ${createSwalField(6, "Área", "")}
      ${createSwalField(7, "Semestre Mínimo", "")}
      ${createSwalField(8, "Carreras", "")}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const nombre = gebi('swal2-input1')?.value;
      const descripcion = gebi('swal2-input2')?.value;
      const cupos = gebi('swal2-input3')?.value;
      const apertura = gebi('swal2-input4')?.value;
      const cierre = gebi('swal2-input5')?.value;
      const area = gebi('swal2-input6')?.value;
      const semestre_minimo = gebi('swal2-input7')?.value;
      const carreras = gebi('swal2-input8')?.value;

      return {nombre, descripcion, cupos, apertura, cierre, area, semestre_minimo, carreras};
    },
    theme: "dark",
  });
  if (formValues) {
    return formValues;
  }
}

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async (electivo) => {
    try {
      let response = null;
      const formValues = await createElectivoInfo(electivo);
      if (!formValues) return;

      const userRole = getUserRole();
      console.log(userRole);
      if (userRole === CAREER_HEAD_ROLE) {
        response = await createElectivoJefeDeCarrera(formValues);
      } else if (getAllowedRoles().includes(userRole)) {
        response = await createElectivoProfesor(formValues);
      } else {
        fireDynamicSwal(401, "Error", "Acceso denegado");
        return;
      }
      
      console.log(response);
      if (response) {
        await fetchElectivos();
        fireDynamicSwal(response.status, response.message === response.details ? null : response.message, response.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al crear electivo:", error);
    }
  };

  return { handleCreateElectivo };
};

export default useCreateElectivo;
