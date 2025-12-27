import { approveElectivo, rejectElectivo } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";


export const useChangeElectivoStatus = (fetchElectivos) => {
  const handleChangeElectivoStatus = async (electivoId, approve, isJefe) => {
    try {
      if (!isJefe) {
        return fireDynamicSwal(500, null, "Acceso denegado");
      }
      let response = null;
      // console.log({electivoId: Number(electivoId), approve: Boolean(approve), isJefe: Boolean(isJefe)});
      if (approve) {
        response = await approveElectivo(electivoId);
      } else { 
        response = await rejectElectivo(electivoId);
      }
      // // console.log(response);
      if (response) {
        await fetchElectivos();
        fireDynamicSwal(response.status, null, response.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al editar electivo:", error);
    }
  };

  return { handleChangeElectivoStatus };
};

export default useChangeElectivoStatus;
