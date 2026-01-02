/*
"use strict";
import { getUsersFromService, getUserByIdFromService, updateUserByIdFromService, deleteUserByIdFromService, registerUserFromService, loginUserFromService, logoutUserFromService, RAW_getUserById, RAW_getAllStudents } from "../service/user.service.js";
import { getControllerResult_NEW, fullNameProcessor, robustErrorMessage } from "./utils/utils.controller.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { updateValidation, integrityValidation, createValidation, loginValidation } from "../validations/user.validation.js";
import { ADMIN_ROLE, CAREER_HEAD_ROLE, STUDENT_ROLE, TEACHER_ROLE } from "../constants/user.constants.js";
import { processCarrera } from "./utils/utils.controller.js";
import { processRole } from "./utils/utils.controller.js";
import { getAllowedRolesToTamper } from "../helpers/user.helper.js";


export async function getUsers(req, res) {
  const users = await getUsersFromService();
  if (users.error) {
    return res.status(500).json(getControllerResult_NEW("Error en el servidor", users));
  }
  if (users.length <= 0) {
    return res.status(404).json(getControllerResult_NEW("No hay usuarios", users));
  }  
  return res.status(200).json(getControllerResult_NEW("Usuarios encontrados con éxito", users));
}

export async function getUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(getControllerResult_NEW("El ID es obligatorio", null));
  }
  const result = idValidation.validate({id: id});
  if (result.error) {
    return res.status(400).json(getControllerResult_NEW(result.error.message, null));
  }

  const user = await getUserByIdFromService(id);

  if (user.error) {
    return res.status(500).json(getControllerResult_NEW("Error interno del servidor", user));
  }
  if (user.length <= 0) {
    user.error = true;
    return res.status(404).json(getControllerResult_NEW("Usuario no encontrado", user));
  }

  return res.status(200).json(getControllerResult_NEW(user.details, user));
}

export async function updateUserById(req, res) {
  const { id } = req.params;
  const newData = req.body || null;
  if (!newData) {
    return res.status(400).json(getControllerResult_NEW("Datos no proporcionados", null));
  }
  if (!id) {
    return res.status(400).json(getControllerResult_NEW("El ID es obligatorio", null));
  }
  if (id === req.user.id) {
    return res.status(401).json(getControllerResult_NEW("No se puede actualizar a si mismo", null));
  }
  if (newData.fullname) {
    newData.fullname = fullNameProcessor(newData.fullname);
  }
  if (newData.carrera) {
    newData.carrera = processCarrera(newData.carrera);  
  }
  if (newData.role) {
    newData.role = processRole(newData.role);
  }
  if (newData.role && !(getAllowedRolesToTamper(req.user.role || req.user.rol).includes(newData.role))) {
    return res.status(401).json(getControllerResult_NEW(`No tiene permiso para trabajar con ${newData.role}`))
  }

  const result = idValidation.validate({id: id});
  if (result.error) {
    return res.status(400).json(getControllerResult_NEW(result.error.message, null));
  }

  var validationResult = integrityValidation.validate(newData);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult_NEW(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }

  validationResult = updateValidation.validate(newData);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult_NEW(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }  
  const editedUser = await updateUserByIdFromService(id, newData, req.user.role || req.user.rol, req.user.carrera);
  if (editedUser.error) {
    return res.status(500).json(getControllerResult_NEW("Error interno del servidor", editedUser));
  }
  if (editedUser.length <= 0) {
    editedUser.error = true;
    return res.status(400).json(getControllerResult_NEW(editedUser.details || "Error desconocido", editedUser));
  }
  return res.status(200).json(getControllerResult_NEW(editedUser.details, editedUser));
}

export async function deleteUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(getControllerResult_NEW("El ID es obligatorio", null));
  } 
  const result = idValidation.validate({id: id});
  if (result.error) {
    return res.status(400).json(getControllerResult_NEW(result.error.message, null));
  }
  if (id === req.user.id) {
    return res.status(400).json(getControllerResult_NEW("No se puede eliminar a si mismo", null));
  }

  const user = await deleteUserByIdFromService(id, req.user.role || req.user.rol, req.user.carrera);

  if (user.error) {
    return res.status(500).json(getControllerResult_NEW("Error interno del servidor", user));
  }
  if (user.length <= 0) {
    user.error = true;
    return res.status(404).json(getControllerResult_NEW("Usuario no encontrado", user));
  }

  return res.status(200).json(getControllerResult_NEW(user.details, user));
}

export async function getProfile(req, res) {
  const id = req.user? (req.user.id || null) : null;

  if (!id) {
    return res.status(400).json(getControllerResult_NEW("El ID es obligatorio", null));
  }  
  const result = idValidation.validate({id: id});
  if (result.error) {
    return res.status(400).json(getControllerResult_NEW(result.error.message, null));
  }

  const user = await getUserByIdFromService(id);

  if (user.error) {
    return res.status(500).json(getControllerResult_NEW("Error interno del servidor", user));
  }
  if (user.length <= 0) {
    user.error = true;
    return res.status(404).json(getControllerResult_NEW("Usuario no encontrado", user));
  }

  return res.status(200).json(getControllerResult_NEW("Perfil encontrado con éxito", user));
}

export async function registerPrivate(req, res) {
  if (!req.body) {
    return res.status(400).json(getControllerResult_NEW("No se ha proporcionado ningún dato", null));
  }
  req.body.carrera = processCarrera(req.body.carrera);
  req.body.fullname = fullNameProcessor(req.body.fullname);
  req.body.role = processRole(req.body.role);

  if (!(getAllowedRolesToTamper(req.user.role || req.user.rol).includes(req.body.role))) {
    return res.status(401).json(getControllerResult_NEW(`No tiene permiso para trabajar con ${newData.role}`))
  }
  if (((req.user.role || req.user.rol) !== ADMIN_ROLE) && (req.user.carrera !== req.body.carrera)) {
    return res.status(401).json(getControllerResult_NEW(`No tiene permiso para registrar alumnos de otras carreras`));
  }

  validationResult = createValidation.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult_NEW(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }     
  var validationResult = integrityValidation.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult_NEW(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }


  const user = await registerUserFromService(req.body);
  if (user.error) {
    return res.status(500).json(getControllerResult_NEW("Error interno del servidor", user));
  } 
  if (user.length === 0) {
    user.error = true;
    if (user.details && user.details.endsWith("ya registrado")) {
      return res.status(409).json(getControllerResult_NEW(user.details, user));
    }
    return res.status(400).json(getControllerResult_NEW(user.details ? user.details : "Error al registrar usuario", user));
  }
  return res.status(201).json(getControllerResult_NEW(user.details, user));
}

export async function registerPublic(req, res) {
  if (!req || !(req.body)) {
    return res.status(400).json(getControllerResult_NEW("Ningún dato proporcionado"), null);
  }
  if (req.body.role) {
    return res.status(401).json(getControllerResult_NEW("No se puede autoasignar un rol"), null);
  }
  if (req.body.creditos) {
    return res.status(401).json(getControllerResult_NEW("No se puede autoasignar la cantidad de créditos"), null);
  }
  req.body.role = STUDENT_ROLE;
  req.body.creditos = 0;
  return await registerPrivate(req, res);
}

export async function login(req, res) {
  var validationResult = loginValidation.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult_NEW(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }   
  validationResult = integrityValidation.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json(getControllerResult_NEW(robustErrorMessage(validationResult.error.message, "Datos inválidos")));
  }

  const result = await loginUserFromService(req.body);
  if (result.error) {
    return res.status(500).json(getControllerResult_NEW("Error interno del servidor", result));
  }
  // console.log(result.data);
  if (!(result.data && result.data.token)) {
    result.error = true;
    return res.status(400).json(getControllerResult_NEW(result.details || "Error al iniciar sesión", result));
  }
  return res.status(200).json(getControllerResult_NEW("Sesión iniciada con éxito", result));
}

export async function logout(req, res) {
  // Eliminar la cookie de sesión del cliente
  const result = logoutUserFromService(res.clearCookie);
  if (result.error) {
    return res.status(200).json(getControllerResult_NEW("Sesión cerrada exitosamente", result));
  } else {
    return res.status(500).json(getControllerResult_NEW("Error al cerrar sesión", result));
  }
}

export const getUserNameById = async (id) => {
  const BASE_CASE = "JUANITO PÉREZ";
  try {
    const user = await RAW_getUserById(id);
    if (!user) {
      return BASE_CASE;
    }
    return String(user.fullname || BASE_CASE).toUpperCase();
  } catch (error) {
    return BASE_CASE;
  }
}

export const getAllStudentNames = async (req, res) => {
  const BASE_CASE = [];
  const names = [];
  try {
    const users = await RAW_getAllStudents();
    if (!users) {
      return res.status(200).json({lista: BASE_CASE});
    }
    for (let i = 0; i < users.length; i++) {
      if (users[i] && (users[i].fullname || users[i].username)) {
        names.push(String(users[i].id) + ". " + String((users[i].fullname || users[i].username)).toUpperCase());
      }
    }
    return res.status(200).json({lista: names});
  } catch (error) {
    return res.status(200).json({lista: BASE_CASE});
  }
}*/

"use strict";

import {
  getUsersFromService,
  getUserByIdFromService,
  updateUserByIdFromService,
  deleteUserByIdFromService,
  registerUserFromService,
  loginUserFromService,
  logoutUserFromService,
  RAW_getAllStudents
} from "../service/user.service.js";

import {
  getControllerResult_NEW,
  fullNameProcessor,
  robustErrorMessage
} from "./utils/utils.controller.js";

import { idValidation } from "../validations/modules/id.validation.js";
import {
  updateValidation,
  integrityValidation,
  createValidation,
  loginValidation
} from "../validations/user.validation.js";

import {
  ADMIN_ROLE,
  CAREER_HEAD_ROLE,
  STUDENT_ROLE,
  TEACHER_ROLE
} from "../constants/user.constants.js";

import { AppDataSource } from "../config/configDb.js";
import { CarreraEntity } from "../entity/carrera.entity.js";
import { getAllowedRolesToTamper } from "../helpers/user.helper.js";

export async function getUsers(req, res) {
  const users = await getUsersFromService();
  if (users.error) {
    return res.status(500).json(getControllerResult_NEW("Error en el servidor", users));
  }
  if (users.length <= 0) {
    return res.status(404).json(getControllerResult_NEW("No hay usuarios", users));
  }
  return res.status(200).json(getControllerResult_NEW("Usuarios encontrados con éxito", users));
}

export async function getUserById(req, res) {
  const { id } = req.params;

  const result = idValidation.validate({ id });
  if (result.error) {
    return res.status(400).json(getControllerResult_NEW(result.error.message));
  }

  const user = await getUserByIdFromService(id);
  if (!user || user.error) {
    return res.status(404).json(getControllerResult_NEW("Usuario no encontrado"));
  }

  return res.status(200).json(getControllerResult_NEW("Usuario encontrado", user));
}

export async function updateUserById(req, res) {
  const { id } = req.params;
  const newData = req.body;

  if (id === req.user.id) {
    return res.status(403).json(getControllerResult_NEW("No puede actualizarse a sí mismo"));
  }

  if (newData.fullname) {
    newData.fullname = fullNameProcessor(newData.fullname);
  }

  if (newData.carrera) {
    const carreraRepo = AppDataSource.getRepository(CarreraEntity);
    const carrera = await carreraRepo.findOneBy({ id: newData.carrera });

    if (!carrera) {
      return res.status(400).json(getControllerResult_NEW("Carrera inválida"));
    }

    newData.carrera = carrera;
  }

  if (newData.role) {
    if (!getAllowedRolesToTamper(req.user.role).includes(newData.role)) {
      return res.status(403).json(getControllerResult_NEW("No autorizado para asignar ese rol"));
    }
  }

  const validation = updateValidation.validate(newData);
  if (validation.error) {
    return res.status(400).json(getControllerResult_NEW(robustErrorMessage(validation.error.message)));
  }

  const updated = await updateUserByIdFromService(id, newData, req.user.role, req.user.carrera);
  return res.status(200).json(getControllerResult_NEW("Usuario actualizado", updated));
}


export async function deleteUserById(req, res) {
  const { id } = req.params;

  if (id === req.user.id) {
    return res.status(400).json(getControllerResult_NEW("No puede eliminarse a sí mismo"));
  }

  const deleted = await deleteUserByIdFromService(id, req.user.role, req.user.carrera);
  return res.status(200).json(getControllerResult_NEW("Usuario eliminado", deleted));
}


export async function getProfile(req, res) {
  const user = await getUserByIdFromService(req.user.id);
  return res.status(200).json(getControllerResult_NEW("Perfil obtenido", user));
}

export async function registerPrivate(req, res) {
  const body = req.body;

  body.fullname = fullNameProcessor(body.fullname);

  if (!getAllowedRolesToTamper(req.user.role).includes(body.role)) {
    return res.status(403).json(getControllerResult_NEW("Rol no permitido"));
  }

  const carreraRepo = AppDataSource.getRepository(CarreraEntity);
  const carrera = await carreraRepo.findOneBy({ id: body.carrera });

  if (!carrera) {
    return res.status(400).json(getControllerResult_NEW("Carrera inválida"));
  }

  body.carrera = carrera;

  const validation = createValidation.validate(body);
  if (validation.error) {
    return res.status(400).json(getControllerResult_NEW(robustErrorMessage(validation.error.message)));
  }

  const user = await registerUserFromService(body);
  return res.status(201).json(getControllerResult_NEW("Usuario registrado", user));
}


export async function registerPublic(req, res) {
  req.body.role = STUDENT_ROLE;
  req.body.creditos = 0;
  return await registerPrivate(req, res);
}


export async function login(req, res) {
  const validation = loginValidation.validate(req.body);
  if (validation.error) {
    return res.status(400).json(getControllerResult_NEW(validation.error.message));
  }

  const result = await loginUserFromService(req.body);
  return res.status(200).json(getControllerResult_NEW("Sesión iniciada", result));
}


export async function logout(req, res) {
  logoutUserFromService(res.clearCookie);
  return res.status(200).json(getControllerResult_NEW("Sesión cerrada"));
}


export const getUserNameById = async (id) => {
  const user = await RAW_getUserById(id);
  return user?.fullname || "USUARIO";
};

export const getAllStudentNames = async (req, res) => {
  const users = await RAW_getAllStudents();
  const names = users.map(u => `${u.id}. ${(u.fullname || u.username).toUpperCase()}`);
  return res.status(200).json({ lista: names });
};
