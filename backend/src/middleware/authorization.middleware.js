"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

const ADMINISTRADOR = 'administrador';
const JEFE_DE_CARRERA = 'jefe_de_carrera';

export async function isRoleHelper(roleArray, req, res, next) {
  try {
    if (!roleArray || !(Array.isArray(roleArray))) {
      throw Error("Valores no proporcionados");
    }

    // Buscar el usuario en la base de datos
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({
      email: req.user?.email,
    });
    if (!userFound) return res.status(404).json("Usuario no encontrado");

    // Verificar el rol del usuario
    const rolUser = userFound.role;

    // Si el rol no es administrador, devolver un error 403
    let allowed = false;
    for (let i = 0; i < roleArray.length; i++) {
      if (rolUser === roleArray[i]) {
        allowed = true;
        break;
      }
    }

    if (!allowed) {
      return res
        .status(403)
        .json({
          message:
            "Error al acceder al recurso. Se requiere un rol de administrador para realizar esta acción.",
        });
    }
    // Si el rol es administrador, continuar
    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

// Función middleware para verificar si el usuario es administrador
export async function isAdmin(req, res, next) {
  return await isRoleHelper([ADMINISTRADOR, JEFE_DE_CARRERA], req, res, next);
}

export async function isJefe(req, res, next) {
  return await isRoleHelper([JEFE_DE_CARRERA], req, res, next);
}
