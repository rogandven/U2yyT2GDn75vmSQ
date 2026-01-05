/*
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
      ${createSwalDateField(5, "Apertura", null)}
      ${createSwalDateField(6, "Cierre", null)}
      ${StaticDropdownList(AREAS_PERMITIDAS_EN_MAYUSCULA, "Área", "swal2-input7", "m-1", true)}
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
        return fireDynamicSwal(500, null, "Acceso denegado");
      }

      let response = null;
      const formValues = await createElectivoInfo();
      if (!formValues) return;


      if (isJefe) {
        response = await createElectivoJefeDeCarrera(formValues);
      } else {
        response = await createElectivoProfesor(formValues);
      }
      // console.log(response);
      if (response) {
        await fetchElectivos();
        fireDynamicSwal(response?.status, null, (response?.data?.message || response?.data?.details) || (response?.message || response?.details));
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      // console.error("Error al crear electivo:", error);
    }
  };

  return { handleCreateElectivo };
};

export default useCreateElectivo;
//esto fue lo que funcionaba anteriormente
*/

/*
//nu
import { createElectivoJefeDeCarrera, createElectivoProfesor } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField, createSwalDateField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { AREAS_PERMITIDAS_EN_MAYUSCULA } from "../../constants/ElectivoConstants.jsx";
import { CAREER_HEAD_ROLE, getAllowedRoles, getUserRole } from "../../services/admin.service.js";

async function createElectivoInfo() {
  const { value } = await Swal.fire({
    title: "Crear Electivo",
    html: `
      ${createSwalField(1, "Nombre")}
      ${createSwalField(2, "Descripción")}
      ${createSwalField(3, "Cupos")}
      ${createSwalDateField(4, "Apertura")}
      ${createSwalDateField(5, "Cierre")}
      ${StaticDropdownList(AREAS_PERMITIDAS_EN_MAYUSCULA, "Área", "swal2-input6", "m-1")}
      ${createSwalField(7, "Semestre Mínimo")}
      ${createSwalField(8, "Carreras")}
    `,
    showCancelButton: true,
    confirmButtonText: "Crear",
    theme: "dark",
    preConfirm: () => ({
      nombre: gebi("swal2-input1")?.value,
      descripcion: gebi("swal2-input2")?.value,
      cupos: Number(gebi("swal2-input3")?.value),
      apertura: gebi("swal2-input4")?.value,
      cierre: gebi("swal2-input5")?.value,
      area: String(gebi("swal2-input6")?.value).toUpperCase(),
      semestre_minimo: gebi("swal2-input7")?.value,
      carreras: gebi("swal2-input8")?.value,
    }),
  });

  return value;
}

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async () => {
    try {
      const formValues = await createElectivoInfo();
      if (!formValues) return;

      const role = getUserRole();
      let response = null;

      if (role === CAREER_HEAD_ROLE) {
        response = await createElectivoJefeDeCarrera(formValues);
      } else if (getAllowedRoles().includes(role)) {
        response = await createElectivoProfesor(formValues);
      } else {
        return fireDynamicSwal(403, "Error", "Acceso denegado");
      }

      await fetchElectivos();
      fireDynamicSwal(response?.status, null, response?.data?.message);
    } catch (error) {
      console.error(error);
      fireDynamicSwal(500, null, "Error al crear electivo");
    }
  };

  return { handleCreateElectivo };
};*/

//nunu
import { createElectivoJefeDeCarrera, createElectivoProfesor } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField, createSwalDateField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { AREAS_PERMITIDAS_EN_MAYUSCULA } from "../../constants/ElectivoConstants.jsx";
import { CARRERAS_PERMITIDAS } from "../../constants/CareerConstants.jsx";
import { CAREER_HEAD_ROLE, getAllowedRoles, getUserRole } from "../../services/admin.service.js";
import { TEACHER_ROLE } from "../../constants/PermissionsConstants.jsx";

async function createElectivoInfo(carreraNames) {
  const { value } = await Swal.fire({
    title: "Crear Electivo",
    html: `
      ${createSwalField(1, "Nombre")}
      ${createSwalField(2, "Descripción")}
      ${createSwalField(3, "Cupos")}
      ${createSwalField(4, "Créditos Requeridos")}
      ${createSwalField(5, "Semestre Mínimo")}
      ${createSwalDateField(6, "Apertura")}
      ${createSwalDateField(7, "Cierre")}
      ${StaticDropdownList(AREAS_PERMITIDAS_EN_MAYUSCULA, "Área", "swal2-input8", "m-1")}
      ${StaticDropdownList(carreraNames, "Carrera", "swal2-input9", "m-1")}
    `,
    showCancelButton: true,
    confirmButtonText: "Crear",
    theme: "dark",
    preConfirm: () => ({
      nombre: gebi("swal2-input1")?.value,
      descripcion: gebi("swal2-input2")?.value,
      cupos: Number(gebi("swal2-input3")?.value),
      creditos_requeridos: Number(gebi("swal2-input4")?.value),
      semestre_minimo: gebi("swal2-input5")?.value,
      apertura: gebi("swal2-input6")?.value,
      cierre: gebi("swal2-input7")?.value,
      area: gebi("swal2-input8")?.value,
      carreraIdCarrera: Number(String(gebi("swal2-input9")?.value).split(".")[0]),
    }),
  });

  return value;
}

async function createElectivoInfoProfesor() {
  const { value } = await Swal.fire({
    title: "Crear Electivo",
    html: `
      ${createSwalField(1, "Nombre")}
      ${createSwalField(2, "Descripción")}
      ${createSwalField(3, "Cupos")}
      ${createSwalField(4, "Créditos Requeridos")}
      ${createSwalField(5, "Semestre Mínimo")}
      ${createSwalDateField(6, "Apertura")}
      ${createSwalDateField(7, "Cierre")}
      ${StaticDropdownList(AREAS_PERMITIDAS_EN_MAYUSCULA, "Área", "swal2-input8", "m-1")}
    `,
    showCancelButton: true,
    confirmButtonText: "Crear",
    theme: "dark",
    preConfirm: () => ({
      nombre: gebi("swal2-input1")?.value,
      descripcion: gebi("swal2-input2")?.value,
      cupos: Number(gebi("swal2-input3")?.value),
      creditos_requeridos: Number(gebi("swal2-input4")?.value),
      semestre_minimo: gebi("swal2-input5")?.value,
      apertura: gebi("swal2-input6")?.value,
      cierre: gebi("swal2-input7")?.value,
      area: gebi("swal2-input8")?.value,
    }),
  });

  return value;
}

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async (isAdmin, isJefe, carreraNames) => {
    try {
      let formValues = null;
      const role = getUserRole();
      if (role === TEACHER_ROLE) {
        formValues = await createElectivoInfoProfesor(carreraNames);
      } else {
        formValues = await createElectivoInfo(carreraNames);
      }
      if (!formValues) return;

      
      let response = null;

      if (role === CAREER_HEAD_ROLE) {
        response = await createElectivoJefeDeCarrera(formValues);
      } else if (getAllowedRoles().includes(role)) {
        response = await createElectivoProfesor(formValues);
      } else {
        return fireDynamicSwal(403, "Error", "Acceso denegado");
      }

      await fetchElectivos();
      fireDynamicSwal(response?.status, null, response?.data?.message);
    } catch (error) {
      console.error(error);
      fireDynamicSwal(500, null, "Error al crear electivo");
    }
  };

  return { handleCreateElectivo };
};

export default useCreateElectivo;