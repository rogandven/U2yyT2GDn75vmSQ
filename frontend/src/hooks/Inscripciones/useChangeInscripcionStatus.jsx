import { private_approveInscripcion, private_rejectInscripcion} from "../../services/inscripcion.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";


export const useChangeInscripcionStatus = (fetchInscripciones) => {
  const handleChangeInscripcionStatus = async (inscripcionId, approve) => {
    try {
      let response = null;
      console.log(approve);
      if (approve) {
        response = await private_approveInscripcion(inscripcionId);
      } else{ 
        response = await private_rejectInscripcion(inscripcionId);
      }
      console.log(response);
      if (response) {
        await fetchInscripciones();
        fireDynamicSwal(response.status, response.message === response.details ? null : response.message, response.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al editar inscripcion:", error);
    }
  };

  return { handleChangeInscripcionStatus };
};

export default useChangeInscripcionStatus;
