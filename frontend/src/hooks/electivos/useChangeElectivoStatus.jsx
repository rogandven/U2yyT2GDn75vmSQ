import { approveElectivo, rejectElectivo } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";


export const useChangeElectivoStatus = (fetchElectivos) => {
  const handleChangeElectivoStatus = async (electivoId, motivo, approve, isJefe) => {
    try {
      if (!isJefe) {
        return fireDynamicSwal(500, null, "Acceso denegado");
      }
      let response = null;
      // console.log({electivoId: Number(electivoId), approve: Boolean(approve), isJefe: Boolean(isJefe)});
      if (approve) {
        response = await approveElectivo(electivoId);
      } else { 
        let motivoData = motivo;
                
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
                
                response = await rejectElectivo(electivoId, motivoData);
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
