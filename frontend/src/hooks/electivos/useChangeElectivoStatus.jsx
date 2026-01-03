import { approveElectivo, rejectElectivo } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { RejectElectivoInfo } from "./useRejectElectivo.jsx";


export const useChangeElectivoStatus = (fetchElectivos) => {
  const handleChangeElectivoStatus = async (electivoId, approve, isJefe) => {
    try {
      if (!isJefe) {
        return fireDynamicSwal(500, null, "Acceso denegado");
      }
      let response = null;
      // console.log({electivoId: Number(electivoId), approve: Boolean(approve), isJefe: Boolean(isJefe)});
      if (approve) {
        const now = new Date();
        const year = now.getFullYear();
        const inputOptions = {};
        for (let y = year; y <= year + 2; y++) {
          inputOptions[`${y}-1`] = `${y}-1`;
          inputOptions[`${y}-2`] = `${y}-2`;
        }
        const { value: periodo } = await Swal.fire({
          title: 'Periodo de renovación',
          input: 'select',
          inputOptions: inputOptions,
          inputValue: `${year}-1`,
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
        });
        if (!periodo) {
          return;
        }
        response = await approveElectivo(electivoId, { periodo_renovacion: periodo });
      } else { 
        const formValues = await RejectElectivoInfo();
        if (!formValues) return;
        response = await rejectElectivo(electivoId, formValues);
      }
      // // console.log(response);
      if (response) {
        await fetchElectivos();
        fireDynamicSwal(response.status, null, response.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      // console.error("Error al editar electivo:", error);
    }
  };

  return { handleChangeElectivoStatus };
};

export default useChangeElectivoStatus;
