import { approveElectivo, rejectElectivo } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";


export const useChangeElectivoStatus = (fetchElectivos, approve) => {
  const handleChangeElectivoStatus = async (electivoId) => {
    try {
      let response = null;
      if (approve) {
        response = await approveElectivo(electivoId);
      } else{ 
        response = await rejectElectivo(electivoId);
      }
      console.log(response);
      if (response) {
        await fetchElectivos();
        fireDynamicSwal(response.status, response.message === response.details ? null : response.message, response.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al editar electivo:", error);
    }
  };

  return { handleChangeElectivoStatus };
};

export default useChangeElectivoStatus;
