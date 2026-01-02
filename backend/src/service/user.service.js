import { getErrorMessage, getResultLength, getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";
import UserEntity from "../entity/user.entity.js";
import { encryptPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { JWT_SECRET } from "../config/configEnv.js";
import jwt from 'jsonwebtoken';
import { CAREER_HEAD_ROLE, STUDENT_ROLE } from "../constants/user.constants.js";

export async function parseCredentials(a, b) {
    if (a === b) {
        return undefined;
    }
    return a || b;   
}

export async function getUsersFromService() {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        let users = await userRepository.find({relations: {carrera: true}, order: {email: true}});
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
        const user = await userRepository.findOne({ where: { id },relations: {carrera: true} });
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
        const user = await userRepository.findOne({ where: { id },relations: {carrera: true} });
        if (!user) {
            return null;
        } 
        delete user.password;  
        return user;
    } catch (error) {
        return null;
    }
}

export async function updateUserByIdFromService(id, newData) {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const oldData = await userRepository.findOne({ where: { id },relations: {carrera: true} });
        if (!oldData) {
            return getServiceResult(false, null, "Usuario no encontrado", 0);
        }
        if (newData.password) {
            newData.password = encryptPassword(newData.password);
        }
        /* fullname, username, rut, email, password, role, generation */
        Object.assign(oldData, newData);

        await userRepository.save(oldData);
        return getServiceResult(false, oldData, "Usuario actualizado con éxito", 1);
    } catch (error) {
        console.error(error);
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}

export async function deleteUserByIdFromService(id) {
    var queryRunner = {};
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();

        const userData = await userRepository.findOne({ where: { id },relations: {carrera: true} });
        if (!userData) {
            return getServiceResult(false, null, "Usuario no encontrado", 0);
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
        const existingEmailUser = await userRepository.findOne({where: { email: newData.email },relations: {carrera: true}});
        if (existingEmailUser) {
            return getServiceResult(false, null, "Correo ya registrado", 0);
        }
        const existingRutUser = await userRepository.findOne({ where: { rut: newData.rut },relations: {carrera: true} });
        if (existingRutUser) {
            return getServiceResult(false, null, "RUT ya registrado", 0);
        }
        const existingUsernameUser = await userRepository.findOne({ where: { username: newData.username },relations: {carrera: true} });
        if (existingUsernameUser) {
            return getServiceResult(false, null, "Nombre de usuario ya registrado", 0);
        }
        return null;
    } catch (error) {
        return getServiceResult(false, null, "Error desconocido", 0);
    }
}

export async function registerUserFromService(newData) {
    /* fullname, username, rut, email, password, role, generation */
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

        const userFound = await userRepository.findOne({ where: { email: data.email },relations: {carrera: true} });
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
        const students = await userRepository.find({where: {role: STUDENT_ROLE},relations: {carrera: true}});
        return students || BASE_CASE;
    } catch (error) {
        return BASE_CASE;
    }
}

export async function EMAIL_getAllCareerChiefs(career) {
    const BASE_CASE = [];
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const chiefs = await userRepository.find({where: {carrera: String(career).toUpperCase(), role: CAREER_HEAD_ROLE},relations: {carrera: true}});
        return chiefs || BASE_CASE;
    } catch (error) {
        return BASE_CASE;
    }
}