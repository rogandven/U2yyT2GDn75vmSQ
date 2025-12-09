/* import {aprobarElectivos, rechazarElectivos } from "../../services/electivo.service";
import Swal from "sweetalert2";

async function EvaluarElectivoInfo(electivos) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Electivo",
    html: `
    <div>
      <label for="swal2-input0">Nombre de electivo</label>  
      <button >
    </div>
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      const nombre = document.getElementById("swal2-input0").value;
      const descripcion = document.getElementById("swal2-input1").value;
      const profesor = document.getElementById("swal2-input2").value;
      const cupos = document.getElementById("swal2-input3").value;
      const creditos = document.getElementById("swal2-input4").value;

      console.log("NOMBRE: " + String(nombre));
      console.log("DESCRIPCION: " + String(descripcion));
      console.log("PROFESOR: " + String(profesor));
      console.log("CUPOS: " + String(cupos));
      console.log("CREDITOS: " + String(creditos));

      if (!nombre || !profesor) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return false;
      }

      if (!descripcion) {
        Swal.showValidationMessage("La descripción es obligatoria");
        return false;
      }

      if (nombre.length < 3 || nombre.length > 10) {
        Swal.showValidationMessage(
          "Ingrese el nombre del electivo a impartir"
        );
        return false;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(nombre)) {
        Swal.showValidationMessage(
          "El nombre de usuario solo puede contener letras, números y guiones bajos"
        );
        return false;
      }

      if (!profesor || profesor.length < 5 || profesor.length > 10) {
        Swal.showValidationMessage(
          "Ingrese el nombre del profesor"
        );
        return false;
      }

      if (!/^[a-zA-Z0-9._%+-]+$/.test(profesor)) {
        Swal.showValidationMessage(
          "Por favor, ingresa un profesor con nombre válido"
        );
        return false;
      }

      if (cupos == 0 || cupos > CANTIDAD_MAXIMA_DE_CUPOS){
        Swal.showValidationMessage(
          "Ingrese los cupos del electivo (máximo 60):"
        );
      }else if(isNaN(cupos)){
        Swal.showValidationMessage("Por favor ingrese un número de cupos válido");
      }

      if (creditos == 0 ||  creditos > CANTIDAD_MAXIMA_DE_CREDITOS){
        Swal.showValidationMessage(
          "Ingrese los créditos correspondientes al ramo (máximo 7):"
        );
      }else if(isNaN(creditos)){
        Swal.showValidationMessage("Por favor ingrese un número válido de créditos");
      }

      return { nombre, descripcion, profesor, cupos, creditos };
    },
  });
  if (formValues) {
    return {
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      profesor: formValues.profesor,
      cupos: formValues.cupos,
      creditos: formValues.creditos
    };
  }
}

export const EditElectivo = (fetchElectivos) => {
  const handleEditElectivo = async (electivoId, electivos) => {
    try {
      const formValues = await EvaluarElectivoInfo(electivos);
      if (!formValues) return;

      const response = await editElectivo(electivoId, formValues);
      if (response) {
        await fetchElectivos();
      }
    } catch (error) {
      console.error("Error al editar electivo:", error);
    }
  };
  return { handleEditElectivo };
};

export default EditElectivo;
*/