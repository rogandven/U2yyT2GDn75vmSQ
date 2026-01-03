import { createUser } from "../../services/user.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { VALID_ROLES } from "../../services/admin.service.js";

async function createUserInfo(carreraNames) {
  console.log(carreraNames);

  const { value: formValues } = await Swal.fire({
    title: "Crear Usuario",
    html: `
      ${createSwalField(1, "RUT", "")}
      ${createSwalField(2, "Nombre completo", "")}
      ${createSwalField(3, "Apodo", "")}
      ${createSwalField(4, "Correo", "")}
      ${createSwalField(5, "Contraseña", "")}
      ${StaticDropdownList(VALID_ROLES, "Rol", "swal2-input6", "m-1", true)}
      ${createSwalField(7, "Generación", "")}
      ${StaticDropdownList(carreraNames, "Carrera", "swal2-input8", "m-1", true)}
      ${createSwalField(9, "Créditos", "")}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const rut = gebi('swal2-input1')?.value;
      const fullname = gebi('swal2-input2')?.value;
      const username = gebi('swal2-input3')?.value;
      const email = gebi('swal2-input4')?.value;
      const password = gebi('swal2-input5')?.value;
      const role = gebi('swal2-input6')?.value;
      const generation = gebi('swal2-input7')?.value;
      const carreraId = Number(String(gebi('swal2-input8')?.value).split(".")[0]);
      const creditos = gebi('swal2-input9')?.value;

      return {rut, fullname, username, email, password, role, generation, carreraId, creditos};
    },
    theme: "dark",
  });
  if (formValues) {
    return formValues;
  }
}

export const useCreateUser = () => {
  const handleCreateUser = async (fetchUsers, carreraNames) => {
    try {
      const formValues = await createUserInfo(carreraNames);
      if (!formValues) return;

      const response = await createUser(formValues);
      // console.log(response);
      if (response) {
        await fetchUsers();
        fireDynamicSwal(response.status, null, response.message);
      }
    } catch (error) {
      fireDynamicSwal(500, null, null);
      // console.error("Error al crear usuario:", error);
    }
  };

  return { handleCreateUser };
};

export default useCreateUser;
