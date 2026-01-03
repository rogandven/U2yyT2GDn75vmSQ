import Swal from "sweetalert2";
import {
  approveSolicitud,
  rejectSolicitud
} from "@services/solicitud.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";

export const usechangeSolicitudStatus = (refresh) => {

  const handleChangeSolicitudStatus = async (solicitudId, approve, isJefe) => {
    try {
      if (!isJefe) {
        return fireDynamicSwal(403, null, "Acceso denegado");
      }

      let response = null;

      if (approve) {
        response = await approveSolicitud(solicitudId);
      } else {
        const { value: motivo } = await Swal.fire({
          title: "Motivo del rechazo",
          input: "textarea",
          inputLabel: "Ingrese el motivo del rechazo",
          inputPlaceholder: "Ej: No cumple requisitos académicos",
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value || value.trim().length < 5) {
              return "El motivo debe tener al menos 5 caracteres";
            }
            return null;
          }
        });

        if (!motivo) return;

        response = await rejectSolicitud(solicitudId, {
          motivo_rechazo: motivo
        });
      }

      if (response) {
        fireDynamicSwal(response.status, null, response.message);
        if (refresh) await refresh();
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
    }
  };

  return { handleChangeSolicitudStatus };
};

export default usechangeSolicitudStatus;
