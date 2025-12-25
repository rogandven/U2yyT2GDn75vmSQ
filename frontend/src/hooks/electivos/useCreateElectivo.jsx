import { createElectivo } from "../../services/electivo.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";

async function createElectivoInfo() {
  const { value: formValues } = await Swal.fire({
    title: "Crear Usuario",
    html: `
      ${createSwalField(1, "RUT", "")}
      ${createSwalField(2, "Nombre completo", "")}
      ${createSwalField(3, "Apodo", "")}
      ${createSwalField(4, "Correo", "")}
      ${createSwalField(5, "Contraseña", "")}
      ${createSwalField(6, "Rol", "")}
      ${createSwalField(7, "Generación", "")}
      ${createSwalField(8, "Carrera", "")}
      ${createSwalField(9, "Créditos", "")}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const rut = gebi('swal2-input1')?.value;
      const fullname = gebi('swal2-input2')?.value;
      const electivoname = gebi('swal2-input3')?.value;
      const email = gebi('swal2-input4')?.value;
      const password = gebi('swal2-input5')?.value;
      const role = gebi('swal2-input6')?.value;
      const generation = gebi('swal2-input7')?.value;
      const carrera = gebi('swal2-input8')?.value;
      const creditos = gebi('swal2-input9')?.value;

      return {rut, fullname, electivoname, email, password, role, generation, carrera, creditos};
    },
    theme: "dark",
  });
  if (formValues) {
    return formValues;
  }
}

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async (electivo) => {
    try {
      const formValues = await createElectivoInfo(electivo);
      if (!formValues) return;

      const response = await createElectivo(formValues);
      console.log(response);
      if (response) {
        await fetchElectivos();
        fireDynamicSwal(response.status, response.message === response.details ? null : response.message, response.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al crear usuario:", error);
    }
  };

  return { handleCreateElectivo };
};

export default useCreateElectivo;
