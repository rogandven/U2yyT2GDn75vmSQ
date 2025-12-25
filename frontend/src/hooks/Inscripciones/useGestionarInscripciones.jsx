import Swal from "sweetalert2";
import { gestionarInscripcion } from "@services/Inscripcion.service.js";

export const useGestionarInscripcion = (fetchMisInscripciones) => {

  const handleGestionarInscripcion = async (id) => {
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
    if (result.isConfirmed) {
      try {
        await gestionarInscripcion(id, {
          accion: "aprobar",
        });

        await Swal.fire({
          icon: "success",
          title: "Inscripción aprobada",
          confirmButtonColor: "#2ecc71",
        });

        fetchMisInscripciones();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "No se pudo aprobar la inscripción",
        });
      }
    }
    if (result.isDenied) {
      const { value: motivo } = await Swal.fire({
        title: "Motivo del rechazo",
        input: "textarea",
        inputPlaceholder: "Escribe el motivo del rechazo...",
        inputAttributes: {
          maxlength: 250,
        },
        showCancelButton: true,
        confirmButtonText: "Rechazar",
        confirmButtonColor: "#e74c3c",
        inputValidator: (value) => {
          if (!value || value.trim() === "") {
            return "El motivo es obligatorio";
          }
        },
      });

      if (!motivo) return;

      try {
        await gestionarInscripcion(id, {
          accion: "rechazar",
          motivo,
        });

        await Swal.fire({
          icon: "success",
          title: "Inscripción rechazada",
          confirmButtonColor: "#e74c3c",
        });

        fetchMisInscripciones();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "No se pudo rechazar la inscripción",
        });
      }
    }
  };

  return { handleGestionarInscripcion };
};

export default useGestionarInscripcion;