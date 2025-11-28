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