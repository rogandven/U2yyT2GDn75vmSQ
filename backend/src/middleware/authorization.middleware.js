"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { getMiddlewareResponse, getTrueMiddlewareResponse } from "./utils/middleware.utils.js";
import { isAdminFromService } from "../service/authorization.service.js";
import { VALID_ADMIN_ROLES, VALID_SUPERADMIN_ROLES } from "../constants/user.constants.js";

const isAdminHelper = async (req, res, next, ALLOWED_ROLES) => {
  const email = (req && req.user && req.user.email) || null;
  const result = await isAdminFromService(VALID_ADMIN_ROLES, email);

  if (result === null) {
    next();
    return;
  }
  if (result.error) {
    return res.status(500).json(getTrueMiddlewareResponse("Error interno del servidor", result));
  }
  if (result.length <= 0) {
    return res.status(403).json(getTrueMiddlewareResponse("Acceso denegado", result));
  }
}

export async function isAdmin(req, res, next) {
  return await isAdminHelper(req, res, next, VALID_ADMIN_ROLES);
}

export async function isAdminOrProfesor(req, res, next) {
  return await isAdminHelper(req, res, next, VALID_ADMIN_ROLES);
}

export function authorizeRoles(rolesPermitidos) {
  return async (req, res, next) => {
    return await isAdminHelper(req, res, next, rolesPermitidos);
  };
}

/*
export function authorizeRoles(rolesPermitidos) {
  return async (req, res, next) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ email: req.user?.email });

      if (!user)
        return res.status(404).json(getMiddlewareResponse("Usuario no encontrado"));

      if (!rolesPermitidos.includes(user.role)) {
        return res.status(403).json(
          getMiddlewareResponse(`Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}`)
        );
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error interno en autorización", error });
    }
  };
}

/*
export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({
      email: req.user?.email,
    });
    if (!userFound) return res.status(404).json(getMiddlewareResponse("Usuario no encontrado"));

    const rolUser = userFound.role;

    if (rolUser !== "administrador")
      return res
        .status(403)
        .json(getMiddlewareResponse("Error al acceder al recurso. Se requiere un rol de administrador para realizar esta acción."));

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json(getMiddlewareResponse("Error interno del servidor"));
  }
}

export function authorizeRoles(rolesPermitidos) {
  return async (req, res, next) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ email: req.user?.email });

      if (!user)
        return res.status(404).json(getMiddlewareResponse("Usuario no encontrado"));

      if (!rolesPermitidos.includes(user.role)) {
        return res.status(403).json(
          getMiddlewareResponse(`Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}`)
        );
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error interno en autorización", error });
    }
  };
}

export async function isAdminOrProfesor(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email: req.user?.email });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const rolUser = user.role?.toLowerCase();

    if (rolUser !== "administrador" && rolUser !== "profesor") {
      return res.status(403).json({
        message:
          "Acceso denegado. Solo administradores o profesores pueden realizar esta acción.",
      });
    }

    next();
  } catch (error) {
    console.error("Error en isAdminOrProfesor:", error);
    res.status(500).json({ message: "Error interno en autorización", error });
  }
}
*/
