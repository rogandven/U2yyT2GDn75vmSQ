import { editUser } from "../../services/user.service";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { VALID_ROLES } from "../../services/admin.service.js";

async function editUserInfo(user) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Usuario",
    html: `
      ${createSwalField(1, "RUT", (user && user.rut) || "")}
      ${createSwalField(2, "Nombre completo", (user && user.fullname) || "")}
      ${createSwalField(3, "Apodo", (user && user.username) || "")}
      ${createSwalField(4, "Correo", (user && user.email) || "")}
      ${StaticDropdownList(VALID_ROLES, "Rol", "swal2-input5", "m-1")}
      ${createSwalField(7, "Generación", (user && user.generation) || "")}
      ${createSwalField(8, "Carrera", (user && user.carrera) || "")}
      ${createSwalField(9, "Créditos", (user && user.creditos) || "")}
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      /*
      const username = document.getElementById("swal2-input1").value;
      const email = document.getElementById("swal2-input2").value;

      if (!username || !email) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return false;
      }

      if (username.length < 3 || username.length > 30) {
        Swal.showValidationMessage(
          "El nombre de usuario debe tener entre 3 y 30 caracteres"
        );
        return false;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        Swal.showValidationMessage(
          "El nombre de usuario solo puede contener letras, números y guiones bajos"
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
      return { username, email };
      */
      const rut = gebi('swal2-input1')?.value;
      const fullname = gebi('swal2-input2')?.value;
      const username = gebi('swal2-input3')?.value;
      const email = gebi('swal2-input4')?.value;
      const role = gebi('swal2-input6')?.value;
      const generation = gebi('swal2-input7')?.value;
      const carrera = gebi('swal2-input8')?.value;
      const creditos = gebi('swal2-input9')?.value;

      return {rut, fullname, username, email, role, generation, carrera, creditos};
    },
    theme: "dark"
  });
  if (formValues) {
    console.log(formValues);
    return formValues;
  }
}

export const useEditUser = (fetchUsers) => {
  const handleEditUser = async (userId, user) => {
    try {
      const formValues = await editUserInfo(user);
      if (!formValues) return;

      const response = await editUser(userId, formValues);
      console.log(response);
      if (response) {
        await fetchUsers();
        fireDynamicSwal(response.status, null, response.message || response.details);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      console.error("Error al editar usuario:", error);
    }
  };

  return { handleEditUser };
};

export default useEditUser;
