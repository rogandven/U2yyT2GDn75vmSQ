/*
import { editElectivo } from "../../services/electivo.service";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { AREAS_PERMITIDAS_EN_MAYUSCULA } from "../../constants/ElectivoConstants.jsx";
import { createSwalDateField } from "../utils/swalField.jsx";

async function editElectivoInfo(electivo) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Electivo",
    html: `
      ${createSwalField(1, "Nombre", electivo.nombre)}
      ${createSwalField(2, "Descripcion", electivo.descripcion)}
      ${createSwalField(3, "Cupos", electivo.cupos)}
      ${createSwalField(9, "Créditos Requeridos", electivo.creditos_requeridos)}
      ${createSwalDateField(4, electivo.apertura || "Apertura", electivo.apertura)}
      ${createSwalDateField(5, electivo.cierre || "Cierre", electivo.cierre)}
      ${StaticDropdownList(AREAS_PERMITIDAS_EN_MAYUSCULA, String(electivo.area).toUpperCase() || "Área", "swal2-input6", "m-1", false)}
      ${createSwalField(7, "Semestre Mínimo", electivo.semestre_minimo)}
      ${createSwalField(8, "Carreras", electivo.carreras)}
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    theme: "dark",
    preConfirm: () => {
      const nombre = gebi('swal2-input1')?.value;
      const descripcion = gebi('swal2-input2')?.value;
      const cupos = gebi('swal2-input3')?.value;
      const apertura = gebi('swal2-input4')?.value;
      const cierre = gebi('swal2-input5')?.value;
      const area = gebi('swal2-input6')?.value;
      const semestre_minimo = gebi('swal2-input7')?.value;
      const carreras = gebi('swal2-input8')?.value;
      const creditos_requeridos = gebi('swal2-input9')?.value;

      return {nombre, descripcion, cupos, apertura, cierre, area, semestre_minimo, carreras, creditos_requeridos};
    },
  });
  if (formValues) {
    return formValues;
  }
}

export const useEditElectivo = (fetchElectivos) => {
  const handleEditElectivo = async (electivoId, electivo, isAdmin) => {
    if (!isAdmin) {
      return fireDynamicSwal(500, null, "Acceso denegado");
    }
    
    try {
      const formValues = await editElectivoInfo(electivo);
      if (!formValues) return;

      // console.log(formValues);
      const response = await editElectivo(electivoId, formValues);
      // console.log(response);
      if (response) {
        await fetchElectivos();
        fireDynamicSwal(response.status, null, response.message || response.details);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      // console.error("Error al editar electivo:", error);
    }
  };

  return { handleEditElectivo };
};

export default useEditElectivo;
*/
/*
//nu
import { editElectivo } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField, createSwalDateField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { AREAS_PERMITIDAS_EN_MAYUSCULA } from "../../constants/ElectivoConstants.jsx";

async function editElectivoInfo(electivo) {
  const { value } = await Swal.fire({
    title: "Editar Electivo",
    html: `
      ${createSwalField(1, "Nombre", electivo.nombre)}
      ${createSwalField(2, "Descripción", electivo.descripcion)}
      ${createSwalField(3, "Cupos", electivo.cupos)}
      ${createSwalDateField(4, "Apertura", electivo.apertura)}
      ${createSwalDateField(5, "Cierre", electivo.cierre)}
      ${StaticDropdownList(AREAS_PERMITIDAS_EN_MAYUSCULA, electivo.area, "swal2-input6", "m-1")}
      ${createSwalField(7, "Semestre Mínimo", electivo.semestre_minimo)}
      ${createSwalField(8, "Carreras", electivo.carreras)}
    `,
    showCancelButton: true,
    confirmButtonText: "Editar",
    theme: "dark",
    preConfirm: () => ({
      nombre: gebi("swal2-input1")?.value,
      descripcion: gebi("swal2-input2")?.value,
      cupos: gebi("swal2-input3")?.value,
      apertura: gebi("swal2-input4")?.value,
      cierre: gebi("swal2-input5")?.value,
      area: gebi("swal2-input6")?.value,
      semestre_minimo: gebi("swal2-input7")?.value,
      carreras: gebi("swal2-input8")?.value,
    }),
  });

  return value;
}

export const useEditElectivo = (fetchElectivos) => {
  const handleEditElectivo = async (id, electivo) => {
    try {
      const values = await editElectivoInfo(electivo);
      if (!values) return;

      const response = await editElectivo(id, values);
      await fetchElectivos();
      fireDynamicSwal(response.status, null, response?.data?.message);
    } catch (error) {
      console.error(error);
      fireDynamicSwal(500, null, "Error al editar electivo");
    }
  };

  return { handleEditElectivo };
};
*/

//nunu
import { editElectivo } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField, createSwalDateField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { AREAS_PERMITIDAS_EN_MAYUSCULA } from "../../constants/ElectivoConstants.jsx";
import { CARRERAS_PERMITIDAS } from "../../constants/CareerConstants.jsx";

async function editElectivoInfo(electivo) {
  const { value } = await Swal.fire({
    title: "Editar Electivo",
    html: `
      ${createSwalField(1, "Nombre", electivo.nombre)}
      ${createSwalField(2, "Descripción", electivo.descripcion)}
      ${createSwalField(3, "Cupos", electivo.cupos)}
      ${createSwalField(4, "Créditos Requeridos", electivo.creditos_requeridos)}
      ${createSwalField(5, "Semestre Mínimo", electivo.semestre_minimo)}
      ${createSwalDateField(6, "Apertura", electivo.apertura)}
      ${createSwalDateField(7, "Cierre", electivo.cierre)}
      ${StaticDropdownList(AREAS_PERMITIDAS_EN_MAYUSCULA, electivo.area, "swal2-input8", "m-1")}
      ${StaticDropdownList(CARRERAS_PERMITIDAS, electivo.carreras, "swal2-input9", "m-1")}
    `,
    showCancelButton: true,
    confirmButtonText: "Editar",
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
      carreras: gebi("swal2-input9")?.value,
    }),
  });

  return value;
}

export const useEditElectivo = (fetchElectivos) => {
  const handleEditElectivo = async (id, electivo) => {
    try {
      const values = await editElectivoInfo(electivo);
      if (!values) return;

      const response = await editElectivo(id, values);
      await fetchElectivos();
      fireDynamicSwal(response.status, null, response?.data?.message);
    } catch (error) {
      console.error(error);
      fireDynamicSwal(500, null, "Error al editar electivo");
    }
  };

  return { handleEditElectivo };
};
