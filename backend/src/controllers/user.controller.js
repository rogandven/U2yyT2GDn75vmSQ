"use strict";
import { getUsersFromService, getUserByIdFromService, updateUserByIdFromService, deleteUserByIdFromService, registerUserFromService, loginUserFromService, logoutUserFromService, getUserPagesFromService } from "../service/user.service.js";

export async function getUsers(req, res) {
  try {
    const users = await getUsersFromService();
    users && users.forEach((user) => {
      delete user.password;
    });
    if (users.length <= 0) {
      return res.status(201).json({message: "No hay usuarios para mostrar", users: users});
    }
    return res.status(200).json({message: "Usuarios encontrados con éxito", users: users});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error interno del servidor", users: null});
  }
}

export async function getUserPages(req, res) {
  try {
    const users = await getUserPagesFromService(10, req.params.id);
    console.log(users);
    return res.status(200).json({message: "Usuarios encontrados con éxito", users: users});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error interno del servidor", users: null});
  }
}

export async function getUserById(req, res) {
  try {
    const user = await getUserByIdFromService(req.params.id);
    if (!user) {
      return res.status(404).json({message: "Usuario no encontrado", user: null});
    }
    delete user.password;
    return res.status(200).json({message: "Usuario encontrado con éxito", user: user});
  } catch (error) {
    return res.status(500).json({message: "Error interno del servidor", user: null});
  }
}

export async function updateUserById(req, res) {
  const internalServerError = {message: "Error interno del servidor", data: data};

  try {
    const result = await updateUserByIdFromService(req.params.id, req.body);
    if (!result) {
      return res.status(500).json(internalServerError);
    }
    return res.status(200).json({message: "¡Usuario actualizado con éxito!", data: result});
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerError);
  }
}

export async function deleteUserById(req, res) {
  const internalServerError = {message: "Error interno del servidor", data: data};

  try {
    const deletionResult = await deleteUserByIdFromService(req.params.id);
    return res.status(200).json({message: "¡Usuario eliminado con éxito!", data: deletionResult});
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerError);
  }
}

export async function getProfile(req, res) {
  try {
    return res.status(200).json({message: "Perfil encontrado con éxito", userData: req.user});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error interno del servidor", userData: null});
  }
}

export async function registerPrivate(req, res) {
  try {
    const creationResult = await registerUserFromService(req.body);
    return res.status(200).json({message: "Usuario registrado con éxito", data: creationResult});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error interno del servidor", data: null});
  }
}

export async function login(req, res) {
  const loginResult = await loginUserFromService(req.body);
  if (!loginResult) {
    return res.status(200).json({message: "Usuario o clave incorrectos", token: null});
  }
  return res.status(400).json({message: "¡Sesión iniciada con éxito!", token: loginResult});
}

export async function logout(req, res) {
  if (logoutUserFromService) {
    return res.status(200).json({message: "¡Sesión cerrada con éxito!"});
  } else {
    console.error(error);
    return res.status(500).json({message: "Error al cerrar sesión"});
  }
}

export const getAllStudentNames = async (req, res) => {
  
}