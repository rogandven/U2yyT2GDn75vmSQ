import { assignTimetable } from "@services/horario.service.js";
import Swal from "sweetalert2";

import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";

async function CreateTimetable(electivoNames) {
  const { value: formValues } = await Swal.fire({
    title: "Crear Nuevo Horario",
    html: `
      ${StaticDropdownList(electivoNames, "Electivo", "swal2-input1", "mb-1")}
      ${createSwalField(2, "Hora de Inicio", "")}
      ${createSwalField(3, "Hora de Término", "")}
      ${createSwalField(4, "Sala", "")}
      ${createSwalField(5, "Día", "")}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const id_electivo = String(gebi('swal2-input1')?.value).split(".")[0];
      const hora_inicio = gebi('swal2-input2')?.value;
      const hora_termino = gebi('swal2-input3')?.value;
      const sala = gebi('swal2-input4')?.value;
      const dia = String(gebi('swal2-input5')?.value).toUpperCase();

      return {id_electivo, hora_inicio, hora_termino, sala, dia};
    },
    theme: "dark",
  });
  if (formValues) {
    return formValues;
  }
}

export const useCreateTimetable = (fetchHorarios) => {
    const handleCreateTimetable = async (electivoNames) => {
        let response = null;
        try {
            const formValues = await CreateTimetable(electivoNames);
            if(!formValues) return;
            response = await assignTimetable(formValues);
            if (typeof(fetchHorarios) === "function") {
                fetchHorarios();
            }
        } catch (error) {
            console.error('Error creating timetable:', error);
            response = error?.response || {status: 500, message: "Error desconocido"};
        }
        fireDynamicSwal(response.status, null, response?.data?.message || response?.message);
    };

    return {
        handleCreateTimetable
    };
};
export default useCreateTimetable;