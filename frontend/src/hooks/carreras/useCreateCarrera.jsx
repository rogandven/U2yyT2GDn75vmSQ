
import Swal from "sweetalert2";

import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createCarrera } from "@services/carrera.service.js";

async function CreateCarrera() {
  const { value: formValues } = await Swal.fire({
    title: "Crear Nueva carrera",
    html: `
      ${createSwalField(2, "Sigla", "")}
      ${createSwalField(3, "Nombre", "")}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const sigla = gebi('swal2-input2')?.value;
      const nombre = gebi('swal2-input3')?.value;

      return {sigla, nombre};
    },
    theme: "dark",
  });
  if (formValues) {
    return formValues;
  }
}

export const useCreateCarrera = (fetchCarreras) => {
    const handleCreateCarrera= async () => {
        let response = null;
        try {
            const formValues = await CreateCarrera();
            if(!formValues) return;
            // console.log(JSON.stringify(formValues));
            response = await createCarrera(formValues);
            if (typeof(fetchCarreras) === "function") {
                fetchCarreras();
            }
            
        } catch (error) {
            console.error('Error creating carrera:', error);
            response = error?.response || {status: 500, message: "Error desconocido"};
        }
        fireDynamicSwal(response.status, null, response?.data?.message || response?.message);
    };

    return {
        handleCreateCarrera
    };
};
export default useCreateCarrera;