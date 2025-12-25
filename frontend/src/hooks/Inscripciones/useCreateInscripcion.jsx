import Swal from "sweetalert2";
import { createInscripcion } from "@services/Inscripcion.service.js";

export const useCreateInscripcion = (fetchElectivos) => {

  const handleCreateInscripcion = async (id) => {
    const confirm = await Swal.fire({
      title: "Crear inscripción",
      showCancelButton: true,
      confirmButtonText: "Registrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#008000",
      cancelButtonColor: "#e74c3c",
      focusConfirm: false,
    });

    if (confirm.isConfirmed) {
      try {
        await createInscripcion(id);

        await Swal.fire({
          icon: "success",
          title: "Inscripción creada",
          text: "Te has inscrito correctamente en el electivo.",
          confirmButtonColor: "#4CAF50",
        });

        await fetchElectivos();
      } catch (error) {
           const mensaje =
           error.response?.data?.message ||
           "No se pudo realizar la inscripción.";

        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: mensaje,
          confirmButtonColor: "#e74c3c",
         });
        }
    }
  };

  return { handleCreateInscripcion };
};

export default useCreateInscripcion;