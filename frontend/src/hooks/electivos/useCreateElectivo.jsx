
/*
import Swal from "sweetalert2";
import { createElectivo } from "@services/electivo.service.js";

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Registrar nuevo electivo",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre del electivo">
        <input id="cupos" class="swal2-input" type="number" placeholder="Cupos">
        <input id="apertura" class="swal2-input" type="date" placeholder="Fecha de apertura">
        <input id="cierre" class="swal2-input" type="date" placeholder="Fecha de cierre">
        <input id="area" class="swal2-input" placeholder="Área">
        <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción del electivo"></textarea>
      `,
      confirmButtonText: "Registrar",
      confirmButtonColor: "#4CAF50",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      focusConfirm: false,

      preConfirm: () => {
        const nombre = document.getElementById("nombre").value.trim();
        const cupos = parseInt(document.getElementById("cupos").value);
        const apertura = document.getElementById("apertura").value;
        const cierre = document.getElementById("cierre").value;
        const area = document.getElementById("area").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();

        if (!nombre || nombre.length < 3)
          return Swal.showValidationMessage("El nombre debe tener al menos 3 caracteres");

        if (isNaN(cupos) || cupos < 1)
          return Swal.showValidationMessage("Debe ingresar un número válido de cupos (mínimo 1)");

        if (!apertura)
          return Swal.showValidationMessage("Debe ingresar la fecha de apertura");

        if (!cierre)
          return Swal.showValidationMessage("Debe ingresar la fecha de cierre");

        if (new Date(cierre) <= new Date(apertura))
          return Swal.showValidationMessage("La fecha de cierre debe ser posterior a la apertura");

        if (!area || area.length < 3)
          return Swal.showValidationMessage("El área debe tener al menos 3 caracteres");

        if (!descripcion || descripcion.length < 10)
          return Swal.showValidationMessage("La descripción debe tener al menos 10 caracteres");

        return { nombre, cupos, apertura, cierre, area, descripcion };
      },
    });

    if (formValues) {
      try {
        await createElectivo(formValues);
        Swal.fire("Éxito", "Electivo creado correctamente", "success");
        await fetchElectivos();
      } catch (error) {
        console.error("Error al crear electivo:", error);
        Swal.fire("Error", "No se pudo crear el electivo", "error");
      }
    }
  };

  return { handleCreateElectivo };
};

export default useCreateElectivo;


*/

/*

import Swal from "sweetalert2";
import { createElectivo } from "@services/electivo.service.js";

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Registrar nuevo electivo",
      width: 600,
      html: `
        <div style="display:flex; flex-direction:column; text-align:left; gap:12px;">

  <div style="display:flex; flex-direction:column;">
    <label for="nombre" style="font-weight:600; margin-bottom:4px;">Nombre del electivo</label>
    <input id="nombre" class="swal2-input" placeholder="Ingrese el nombre del electivo" style="width:100%; margin:0;">
  </div>

  <div style="display:flex; flex-direction:column;">
    <label for="cupos" style="font-weight:600; margin-bottom:4px;">Cupos disponibles</label>
    <input id="cupos" class="swal2-input" type="number" placeholder="Ingrese cupos disponibles" style="width:100%; margin:0;">
  </div>

  <div style="display:flex; flex-direction:column;">
    <label for="apertura" style="font-weight:600; margin-bottom:4px;">Inicio de preinscripción</label>
    <input id="apertura" class="swal2-input" type="date" style="width:100%; margin:0;">
  </div>

  <div style="display:flex; flex-direction:column;">
    <label for="cierre" style="font-weight:600; margin-bottom:4px;">Término de preinscripción</label>
    <input id="cierre" class="swal2-input" type="date" style="width:100%; margin:0;">
  </div>

  <div style="display:flex; flex-direction:column;">
    <label for="area" style="font-weight:600; margin-bottom:4px;">Área del electivo</label>
    <input id="area" class="swal2-input" placeholder="Ingrese el área del electivo" style="width:100%; margin:0;">
  </div>

  <div style="display:flex; flex-direction:column;">
    <label for="descripcion" style="font-weight:600; margin-bottom:4px;">Descripción del electivo</label>
    <textarea id="descripcion" class="swal2-textarea" placeholder="Ingrese una descripción detallada del electivo" style="width:100%; margin:0;"></textarea>
  </div>

</div>

      `,
      confirmButtonText: "Registrar",
      confirmButtonColor: "#4CAF50",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      focusConfirm: false,

      preConfirm: () => {
        const nombre = document.getElementById("nombre").value.trim();
        const cupos = parseInt(document.getElementById("cupos").value);
        const apertura = document.getElementById("apertura").value;
        const cierre = document.getElementById("cierre").value;
        const area = document.getElementById("area").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();

        if (!nombre || nombre.length < 3)
          return Swal.showValidationMessage("El nombre debe tener al menos 3 caracteres");

        if (isNaN(cupos) || cupos < 1)
          return Swal.showValidationMessage("Debe ingresar un número válido de cupos (mínimo 1)");

        if (!apertura)
          return Swal.showValidationMessage("Debe ingresar la fecha de inicio de preinscripción");

        if (!cierre)
          return Swal.showValidationMessage("Debe ingresar la fecha de término de preinscripción");

        if (new Date(cierre) <= new Date(apertura))
          return Swal.showValidationMessage("La fecha de término debe ser posterior a la de inicio");

        if (!area || area.length < 3)
          return Swal.showValidationMessage("El área debe tener al menos 3 caracteres");

        if (!descripcion || descripcion.length < 10)
          return Swal.showValidationMessage("La descripción debe tener al menos 10 caracteres");

        return { nombre, cupos, apertura, cierre, area, descripcion };
      },
    });

    if (formValues) {
      try {
        await createElectivo(formValues);
        Swal.fire("Éxito", "Electivo creado correctamente", "success");
        await fetchElectivos();
      } catch (error) {
        console.error("Error al crear electivo:", error);
        Swal.fire("Error", "No se pudo crear el electivo", "error");
      }
    }
  };

  return { handleCreateElectivo };
};

export default useCreateElectivo;

*/

import Swal from "sweetalert2";
import { createElectivo } from "@services/electivo.service.js";

export const useCreateElectivo = (fetchElectivos) => {
  const handleCreateElectivo = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Registrar nuevo electivo",
      width: 450,
      html: `
        <div style="width:100%; display:flex; justify-content:center;">
  <div style="width:90%; max-width:420px;">

    <div style="display:flex; flex-direction:column; gap:18px; text-align:left;">

      <div>
        <label for="nombre" style="font-weight:600; margin-bottom:4px; display:block;">Nombre del electivo</label>
        <input id="nombre" class="swal2-input"
          placeholder="Ingrese el nombre del electivo"
          style="width:100%; margin:0 auto !important;" />
      </div>

      <div>
        <label for="cupos" style="font-weight:600; margin-bottom:4px; display:block;">Cupos disponibles</label>
        <input id="cupos" class="swal2-input" type="number"
          placeholder="Ingrese cupos disponibles"
          style="width:100%; margin:0 auto !important;" />
      </div>

      <div>
        <label for="apertura" style="font-weight:600; margin-bottom:4px; display:block;">Inicio de preinscripción</label>
        <input id="apertura" class="swal2-input" type="date"
          style="width:100%; margin:0 auto !important;" />
      </div>

      <div>
        <label for="cierre" style="font-weight:600; margin-bottom:4px; display:block;">Término de preinscripción</label>
        <input id="cierre" class="swal2-input" type="date"
          style="width:100%; margin:0 auto !important;" />
      </div>
      <div>
      <label for="area" style="font-weight:600; margin-bottom:4px; display:block;">Área del electivo</label>
      <select id="area" class="swal2-input"
        style="width:100%; margin:0 auto !important; padding:8px;">
        <option value="">Seleccione un área</option>
        <option value="Desarrollo de Software">Desarrollo de Software</option>
        <option value="Bases de Datos y Sistemas de Información">Bases de Datos y Sistemas de Información</option>
        <option value="Ciencias de la Computación">Ciencias de la Computación</option>
        <option value="Inteligencia Artificial y Ciencia de Datos">Inteligencia Artificial y Ciencia de Datos</option>
        <option value="Redes y Telecomunicaciones">Redes y Telecomunicaciones</option>
        <option value="Ciberseguridad">Ciberseguridad</option>
        <option value="Ingeniería de Software y Gestión TI">Ingeniería de Software y Gestión TI</option>
        <option value="Sistemas Operativos e Infraestructura">Sistemas Operativos e Infraestructura</option>
        <option value="Desarrollo Móvil e Interfaces">Desarrollo Móvil e Interfaces</option>
        <option value="Innovación y Habilidades Blandas">Innovación y Habilidades Blandas</option>
  </select>
</div>
      <div>
        <label for="descripcion" style="font-weight:600; margin-bottom:4px; display:block;">Descripción del electivo</label>
        <textarea id="descripcion" class="swal2-textarea"
          placeholder="Ingrese una descripción detallada del electivo"
          style="width:100%; height:100px; margin:0 auto !important;"></textarea>
      </div>

    </div>

  </div>
</div>
      `,
      confirmButtonText: "Registrar",
      confirmButtonColor: "#4CAF50",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      focusConfirm: false,

      preConfirm: () => {
        const nombre = document.getElementById("nombre").value.trim();
        const cupos = parseInt(document.getElementById("cupos").value);
        const apertura = document.getElementById("apertura").value;
        const cierre = document.getElementById("cierre").value;
        const area = document.getElementById("area").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();

        if (!nombre || nombre.length < 3)
          return Swal.showValidationMessage("El nombre debe tener al menos 3 caracteres");

        if (isNaN(cupos) || cupos < 1)
          return Swal.showValidationMessage("Debe ingresar un número válido de cupos (mínimo 1)");

        if (!apertura)
          return Swal.showValidationMessage("Debe ingresar la fecha de inicio de preinscripción");

        if (!cierre)
          return Swal.showValidationMessage("Debe ingresar la fecha de término de preinscripción");

        if (new Date(cierre) <= new Date(apertura))
          return Swal.showValidationMessage("La fecha de término debe ser posterior a la de inicio");

        if (!area)
          return Swal.showValidationMessage("Debe seleccionar un área válida");

        if (!descripcion || descripcion.length < 10)
          return Swal.showValidationMessage("La descripción debe tener al menos 10 caracteres");

        return { nombre, cupos, apertura, cierre, area, descripcion };
      },
    });

    if (formValues) {
      try {
        await createElectivo(formValues);
        Swal.fire("Éxito", "Electivo creado correctamente", "success");
        await fetchElectivos();
      } catch (error) {
        console.error("Error al crear electivo:", error);
        Swal.fire("Error", "No se pudo crear el electivo", "error");
      }
    }
  };

  return { handleCreateElectivo };
};

export default useCreateElectivo;
