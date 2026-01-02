import Swal from "sweetalert2";
import { createSolicitudAlumno } from "@services/solicitud.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";

export const useCreateSolicitud = (refresh) => {

  const handleCreateSolicitud = async (data) => {
    try {
      const response = await createSolicitudAlumno(data);

      if (response) {
        fireDynamicSwal(response.status, null, response.message);
        if (response.status === 201 && refresh) {
          await refresh();
        }
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
    }
  };

  return { handleCreateSolicitud };
};

export default useCreateSolicitud;
