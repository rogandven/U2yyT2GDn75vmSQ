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
*/

/*
import { createElectivoJefeDeCarrera, createElectivoProfesor } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField, createSwalDateField, createSwalTextarea } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { AREAS_PERMITIDAS_EN_MAYUSCULA } from "../../constants/ElectivoConstants.jsx";
import { CARRERAS_PERMITIDAS } from "../../constants/CareerConstants.jsx";

async function createElectivoInfo() {
  const { value } = await Swal.fire({
    title: "Crear Electivo",
    html: `
      ${createSwalField(1, "Nombre")}
      ${createSwalTextarea(2, "Descripción")}
      ${createSwalField(3, "Cupos")}
      ${createSwalField(4, "Créditos Requeridos")}
      ${createSwalDateField(5, "Apertura")}
      ${createSwalDateField(6, "Cierre")}
      ${StaticDropdownList(AREAS_PERMITIDAS_EN_MAYUSCULA, "Área", "swal2-input7", "m-1", true)}
      ${createSwalField(8, "Semestre Mínimo")}
      ${StaticDropdownList(CARRERAS_PERMITIDAS, "Carrera", "swal2-input9", "m-1", true)}
    `,
    showCancelButton: true,
    confirmButtonText: "Crear",
    theme: "dark",
    preConfirm: () => ({
      nombre: gebi("swal2-input1")?.value,
      descripcion: gebi("swal2-input2")?.value,
      cupos: gebi("swal2-input3")?.value,
      creditos_requeridos: gebi("swal2-input4")?.value,
      apertura: gebi("swal2-input5")?.value,
      cierre: gebi("swal2-input6")?.value,
      area: gebi("swal2-input7")?.value,
      semestre_minimo: gebi("swal2-input8")?.value,
      carreras: gebi("swal2-input9")?.value,
    }),
  });

  return value;
}

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async (isAdmin, isJefe) => {
    if (!isAdmin) return fireDynamicSwal(500, null, "Acceso denegado");

    const formValues = await createElectivoInfo();
    if (!formValues) return;

    const response = isJefe
      ? await createElectivoJefeDeCarrera(formValues)
      : await createElectivoProfesor(formValues);

    await fetchElectivos();
    fireDynamicSwal(response?.status, null, response?.message || response?.details);
  };

  return { handleCreateElectivo };
};
*/

/*
import { createElectivoJefeDeCarrera, createElectivoProfesor } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import {
  createSwalField,
  createSwalDateField,
  createSwalTextarea
} from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";

import {
  AREAS_PERMITIDAS_EN_MAYUSCULA,
  PRERREQUISITOS_POSIBLES,
  MAX_PRERREQUISITOS
} from "../../constants/ElectivoConstants.jsx";

import { CARRERAS_PERMITIDAS } from "../../constants/CareerConstants.jsx";

async function createElectivoInfo() {
  const { value } = await Swal.fire({
    title: "Crear Electivo",
    html: `
      ${createSwalField(1, "Nombre")}
      ${createSwalTextarea(2, "Descripción")}
      ${createSwalField(3, "Cupos")}
      ${createSwalField(4, "Créditos mínimos aprobados")}
      ${createSwalDateField(5, "Fecha inicio")}
      ${createSwalDateField(6, "Fecha fin")}
      ${StaticDropdownList(AREAS_PERMITIDAS_EN_MAYUSCULA, "Área", "swal2-input7", "m-1", true)}
      ${StaticDropdownList(PRERREQUISITOS_POSIBLES, "Prerrequisitos (máx 2)", "swal2-input8", "m-1", true)}
      ${StaticDropdownList(CARRERAS_PERMITIDAS, "Carrera", "swal2-input9", "m-1", true)}
    `,
    showCancelButton: true,
    confirmButtonText: "Crear",
    theme: "dark",
    preConfirm: () => {
      const prerequisitos = gebi("swal2-input8")?.value
        ?.split(",")
        .map(p => p.trim())
        .filter(Boolean)
        .slice(0, MAX_PRERREQUISITOS);

      return {
        nombre_electivo: gebi("swal2-input1")?.value,
        descripcion: gebi("swal2-input2")?.value,
        cupos: Number(gebi("swal2-input3")?.value),
        creditos_minimos_aprobados: Number(gebi("swal2-input4")?.value),
        fecha_inicio: gebi("swal2-input5")?.value,
        fecha_fin: gebi("swal2-input6")?.value,
        area_electivo: gebi("swal2-input7")?.value,
        prerequisitos_asignaturas: prerequisitos,
        carreras: gebi("swal2-input9")?.value
      };
    },
  });

  return value;
}

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async (isAdmin, isJefe) => {
    if (!isAdmin) {
      return fireDynamicSwal(403, null, "Acceso denegado");
    }

    const formValues = await createElectivoInfo();
    if (!formValues) return;

    const response = isJefe
      ? await createElectivoJefeDeCarrera(formValues)
      : await createElectivoProfesor(formValues);

    await fetchElectivos();
    fireDynamicSwal(response?.status, null, response?.message);
  };

  return { handleCreateElectivo };
};
*/

import { createElectivoJefeDeCarrera, createElectivoProfesor } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import {
  createSwalField,
  createSwalDateField,
  createSwalTextarea
} from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";

import {
  AREAS_PERMITIDAS_EN_MAYUSCULA,
  PRERREQUISITOS_POSIBLES,
  MAX_PRERREQUISITOS
} from "../../constants/ElectivoConstants.jsx";

import { CARRERAS_PERMITIDAS } from "../../constants/CareerConstants.jsx";

async function createElectivoInfo() {
  const { value } = await Swal.fire({
    title: "Crear Electivo",
    html: `
      ${createSwalField(1, "Nombre")}
      ${createSwalTextarea(2, "Descripción")}
      ${createSwalField(3, "Cupos")}
      ${createSwalField(4, "Créditos minimos")}
      ${createSwalDateField(5, "Fecha inicio")}
      ${createSwalDateField(6, "Fecha fin")}
      ${StaticDropdownList(
        AREAS_PERMITIDAS_EN_MAYUSCULA,
        "Área",
        "swal2-input7",
        "m-1",
        true
      )}
      ${StaticDropdownList(
        PRERREQUISITOS_POSIBLES,
        "Prerrequisitos",
        "swal2-input8",
        "m-1",
        true
      )}
      ${createSwalField(9, "Link programa")}
      ${StaticDropdownList(
        CARRERAS_PERMITIDAS,
        "Carrera",
        "swal2-input10",
        "m-1",
        true
      )}
    `,
    showCancelButton: true,
    confirmButtonText: "Crear",
    theme: "dark",

    preConfirm: () => {
      const prerequisitosRaw = gebi("swal2-input8")?.value || "";

      const prerequisitos = prerequisitosRaw
        .split(",")
        .map(p => p.trim())
        .filter(Boolean);

      if (prerequisitos.length > MAX_PRERREQUISITOS) {
        Swal.showValidationMessage(
          `Solo se permiten ${MAX_PRERREQUISITOS} prerrequisitos como máximo`
        );
        return false;
      }

      return {
        nombre_electivo: gebi("swal2-input1")?.value,
        descripcion: gebi("swal2-input2")?.value,
        cupos: Number(gebi("swal2-input3")?.value),
        creditos_minimos_aprobados: Number(gebi("swal2-input4")?.value),
        fecha_inicio: gebi("swal2-input5")?.value, // DD-MM-AAAA
        fecha_fin: gebi("swal2-input6")?.value,    // DD-MM-AAAA
        area_electivo: gebi("swal2-input7")?.value,
        prerequisitos_asignaturas: prerequisitos,
        link_programa: gebi("swal2-input9")?.value || null,
        carreras: gebi("swal2-input10")?.value
      };
    },
  });

  return value;
}

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async (isAdmin, isJefe) => {
    if (!isAdmin) {
      return fireDynamicSwal(403, null, "Acceso denegado");
    }

    const formValues = await createElectivoInfo();
    if (!formValues) return;

    const response = isJefe
      ? await createElectivoJefeDeCarrera(formValues)
      : await createElectivoProfesor(formValues);

    await fetchElectivos();
    fireDynamicSwal(response?.status, null, response?.message);
  };

  return { handleCreateElectivo };
};
