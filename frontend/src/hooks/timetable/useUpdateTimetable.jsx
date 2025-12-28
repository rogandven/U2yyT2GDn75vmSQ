import { updateTimetable } from "@services/horario.service.js";
import Swal from "sweetalert2";
import { createSwalField } from "../utils/swalField.jsx";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { DIAS_SEMANA } from "../../constants/HorarioConstants.jsx";

async function editTimetableInfo(horario) {
    const { value: formValues } = await Swal.fire({
        title: 'Editar Horario',
        html: `
            ${createSwalField(2, "Hora de Inicio", horario.hora_inicio)}
            ${createSwalField(3, "Hora de Término", horario.hora_termino)}
            ${createSwalField(4, "Sala", horario.sala)}
            ${StaticDropdownList(DIAS_SEMANA, horario.dia, "swal2-input5", "m-1", false)}
            `,

        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Editar',
        preConfirm: () => {
            
            const hora_inicio = document.getElementById('swal2-input2').value;
            const hora_termino = document.getElementById('swal2-input3').value;
            const sala = document.getElementById('swal2-input4').value;
            const dia = document.getElementById('swal2-input5').value;

            if(!hora_inicio || !hora_termino || !sala || !dia){
                Swal.showValidationMessage('Por favor complete todos los campos');
                return;
            }
            return { hora_inicio, hora_termino, sala, dia };

        },
        theme: "dark",
    });
    if (formValues) {
        return {
            id_horario: horario.id_horario,
            hora_inicio: formValues.hora_inicio,
            hora_termino: formValues.hora_termino,
            sala: formValues.sala,
            dia: formValues.dia,
        };     
    }
}

export const editTimetable=(fetchTimetable)=> {
    const handleEditTimetable = async (id_horario,horario) => {
        try {
            const formValues= await editTimetableInfo(horario);
            if(!formValues) return;

            const response = await updateTimetable(id_horario, formValues);
            if(response){
                fireDynamicSwal(response?.status, null, response.message || response.details || response.data?.message || response.data?.details);
                await fetchTimetable();
            }
        }
         catch (error) {
            console.error('Error al actualizar el horario:', error);
        }
    };
    return { handleEditTimetable };
};

export default editTimetable;


