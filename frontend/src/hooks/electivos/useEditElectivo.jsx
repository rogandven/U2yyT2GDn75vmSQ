import { editElectivo } from "../../services/electivo.service";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";

async function editElectivoInfo(electivo) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Usuario",
    html: `
      ${createSwalField(1, "Nombre", electivo.nombre)}
      ${createSwalField(2, "Descripcion", electivo.descripcion)}
      ${createSwalField(3, "Cupos", electivo.cupos)}
      ${createSwalField(4, "Apertura", electivo.apertura)}
      ${createSwalField(5, "Cierre", electivo.cierre)}
      ${createSwalField(6, "Área", electivo.area)}
      ${createSwalField(7, "Semestre Mínimo", electivo.semestre_minimo)}
      ${createSwalField(8, "Carreras", electivo.carreras)}
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      /*
      const electivoname = document.getElementById("swal2-input1").value;
      const email = document.getElementById("swal2-input2").value;

      if (!electivoname || !email) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return false;
      }

      if (electivoname.length < 3 || electivoname.length > 30) {
        Swal.showValidationMessage(
          "El nombre de electivo debe tener entre 3 y 30 caracteres"
        );
        return false;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(electivoname)) {
        Swal.showValidationMessage(
          "El nombre de electivo solo puede contener letras, números y guiones bajos"
        );
        return false;
      }

      if (!email || email.length < 15 || email.length > 50) {
        Swal.showValidationMessage(
          "El correo electrónico debe tener entre 15 y 50 caracteres"
        );
        return false;
      }

      if (!/^[a-zA-Z0-9._%+-]+@gmail\.(com|cl)$/.test(email)) {
        Swal.showValidationMessage(
          "Por favor, ingresa un correo de Gmail válido (@gmail.com o @gmail.cl)"
        );
        return false;
      }
      return { electivoname, email };
      */
      const nombre = gebi('swal2-input1')?.value;
      const descripcion = gebi('swal2-input2')?.value;
      const cupos = gebi('swal2-input3')?.value;
      const apertura = gebi('swal2-input4')?.value;
      const cierre = gebi('swal2-input5')?.value;
      const area = gebi('swal2-input6')?.value;
      const semestre_minimo = gebi('swal2-input7')?.value;
      const carreras = gebi('swal2-input8')?.value;

      return {nombre, descripcion, cupos, apertura, cierre, area, semestre_minimo, carreras};
    },
    theme: "dark"
  });
  if (formValues) {
    return {
      electivoname: formValues.electivoname,
      email: formValues.email,
    };
  }
}

export const useEditElectivo = (fetchElectivos) => {
  const handleEditElectivo = async (electivoId, electivo) => {
    try {
      const formValues = await editElectivoInfo(electivo);
      if (!formValues) return;

      const response = await editElectivo(electivoId, formValues);
      console.log(response);
      if (response) {
        await fetchElectivos();
        fireDynamicSwal(response.status, response.message === response.details ? null : response.message, response.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al editar electivo:", error);
    }
  };

  return { handleEditElectivo };
};

export default useEditElectivo;
