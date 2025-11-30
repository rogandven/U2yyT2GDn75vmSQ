import { updateTimetable } from "@services/horario.service.js";
import Swal from "sweetalert2";

async function editTimetableInfo(horario) {
    const { value: formValues } = await Swal.fire({
        title: 'Editar Horario',
        html: `
            <div>
                <label for="swal2-input2">Hora de Inicio:</label>
                <label for="swal2-input2">Tiene que estar en formato 24 horas HH:MM</label>
                <input id="swal2-input2" class="swal2-input" placeholder="HH:MM" value="${horario.hora_inicio}">
            </div>

            <div>
                <label for="swal2-input2">Hora de termino:</label>
                <label for="swal2-input2">Tiene que estar en formato 24 horas HH:MM</label>
                <input id="swal2-input2" class="swal2-input" placeholder="HH:MM" value="${horario.hora_termino}">
            </div>

            <div>
                <label for="swal2-input3">Sala:</label>
                <label for="swal2-input3">Tiene que tener entre 3 y 20 caracteres</label>
                <input id="swal2-input3" class="swal2-input" placeholder="Sala" value="${horario.sala}">
            </div>

            <div>
                <label for="swal2-input4">Día:</label>
                <label for="swal2-input4">Tiene que ser un día válido (lunes, martes, miércoles, jueves, viernes, sábado, )</label>
                <input id="swal2-input4" class="swal2-input" placeholder="Día" value="${horario.dia}">
            </div>
            `,

        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Editar',
        preConfirm: () => {
            
            const hora_inicio = document.getElementById('swal2-input2').value;
            const hora_termino = document.getElementById('swal2-input2').value;
            const sala = document.getElementById('swal2-input3').value;
            const dia = document.getElementById('swal2-input4').value;

            if(!hora_inicio || !hora_termino || !sala || !dia){
                Swal.showValidationMessage('Por favor complete todos los campos');
                return;
            }
            return { hora_inicio, hora_termino, sala, dia };

        },
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

export const editTimetable=(fetchTimetables)=> {
    const handleEditTimetable = async (id_horario,horario) => {
        try {
            const formValues= await editTimetableInfo(horario);
            if(!formValues) return;

            const response = await updateTimetable(id_horario, formValues);
            if(response){
                Swal.fire({
                    title:"Horario actualizado con exitosamente",
                    icon:"success",
                    confirmButtonText:"Aceptar"
                })
                    await fetchTimetables();
                }

                await fetchTimetables();
        }
         catch (error) {
            console.error('Error al actualizar el horario:', error);
        }
    };
    return { handleEditTimetable };
};

export default editTimetable;


