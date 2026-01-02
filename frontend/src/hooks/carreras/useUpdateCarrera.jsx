
import Swal from "sweetalert2";
import { createSwalField } from "../utils/swalField.jsx";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { updateCarrera } from "@services/carrera.service.js";

async function editCarreraInfo(carrera) {
    const { value: formValues } = await Swal.fire({
        title: 'Editar Carrera',
        html: `
            ${createSwalField(2, "sigla", carrera.sigla)}
            ${createSwalField(3, "Nombre", carrera.nombre)}
            `,

        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Editar',
        preConfirm: () => {
            
            const sigla = document.getElementById('swal2-input2').value;
            const nombre = document.getElementById('swal2-input3').value;

            if(!sigla || !nombre ){
                Swal.showValidationMessage('Por favor complete todos los campos');
                return;
            }
            return { sigla,nombre };

        },
        theme: "dark",
    });
    if (formValues) {
        return {
            id_carrera: carrera.id_carrera,
            sigla: formValues.sigla,
            nombre: formValues.nombre,
        };     
    }
}

export const editCarrera=(fetchCarrera)=> {
    const handleEditCarrera = async (id_carrera,carrera) => {
        try {
            const formValues= await editCarreraInfo(carrera);
            if(!formValues) return;

            const response = await updateCarrera(id_carrera, formValues);
            if(response){
                fireDynamicSwal(response?.status, null, response.message || response.details || response.data?.message || response.data?.details);
                await fetchCarrera();
            }
        }
         catch (error) {
            console.error('Error al actualizar la carrera:', error);
        }
    };
    return { handleEditCarrera };
};

export default editCarrera;
