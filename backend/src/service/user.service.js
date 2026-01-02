/*
import { getErrorMessage, getResultLength, getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";
import UserEntity from "../entity/user.entity.js";
import { encryptPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { JWT_SECRET } from "../config/configEnv.js";
import jwt from 'jsonwebtoken';
import { ADMIN_ROLE, CAREER_HEAD_ROLE, STUDENT_ROLE } from "../constants/user.constants.js";
import { getAllowedRolesToTamper } from "../helpers/user.helper.js";

export async function parseCredentials(a, b) {
    if (a === b) {
        return undefined;
    }
    return a || b;   
}

export async function getUsersFromService() {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        let users = await userRepository.find();
        if (users && Array.isArray(users)) {
            for (let i = 0; i < users.length; i++) {
                delete users[i].password;
            }
        }
        return getServiceResult(false, users, "Usuarios encontrado con éxito", getResultLength(users));
    } catch (error) {
        console.error(error);
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}

export async function getUserByIdFromService(id) {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            return getServiceResult(false, null, "Usuario no encontrado", 0);
        }        
        delete user.password;
        return getServiceResult(false, user, "Usuario encontrado con éxito", getResultLength(user));
    } catch (error) {
        console.error(error);
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}

export async function MIDDLEWARE_getUserByIdFromService(id) {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const user = await userRepository.findOne({where: {id: Number(id)}});
        // console.log(user);
        if (!user) {
            return null;
        } 
        delete user.password;  
        return user;
    } catch (error) {
        return null;
    }
}

export async function updateUserByIdFromService(id, newData, req_user_role, req_user_carrera) {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const oldData = await userRepository.findOne({ where: { id } });
        if (!oldData) {
            return getServiceResult(false, null, "Usuario no encontrado", 0);
        }
        if (oldData.role && !(getAllowedRolesToTamper(req_user_role).includes(oldData.role))) {
            return getServiceResult(false, null, `No tiene permiso para trabajar con ${oldData.role}`, 0);
        }
        if ((req_user_role !== ADMIN_ROLE) && (oldData.carrera !== req_user_carrera)) {
            return getServiceResult(false, null, "No tiene permiso para actualizar usuarios de otra carrera")
        }
        if (newData.password) {
            newData.password = encryptPassword(newData.password);
        }

       
        Object.assign(oldData, newData);
        await userRepository.update({id: id}, oldData);
        return getServiceResult(false, oldData, "Usuario actualizado con éxito", 1);
    } catch (error) {
        console.error(error);
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}

export async function deleteUserByIdFromService(id, req_user_role, req_user_carrera) {
    var queryRunner = {};
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();

        const userData = await userRepository.findOne({ where: { id } });
        if (!userData) {
            return getServiceResult(false, null, "Usuario no encontrado", 0);
        } 
        if (userData.role && !(getAllowedRolesToTamper(req_user_role).includes(userData.role))) {
            return getServiceResult(false, null, `No tiene permiso para trabajar con ${userData.role}`, 0);
        }
        if ((req_user_role !== ADMIN_ROLE) && (userData.carrera !== req_user_carrera)) {
            return getServiceResult(false, null, "No tiene permiso para eliminar usuarios de otra carrera");
        }
        const result = await userRepository.remove(userData);
        if (result.affected && result.affected !== 1) {
            throw new Error("No se pudo eliminar el usuario");
        }
        await queryRunner.commitTransaction();
        return getServiceResult(false, userData, "Usuario eliminado con éxito", 1);
    } catch (error) {
        console.error(error);
        if (queryRunner.rollbackTransaction) {
            queryRunner.rollbackTransaction();
        }
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}

export async function checkIfUserExists(userRepository, newData) {
    try {
        const existingEmailUser = await userRepository.findOne({where: { email: newData.email }});
        if (existingEmailUser) {
            return getServiceResult(false, null, "Correo ya registrado", 0);
        }
        const existingRutUser = await userRepository.findOne({ where: { rut: newData.rut } });
        if (existingRutUser) {
            return getServiceResult(false, null, "RUT ya registrado", 0);
        }
        const existingUsernameUser = await userRepository.findOne({ where: { username: newData.username } });
        if (existingUsernameUser) {
            return getServiceResult(false, null, "Nombre de usuario ya registrado", 0);
        }
        return null;
    } catch (error) {
        return getServiceResult(false, null, "Error desconocido", 0);
    }
}

export async function registerUserFromService(newData) {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const result = await checkIfUserExists(userRepository, newData);
        if (result !== null) {
            return result;
        }

        newData.password = await encryptPassword(newData.password);

        const newUser = userRepository.create(newData);
        await userRepository.save(newUser);
        newUser.password = undefined;

        // Excluir la contraseña del objeto de respuesta
        return getServiceResult(false, newUser, "Usuario registrado exitosamente!", 1);
    } catch (error) {
        console.error("Error en auth.controller.js -> register(): ", error);
        return getServiceResult(true, null, "Error al registrar usuario", 0);
    }
}

export async function loginUserFromService(data) {
    const GENERIC_ERROR = "Usuario o clave incorrectos";

    try {
        const userRepository = AppDataSource.getRepository(UserEntity);

        const userFound = await userRepository.findOne({ where: { email: data.email } });
        // Correo no existe
        if (!userFound) {
            return getServiceResult(false, null, GENERIC_ERROR, 0);
        }
        const isMatch = await comparePassword(data.password, userFound.password);
        // Contraseña incorrecta
        if (!isMatch) {
            return getServiceResult(false, null, GENERIC_ERROR, 0);
        }

        const payload = {
            id : userFound.id,
            username: userFound.username,
            email: userFound.email,
            rut: userFound.rut,
            rol: userFound.role,
        };
        console.log((String(payload?.username).toUpperCase() || "JUANITO PÉREZ") + " entró al sistema");
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

        return getServiceResult(false, { token: accessToken }, "Inicio de sesión exitoso!", 1);
    } catch (error) {
        console.error("Error en auth.controller.js -> login(): ", error);
        return getServiceResult(true, null, "Error al iniciar sesión", 0);
    }
}

export async function logoutUserFromService(clearCookieFunction) {
  try {
    clearCookieFunction("jwt", { httpOnly: true });
    return getServiceResult(false, null, "Sesión cerrada exitosamente", 0);
  } catch (error) {
    console.error("Error en auth.controller.js -> login(): ", error);
    return getServiceResult(true, null, "Error al cerrar sesión", 0);
  }
}

export async function RAW_getUserById(id) {
    return await MIDDLEWARE_getUserByIdFromService(id);
}

export async function RAW_getAllStudents() {
    const BASE_CASE = [];
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const students = await userRepository.find({where: {role: STUDENT_ROLE}});
        return students || BASE_CASE;
    } catch (error) {
        return BASE_CASE;
    }
}

export async function EMAIL_getAllCareerChiefs(career) {
    const BASE_CASE = [];
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const chiefs = await userRepository.find({where: {carrera: String(career).toUpperCase(), role: CAREER_HEAD_ROLE}});
        return chiefs || BASE_CASE;
    } catch (error) {
        return BASE_CASE;
    }
}*/

"use strict";

import { AppDataSource } from "../config/configDb.js";
import { UsuarioEntity } from "../entity/usuario.entity.js";
import { encryptPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/configEnv.js";

export async function getUsersFromService() {
  return await AppDataSource.getRepository(UsuarioEntity).find({
    relations: { carrera: true },
  });
}

export async function getUserByIdFromService(id) {
  return await AppDataSource.getRepository(UsuarioEntity).findOne({
    where: { id },
    relations: { carrera: true },
  });
}

export async function registerUserFromService(data) {
  try {
    const repo = AppDataSource.getRepository(UsuarioEntity);

    const user = repo.create({
      nombre: data.fullname,
      rut: data.rut,
      email: data.email,
      clave: await encryptPassword(data.password),
      rol: data.role,
      creditos: data.creditos || 0,
      carrera: data.carrera,
    });

    await repo.save(user);

    return { error: false, details: "Usuario registrado", data: user };
  } catch (error) {
    return { error: true, details: "Error al registrar usuario", errorData: error };
  }
}

export async function loginUserFromService(data) {
  try {
    const repo = AppDataSource.getRepository(UsuarioEntity);
    const user = await repo.findOne({ where: { email: data.email } });

    if (!user) return { error: true, details: "Credenciales inválidas" };

    const ok = await comparePassword(data.password, user.clave);
    if (!ok) return { error: true, details: "Credenciales inválidas" };

    const token = jwt.sign(
      { id: user.id, rol: user.rol, email: user.email },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return { error: false, data: { token } };
  } catch (error) {
    return { error: true, details: "Error en login", errorData: error };
  }
}

export const RAW_getAllStudents = async () => {
  try {
    const userRepository = AppDataSource.getRepository(UsuarioEntity);

    return await userRepository.find({
      where: { rol: "ESTUDIANTE" },
      select: ["id", "nombre", "email"]
    });
  } catch (error) {
    return null;
  }
};

export async function deleteUserByIdFromService(id) {
  try {
    const repo = AppDataSource.getRepository(UsuarioEntity);

    const user = await repo.findOne({ where: { id } });
    if (!user) {
      return { error: true, details: "Usuario no encontrado" };
    }

    await repo.remove(user);

    return { error: false, details: "Usuario eliminado correctamente" };
  } catch (error) {
    return {
      error: true,
      details: "Error al eliminar usuario",
      errorData: error,
    };
  }
}

export async function logoutUserFromService() {
  try {
    // En JWT no se invalida el token en backend por defecto
    // El logout real se maneja en el frontend eliminando el token
    return {
      error: false,
      details: "Sesión cerrada correctamente",
    };
  } catch (error) {
    return {
      error: true,
      details: "Error al cerrar sesión",
      errorData: error,
    };
  }
}

export async function updateUserByIdFromService(id, data) {
  try {
    const repo = AppDataSource.getRepository(UsuarioEntity);

    const user = await repo.findOne({ where: { id } });
    if (!user) {
      return { error: true, details: "Usuario no encontrado" };
    }

    // Solo actualizamos campos permitidos
    Object.assign(user, {
      nombre: data.fullname ?? user.nombre,
      rut: data.rut ?? user.rut,
      email: data.email ?? user.email,
      rol: data.role ?? user.rol,
      creditos: data.creditos ?? user.creditos,
      carrera: data.carrera ?? user.carrera,
    });

    if (data.password) {
      user.clave = await encryptPassword(data.password);
    }

    await repo.save(user);

    return { error: false, details: "Usuario actualizado", data: user };
  } catch (error) {
    return { error: true, details: "Error al actualizar usuario", errorData: error };
  }
}

export async function MIDDLEWARE_getUserByIdFromService(id) {
  try {
    const repo = AppDataSource.getRepository(UsuarioEntity);

    const user = await repo.findOne({
      where: { id },
      relations: { carrera: true },
    });

    if (!user) return null;

    return user;
  } catch (error) {
    return null;
  }
}
