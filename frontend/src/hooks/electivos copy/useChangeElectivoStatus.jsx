import { approveElectivo, rejectElectivo } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";


export const useChangeElectivoStatus = (fetchElectivos) => {
  const handleChangeElectivoStatus = async (electivoId, approve) => {
    try {
      let response = null;
      // // console.log(approve);
      if (approve) {
        response = await approveElectivo(electivoId);
      } else{ 
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
