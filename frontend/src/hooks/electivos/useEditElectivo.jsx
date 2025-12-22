
/*
import Swal from "sweetalert2";
import { updateElectivo } from "@services/electivo.service.js";

export const useEditElectivo = (fetchElectivos) => {
  const handleEditElectivo = async (electivo) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar electivo",
      html: `
        <input id="nombre" class="swal2-input" value="${electivo.nombre}" placeholder="Nombre del electivo">
        <input id="cupos" class="swal2-input" type="number" value="${electivo.cupos}" placeholder="Cupos">
        <input id="apertura" class="swal2-input" type="date" value="${electivo.apertura?.split("T")[0]}" placeholder="Fecha de apertura">
        <input id="cierre" class="swal2-input" type="date" value="${electivo.cierre?.split("T")[0]}" placeholder="Fecha de cierre">
        <input id="area" class="swal2-input" value="${electivo.area}" placeholder="Área">
        <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción del electivo">${electivo.descripcion}</textarea>
      `,
      confirmButtonText: "Guardar cambios",
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
      const confirmUpdate = await Swal.fire({
        title: "¿Confirmar cambios?",
        text: "Se actualizarán los datos del electivo.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
      });

      if (confirmUpdate.isConfirmed) {
        try {
          await updateElectivo(electivo.id, formValues);
          Swal.fire("Actualizado", "El electivo fue actualizado correctamente", "success");
          await fetchElectivos();
        } catch (error) {
          console.error("Error al actualizar electivo:", error);
          Swal.fire("Error", "No se pudo actualizar el electivo", "error");
        }
      }
    }
  };

  return { handleEditElectivo };
};

export default useEditElectivo;
*/

import Swal from "sweetalert2";
import { updateElectivo } from "@services/electivo.service.js";

export const useEditElectivo = (fetchElectivos) => {
  const handleEditElectivo = async (electivo) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar electivo",
      width: 450,
      html: `
        <div style="width:100%; display:flex; justify-content:center;">
          <div style="width:90%; max-width:420px;">
          
            <div style="display:flex; flex-direction:column; gap:18px; text-align:left;">

              <div>
                <label for="nombre" style="font-weight:600; margin-bottom:4px; display:block;">
                  Nombre del electivo
                </label>
                <input id="nombre" class="swal2-input"
                  value="${electivo.nombre}"
                  placeholder="Ingrese el nombre del electivo"
                  style="width:100%; margin:0 auto !important;" />
              </div>

              <div>
                <label for="cupos" style="font-weight:600; margin-bottom:4px; display:block;">
                  Cupos disponibles
                </label>
                <input id="cupos" class="swal2-input" type="number"
                  value="${electivo.cupos}"
                  placeholder="Ingrese cupos disponibles"
                  style="width:100%; margin:0 auto !important;" />
              </div>

              <div>
                <label for="apertura" style="font-weight:600; margin-bottom:4px; display:block;">
                  Inicio de preinscripción
                </label>
                <input id="apertura" class="swal2-input" type="date"
                  value="${electivo.apertura?.split("T")[0]}"
                  style="width:100%; margin:0 auto !important;" />
              </div>

              <div>
                <label for="cierre" style="font-weight:600; margin-bottom:4px; display:block;">
                  Término de preinscripción
                </label>
                <input id="cierre" class="swal2-input" type="date"
                  value="${electivo.cierre?.split("T")[0]}"
                  style="width:100%; margin:0 auto !important;" />
              </div>
              
              <div>
                <label for="area" style="font-weight:600; margin-bottom:4px; display:block;">
                  Área del electivo
                </label>
                <select id="area" class="swal2-input"
                  style="width:100%; margin:0 auto !important; padding:8px;">

                  <option value="">Seleccione un área</option>

                  <option value="Desarrollo de Software" ${electivo.area === "Desarrollo de Software" ? "selected" : ""}>
                    Desarrollo de Software
                  </option>

                  <option value="Bases de Datos y Sistemas de Información" ${electivo.area === "Bases de Datos y Sistemas de Información" ? "selected" : ""}>
                    Bases de Datos y Sistemas de Información
                  </option>

                  <option value="Ciencias de la Computación" ${electivo.area === "Ciencias de la Computación" ? "selected" : ""}>
                    Ciencias de la Computación
                  </option>

                  <option value="Inteligencia Artificial y Ciencia de Datos" ${electivo.area === "Inteligencia Artificial y Ciencia de Datos" ? "selected" : ""}>
                    Inteligencia Artificial y Ciencia de Datos
                  </option>

                  <option value="Redes y Telecomunicaciones" ${electivo.area === "Redes y Telecomunicaciones" ? "selected" : ""}>
                    Redes y Telecomunicaciones
                  </option>

                  <option value="Ciberseguridad" ${electivo.area === "Ciberseguridad" ? "selected" : ""}>
                    Ciberseguridad
                  </option>

                  <option value="Ingeniería de Software y Gestión TI" ${electivo.area === "Ingeniería de Software y Gestión TI" ? "selected" : ""}>
                    Ingeniería de Software y Gestión TI
                  </option>

                  <option value="Sistemas Operativos e Infraestructura" ${electivo.area === "Sistemas Operativos e Infraestructura" ? "selected" : ""}>
                    Sistemas Operativos e Infraestructura
                  </option>

                  <option value="Desarrollo Móvil e Interfaces" ${electivo.area === "Desarrollo Móvil e Interfaces" ? "selected" : ""}>
                    Desarrollo Móvil e Interfaces
                  </option>

                  <option value="Innovación y Habilidades Blandas" ${electivo.area === "Innovación y Habilidades Blandas" ? "selected" : ""}>
                    Innovación y Habilidades Blandas
                  </option>

                </select>
              </div>

              <div>
                <label for="descripcion" style="font-weight:600; margin-bottom:4px; display:block;">
                  Descripción del electivo
                </label>
                <textarea id="descripcion" class="swal2-textarea"
                  placeholder="Ingrese una descripción detallada del electivo"
                  style="width:100%; height:100px; margin:0 auto !important;">${electivo.descripcion}</textarea>
              </div>

            </div>

          </div>
        </div>
      `,
      confirmButtonText: "Guardar cambios",
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
      const confirmUpdate = await Swal.fire({
        title: "¿Confirmar cambios?",
        text: "Se actualizarán los datos del electivo.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
      });

      if (confirmUpdate.isConfirmed) {
        try {
          await updateElectivo(electivo.id, formValues);
          Swal.fire("Actualizado", "El electivo fue actualizado correctamente", "success");
          await fetchElectivos();
        } catch (error) {
          console.error("Error al actualizar electivo:", error);
          Swal.fire("Error", "No se pudo actualizar el electivo", "error");
        }
      }
    }
  };

  return { handleEditElectivo };
};

export default useEditElectivo;
