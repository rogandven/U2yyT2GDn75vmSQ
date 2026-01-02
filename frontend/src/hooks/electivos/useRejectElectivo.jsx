import Swal from "sweetalert2";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { fireDynamicSwal } from "../utils/dynamicSwal";
import { rejectElectivo } from "../../services/electivo.service";

export async function RejectElectivoInfo() {
    const {value:formValues} = await Swal.fire({
        title: 'Motivo de rechazo del electivo',
        html: `
        ${createSwalField(1,"Motivo: ", "")}
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        theme: "dark",

        preConfirm: () => {
            const motivo = gebi('swal2-input1')?.value;
            return {motivo};
        }
    });
    if (formValues){
        return frameElement;
    }
}

export const useRejectElectivo = (fetchElectivos) => {
    const handleRejectElectivo2 = async (isAdmin, isJefe, id) => {
        try {
            if (!isAdmin){
                return fireDynamicSwal(500, null, "Acceso denegado por ser idiota");
            }
            
            let response = null;
            const formValues = await RejectElectivoInfo();
            
            if (!formValues) return;

            if(isJefe){
                response = await rejectElectivo(id, formValues);
            }else{
                return fireDynamicSwal(500, null, "Acceso denegado eres un estudiante que va a ser expulsado por intentar ser Jefe");
            }
            if (response) {
                await fetchElectivos();
                fireDynamicSwal(response?.status, null, (response?.data?.message || response?.data?.details) || (response?.message || response?.details));
            }
        } catch (error) {
            fireDynamicSwal(500, null, null);
        }
    };
    return {handleRejectElectivo2};
}

export default useRejectElectivo;