import { private_approveInscripcion, private_rejectInscripcion } from "../../services/inscripcion.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";

export const useChangeInscripcionStatus = (fetchInscripciones) => {
  const handleChangeInscripcionStatus = async (inscripcionId, approve, canModerateInscriptions) => {
    if (!canModerateInscriptions) {
      return fireDynamicSwal(500, null, "Acceso denegado");
    }

    try {
      let response = null;
      // console.log(approve);
      if (approve) {
        response = await private_approveInscripcion(inscripcionId, {});
      } else{ 
         let motivoData = null;
        
        if (!motivoData) {
          const { value: motivoInput } = await Swal.fire({
            title: 'Motivo del rechazo',
            input: 'textarea',
            inputLabel: 'Ingrese el motivo del rechazo (mínimo 5 caracteres)',
            inputPlaceholder: 'Ej: El electivo está completo...',
            inputAttributes: {
              maxlength: 500,
              'aria-label': 'Motivo del rechazo'
            },
            showCancelButton: true,
            confirmButtonText: 'Confirmar rechazo',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
              if (!value || value.trim().length < 5) {
                return 'El motivo debe tener al menos 5 caracteres';
              }
              if (value.length > 500) {
                return 'El motivo no puede exceder 500 caracteres';
              }
              return null;
            }
          });

          if (!motivoInput) {
            return; // Usuario canceló
          }
          motivoData = { motivo_rechazo: motivoInput };
        }
        
        response = await private_rejectInscripcion(inscripcionId, motivoData);
      }
      // console.log(response);
      if (response) {
        if (response.data){ 
          Object.assign(response, response.data);
        }
        await fetchInscripciones();
        fireDynamicSwal(response.status, null, response.message || response.details);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      // console.error("Error al editar inscripcion:", error);
    }
  };

  return { handleChangeInscripcionStatus };
};

export default useChangeInscripcionStatus;
