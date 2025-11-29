import { assignTimetable } from "@services/horario.service";
import Swal from "sweetalert2";

async function CreateTimetable() {
    const {value: formValues} = await Swal.fire({
        title: 'Crear Nueva Horario',
        html: `
        <div>
            <label for="swal2-input2">Ingrese el horario de inicio del electivo: </label>
            <label for="swal2-input2">Tiene que estar en formato 24 horas HH:MM</label>
            <input id="swal2-input2" class="swal2-input" placeholder="HH:MM" value = "${""}">
        </div>

        <div>
            <label for="swal2-input2">Ingrese el horario de termino del electivo: </label>
            <label for="swal2-input2">Tiene que estar en formato 24 horas HH:MM</label>
            <input id="swal2-input2" class="swal2-input" placeholder="HH:MM" value = "${""}">
        </div>

        <div>
            <label for="swal2-input1">Sala</label>
            <input id="swal2-input3" class="swal2-input" placeholder="Nombre de la sala" value="${""}">
        </div>

        <div>
            <label for="swal2-input1">Dia</label>
            <label for="swal2-input3">Tiene que tener entre 8 y 20 caracteres (no se puede exceder de los 20)</label>
            <input id="swal2-input3" class="swal2-input" placeholder="dia del electivo" value="${""}">
        </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        preConfirm: () => {
            const hora_inicio = document.getElementById('swal2-input2').value;
            const hora_termino = document.getElementById('swal2-input2').value;
            const sala = document.getElementById('swal2-input3').value;
            const dia = document.getElementById('swal2-input3').value;
        if(!hora_inicio|| !hora_termino || !sala || !dia) {
            Swal.showValidationMessage('Por favor, completa todos los campos');
            return false;
        }

         if(!hora_inicio) {
            Swal.showValidationMessage('Por favor, ingresa el horario de inicio del electivo');
            return false;
        }

         if(!hora_termino) {
            Swal.showValidationMessage('Por favor, ingresa el horario de termino del electivo');
            return false;
        }

        if(!sala) {
            Swal.showValidationMessage('Por favor, ingresa el nombre de la sala');
            return false;
        }

       if(!dia){
            Swal.showValidationMessage('Por favor, ingresa el dia del electivo');
            return false;
       }

            return { hora_inicio, hora_termino, sala, dia };
        },     
 });

    if(formValues) {
    
    return {
        hora_inicio: formValues.hora_inicio,
        hora_termino: formValues.hora_termino,
        sala: formValues.sala,
        dia: formValues.dia
    };
}
}

export const useCreateTimetable = () => {
    const handleCreateTimetable = async () => {
        try {
            const formValues = await CreateTimetable();
            if(!formValues) return;

            await assignTimetable(formValues);
        } catch (error) {
            console.error('Error creating timetable:', error);
        }
    };

    return {
        handleCreateTimetable
    };
};
export default useCreateTimetable;