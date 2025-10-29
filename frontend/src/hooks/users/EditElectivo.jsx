import { CANTIDAD_MAXIMA_DE_CREDITOS } from "../../constants/ElectivoConstants";
import { CANTIDAD_MAXIMA_DE_CUPOS } from "../../constants/ElectivoConstants.jsx";
import { editElectivo } from "../../services/electivo.service";
import Swal from "sweetalert2"

async function editElectivoInfo(electivos) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Electivo",
    html: `
    <div>
      <label for="swal2-input1">Nombre de electivo</label>  
      <input id="swal2-input1" class="swal2-input" placeholder="Nombre de electivo" value = "${electivos.nombre}">
    </div>
    <div>
      <label for="swal2-input2">Nombre del profesor</label>
      <input id="swal2-input2" class="swal2-input" placeholder="Nombre del profesor" value = "${electivos.profesor}">
    </div>
    <div>
      <label for="swal2-input1">Numero de cupos</label>  
      <input id="swal2-input1" class="swal2-input" placeholder="Numero de cupos" value = "${electivos.cupos}">
    </div>
    <div>
      <label for="swal2-input2">Numero de creditos</label>
      <input id="swal2-input2" class="swal2-input" placeholder="Numero de creditos" value = "${electivos.creditos}">
    </div>
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      const nombre = document.getElementById("swal2-input1").value;
      const profesor = document.getElementById("swal2-input2").value;
      const cupos = document.getElementById("swal2-input1").value;
      const creditos = document.getElementById("swal2-input2").value;

      if (!nombre || !profesor) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
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

      if (cupos != 0 || cupos < CANTIDAD_MAXIMA_DE_CUPOS){
        Swal.showValidationMessage(
          "Ingrese los cupos del electivo (máximo 60):"
        );
      }else if(isNaN(cupos)){
        Swal.showValidationMessage("Por favor ingrese un número de cupos válido");
      }

      if (creditos != 0 ||  creditos < CANTIDAD_MAXIMA_DE_CREDITOS){
        Swal.showValidationMessage(
          "Ingrese los créditos correspondientes al ramo (máximo 7):"
        );
      }else if(isNaN(creditos)){
        Swal.showValidationMessage("Por favor ingrese un número válido de créditos");
      }

      return { nombre, profesor, cupos, creditos };
    },
  });
  if (formValues) {
    return {
      nombre: formValues.nombre,
      profesor: formValues.profesor,
    };
  }
}

export const EditElectivo = (fetchElectivos) => {
  const handleEditElectivo = async (electivoId, electivos) => {
    try {
      const formValues = await editElectivoInfo(electivos);
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
