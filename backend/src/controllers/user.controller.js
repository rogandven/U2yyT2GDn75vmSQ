"use strict";
import { getUsersFromService, getUserByIdFromService, updateUserByIdFromService, deleteUserByIdFromService } from "../service/user.service.js";
import { getControllerResult, fullNameProcessor } from "./utils/utils.controller.js";
import { idValidation } from "../validations/modules/id.validation.js";

export async function getUsers(req, res) {
  const users = await getUsersFromService();
  if (users.error) {
    return res.status(500).json(getControllerResult("Error en el servidor", users));
  }
  if (users.length <= 0) {
    return res.status(404).json(getControllerResult("No hay usuarios", users));
  }  
  return res.status(200).json(getControllerResult("Usuarios encontrados con éxito", users));
}

export async function getUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(getControllerResult("El ID es obligatorio", null));
  }
  const result = idValidation.validate({id: id});
  if (result.error) {
    return res.status(400).json(getControllerResult(result.error.message, null));
  }

  const user = await getUserByIdFromService(id);

  if (user.error) {
    return res.status(500).json(getControllerResult("Error interno del servidor", user));
  }
  if (user.length <= 0) {
    user.error = true;
    return res.status(404).json(getControllerResult("Usuario no encontrado", user));
  }

  return res.status(200).json(getControllerResult(user.details, user));
}

export async function updateUserById(req, res) {
  const { id } = req.params;
  const newData = req.body;

  if (newData.fullname) {
    newData.fullname = fullNameProcessor(fullname);
  }
  
  if (!id) {
    return res.status(400).json(getControllerResult("El ID es obligatorio", null));
  }
  const result = idValidation.validate({id: id});
  if (result.error) {
    return res.status(400).json(getControllerResult(result.error.message, null));
  }
  const editedUser = await updateUserByIdFromService(id, newData);
  if (editedUser.error) {
    return res.status(500).json(getControllerResult("Error interno del servidor", editedUser));
  }
  if (editedUser.length <= 0) {
    editedUser.error = true;
    return res.status(404).json(getControllerResult("Usuario no encontrado", editedUser));
  }
  return res.status(200).json(getControllerResult(editedUser.details, editedUser));
}

export async function deleteUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(getControllerResult("El ID es obligatorio", null));
  } 
  const result = idValidation.validate({id: id});
  if (result.error) {
    return res.status(400).json(getControllerResult(result.error.message, null));
  }

  const user = await deleteUserByIdFromService(id);

  if (user.error) {
    return res.status(500).json(getControllerResult("Error interno del servidor", user));
  }
  if (user.length <= 0) {
    user.error = true;
    return res.status(404).json(getControllerResult("Usuario no encontrado", user));
  }

  return res.status(200).json(getControllerResult(user.details, user));
}

export async function getProfile(req, res) {
  const id = req.user? (req.user.id || null) : null;

  if (!id) {
    return res.status(400).json(getControllerResult("El ID es obligatorio", null));
  }  
  const result = idValidation.validate({id: id});
  if (result.error) {
    return res.status(400).json(getControllerResult(result.error.message, null));
  }

  const user = await getUserByIdFromService(id);

  if (user.error) {
    return res.status(500).json(getControllerResult("Error interno del servidor", user));
  }
  if (user.length <= 0) {
    user.error = true;
    return res.status(404).json(getControllerResult("Usuario no encontrado", user));
  }

  return res.status(200).json(getControllerResult("Perfil encontrado con éxito", user));
}

export async function register(req, res) {
  
}

export async function login(req, res) {
  try {
    // Obtener el repositorio de usuarios y validar los datos de entrada
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = req.body;
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Verificar si el usuario existe y si la contraseña es correcta
    const userFound = await userRepository.findOne({ where: { email } });
    if (!userFound)
      return res
        .status(404)
        .json({ message: "El correo electrónico no está registrado" });

    const isMatch = await comparePassword(password, userFound.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "La contraseña ingresada no es correcta" });

    // Generar un token JWT y enviarlo al cliente
    const payload = {
      id : userFound.id,
      username: userFound.username,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.role,
    };
    const accessToken = jwt.sign(payload, SESSION_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Inicio de sesión exitoso", accessToken });
  } catch (error) {
    console.error("Error en auth.controller.js -> login(): ", error);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

export async function logout(req, res) {
  // Eliminar la cookie de sesión del cliente
  try {
    res.clearCookie("jwt", { httpOnly: true });
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
}