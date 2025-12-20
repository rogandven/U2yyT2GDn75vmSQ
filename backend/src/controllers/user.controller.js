"use strict";
import { getUsersFromService, getUserByIdFromService, updateUserByIdFromService, deleteUserByIdFromService, registerUserFromService, loginUserFromService, logoutUserFromService } from "../service/user.service.js";
import { getControllerResult, fullNameProcessor, robustErrorMessage } from "./utils/utils.controller.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { updateValidation, integrityValidation, createValidation, loginValidation } from "../validations/user.validation.js";
import { STUDENT_ROLE } from "../constants/user.constants.js";

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

  if (!id) {
    return res.status(400).json(getControllerResult("El ID es obligatorio", null));
  }
  if (newData.fullname) {
    newData.fullname = fullNameProcessor(fullname);
  }

  const result = idValidation.validate({id: id});
  if (result.error) {
    return res.status(400).json(getControllerResult(result.error.message, null));
  }

  var validationResult = integrityValidation.validate(newData);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }

  validationResult = updateValidation.validate(newData);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
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

export async function registerPrivate(req, res) {
  if (!req.body) {
    return res.status(400).json(getControllerResult("No se ha proporcionado ningún dato", null));
  }

  req.body.fullname = fullNameProcessor(req.body.fullname);

  // console.log(req.body);

  validationResult = createValidation.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }     
  var validationResult = integrityValidation.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }


  const user = await registerUserFromService(req.body);
  if (user.error) {
    return res.status(500).json(getControllerResult("Error interno del servidor", user));
  } 
  if (user.length === 0) {
    user.error = true;
    if (user.details && user.details.endsWith("ya registrado")) {
      return res.status(409).json(getControllerResult(user.details, user));
    }
    return res.status(400).json(getControllerResult(user.details ? user.details : "Error al registrar usuario", user));
  }
  return res.status(201).json(getControllerResult(user.details, user));
}

export async function registerPublic(req, res) {
  if (!req || !(req.body)) {
    return res.status(400).json(getControllerResult("Ningún dato proporcionado"), null);
  }
  if (req.body.role) {
    return res.status(401).json(getControllerResult("No se puede autoasignar un rol"), null);
  }
  if (req.body.creditos) {
    return res.status(401).json(getControllerResult("No se puede autoasignar la cantidad de créditos"), null);
  }
  req.body.role = STUDENT_ROLE;
  // console.log(req.body.role);
  req.body.creditos = 0;
  // console.log(req.body.creditos);
  return await registerPrivate(req, res);
}

export async function login(req, res) {
  var validationResult = loginValidation.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }   
  validationResult = integrityValidation.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }

  const result = await loginUserFromService(req.body);
  if (result.error) {
    return res.status(500).json(getControllerResult("Error interno del servidor", result));
  }
  if (result.data === null) {
    result.error = true;
    return res.status(400).json(getControllerResult(result.details || "Error al iniciar sesión", result));
  }
  return res.status(200).json(getControllerResult("Sesión iniciada con éxito", result));
}

export async function logout(req, res) {
  // Eliminar la cookie de sesión del cliente
  const result = logoutUserFromService(res.clearCookie);
  if (result.error) {
    return res.status(200).json(getControllerResult("Sesión cerrada exitosamente", result));
  } else {
    return res.status(500).json(getControllerResult("Error al cerrar sesión", result));
  }
}