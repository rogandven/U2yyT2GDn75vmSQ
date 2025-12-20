import UserEntity from "../entity/user.entity.js";
import { getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";

export async function isAdminFromService(VALID_ADMIN_ROLES, email) {
  try {
    if (!email) {
        return getServiceResult(false, null, "Usuario no proporcionado", 0);
    }
    if (!VALID_ADMIN_ROLES || !Array.isArray(VALID_ADMIN_ROLES)) {
        return getServiceResult(false, null, "Roles no proporcionados", 0);
    }
    const userRepository = AppDataSource.getRepository(UserEntity);
    const userFound = await userRepository.findOneBy({
      email: email,
    });
    
    if (!userFound) {
        return getServiceResult(false, null, "Usuario no encontrado", 0);
    }

    const rolUser = userFound.role;

    for(var i = 0; i < VALID_ADMIN_ROLES.length; i++) {
        // console.log(VALID_ADMIN_ROLES[i]);
        if (rolUser === VALID_ADMIN_ROLES[i]) {
            return null;
        }
    }

    return getServiceResult(false, null, `Solo se permiten los siguientes roles: ${VALID_ADMIN_ROLES.join(", ")}`, 0);
  } catch (error) {
    console.error(error);
    return getServiceResult(true, null, "Error interno del servidor", 0);
  }
}