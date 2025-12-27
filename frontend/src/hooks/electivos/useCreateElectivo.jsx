import { createElectivoJefeDeCarrera, createElectivoProfesor } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
// import { CAREER_HEAD_ROLE, getAllowedRoles, getUserRole } from "../../services/admin.service.js";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { AREAS_PERMITIDAS_EN_MAYUSCULA } from "../../constants/ElectivoConstants.jsx";
import { createSwalDateField } from "../utils/swalField.jsx";

async function createElectivoInfo() {
  const { value: formValues } = await Swal.fire({
    title: "Crear Electivo",
    html: `
      ${createSwalField(1, "Nombre", "")}
      ${createSwalField(2, "Descripcion", "")}
      ${createSwalField(3, "Cupos", "")}
      ${createSwalField(4, "Créditos Requeridos", "")}
      ${createSwalDateField(5, "Apertura")}
      ${createSwalDateField(6, "Cierre")}
      ${StaticDropdownList(AREAS_PERMITIDAS_EN_MAYUSCULA, "Área", "swal2-input7", "m-1")}
      ${createSwalField(8, "Semestre Mínimo", "")}
      ${createSwalField(9, "Carreras", "")}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    theme: "dark",
    preConfirm: () => {
      const nombre = gebi('swal2-input1')?.value;
      const descripcion = gebi('swal2-input2')?.value;
      const cupos = gebi('swal2-input3')?.value;
      const creditos_requeridos = gebi('swal2-input4')?.value;
      const apertura = gebi('swal2-input5')?.value;
      const cierre = gebi('swal2-input6')?.value;
      const area = String(gebi('swal2-input7')?.value).toUpperCase();
      const semestre_minimo = gebi('swal2-input8')?.value;
      const carreras = gebi('swal2-input9')?.value;

      return {nombre, descripcion, cupos, apertura, cierre, area, semestre_minimo, carreras, creditos_requeridos};
    },
  });
  if (formValues) {
    return formValues;
  }
}

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async (isAdmin, isJefe) => {
    try {
      if (!isAdmin) {
        return fireDynamicSwal(500, null, "Acceso denegado");;
      }

      let response = null;
      const formValues = await createElectivoInfo();
      if (!formValues) return;


      if (isJefe) {
        response = await createElectivoJefeDeCarrera(formValues);
      } else {
        response = await createElectivoProfesor(formValues);
      }
      console.log(response);
      if (response) {
        await fetchElectivos();
        fireDynamicSwal(response?.status, null, (response?.data?.message || response?.data?.details) || (response?.message || response?.details));
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al crear electivo:", error);
    }
  };

  return { handleCreateElectivo };
};

export default useCreateElectivo;
