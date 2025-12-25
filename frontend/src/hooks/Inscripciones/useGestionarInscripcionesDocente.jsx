import Swal from "sweetalert2";
import { gestionarInscripcionesRechazar } from "@services/Inscripcion.service.js";

export const useGestionarInscripcionDocente = (fetchMisInscripciones) => {

  const handleGestionarInscripcionDocente = async (inscripcionId) => {
    const result = await Swal.fire({
      title: "Gestionar inscripción",
      text: "¿Qué acción deseas realizar?",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Aprobar",
      denyButtonText: "Rechazar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2ecc71",
      denyButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
    });

    let accion = null;
    if (result.isConfirmed) accion = "aprobar";
    if (result.isDenied) accion = "rechazar";

    if (!accion) return;

    const { value: motivo } = await Swal.fire({
      title: "Motivo",
      input: "textarea",
      inputPlaceholder: "Escribe el motivo...",
      inputAttributes: { maxlength: 250 },
      showCancelButton: true,
      confirmButtonText: accion === "aprobar" ? "Aprobar" : "Rechazar",
      confirmButtonColor: accion === "aprobar" ? "#2ecc71" : "#e74c3c",
      inputValidator: (value) => {
        if (!value || value.trim() === "") return "El motivo es obligatorio";
      },
    });

    if (!motivo) return; 
    try {
      await gestionarInscripcionesRechazar(inscripcionId, { accion, motivo });

      await Swal.fire({
        icon: "success",
        title: accion === "aprobar" ? "Inscripción aprobada" : "Inscripción rechazada",
        confirmButtonColor: accion === "aprobar" ? "#2ecc71" : "#e74c3c",
      });

      fetchMisInscripciones();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo procesar la inscripción",
      });
    }
  };

  return { handleGestionarInscripcionDocente };
};

export default useGestionarInscripcionDocente;
