import { getErrorMessage, getResultLength, getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";
import UserEntity from "../entity/user.entity.js";
import { encryptPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { JWT_SECRET } from "../config/configEnv.js";
import jwt from 'jsonwebtoken';
import { CAREER_HEAD_ROLE, STUDENT_ROLE } from "../constants/user.constants.js";
import carreraEntity from "../entity/carrera.entity.js";

const userRepository = AppDataSource.getRepository(UserEntity);
const queryRunner = AppDataSource.createQueryRunner();
const queryBuilder = AppDataSource.createQueryBuilder();

export async function parseCredentials(a, b) {
    if (a === b) {
        return undefined;
    }
    return a || b;   
}

export async function getUsersFromService() {
    const users = await userRepository.find({relations: {carrera: true}});
    users.forEach((user) => {
        delete user.password;
    })
    return users;
}

export async function getUserPagesFromService(page_size) {
    const users = await getUsersFromService();
    const pages = [];
    for (let i = 0; i < users.length; i++) {
        delete users[i].password;
        if ((i % page_size) === 0) {
            pages.push([]);
        }
        pages[pages.length - 1].push(users[i]);
    }

    return users;
}

export async function getUserByIdFromService(id) {
    const user = await userRepository.findOne({where: {id: id}, relations: {carrera: true}});
    if (user) {
        delete user.password;
    }
    return user;
}

export async function MIDDLEWARE_getUserByIdFromService(id) {
    return await getUserByIdFromService(id);
}

export async function updateUserByIdFromService(id, newData) {
    await queryRunner.startTransaction();
    const updateResult = await userRepository.update({id: id}, newData);
    if (Number(updateResult?.affected) !== 1) {
        queryRunner.rollbackTransaction();
        throw new Error(`Updated ${updateResult?.affected} rows`);
    }
    queryRunner.commitTransaction();
    return updateResult;
}

export async function deleteUserByIdFromService(id) {
    await queryRunner.startTransaction();
    const deleteResult = await userRepository.delete({id: id});
    if (Number(deleteResult?.affected) !== 1) {
        queryRunner.rollbackTransaction();
        throw new Error(`Deleted ${updateResult?.affected} rows`);
    }
    queryRunner.commitTransaction();
    return deleteResult;
}

export async function checkIfUserExists(email, rut, username) {
    const returnValueCreator = (status, message) => {
        return { 
        status: Number(status || 500),
        message: String(message || "Error interno del servidor"),
        }
    }

    try {
        let existingUserAmount = await userRepository.count({where: { email: email }});
        if (existingUserAmount !== 0) {
            return returnValueCreator(401, "Correo ya registrado");
        }
        existingUserAmount = await userRepository.count({ where: { rut: rut } });
        if (existingUserAmount !== 0) {
            return returnValueCreator(401, "RUT ya registrado");
        }
        existingUserAmount = await userRepository.count({ where: { username: username } });
        if (existingUserAmount !== 0) {
            return returnValueCreator(401, "Nombre de usuario ya registrado");
        }
        return returnValueCreator(200, "No existe ningún usuario con las credenciales especificadas");
    } catch (error) {
        console.error(error);
        return returnValueCreator(null, null);
    }
}

export async function registerUserFromService(newData) {
    newData.password = await encryptPassword(newData.password);
    const newUser = userRepository.create(newData);
    await userRepository.save(newUser);
    delete newUser.password;
    return newUser;
}

export async function loginUserFromService(data) {
    try {
        const userFound = await userRepository.findOne({ where: { email: data.email } });
        if (!userFound) {
            return null;
        }
        const isMatch = await comparePassword(data.password, userFound.password);
        if (!isMatch) {
            return null;
        }
        const payload = {
            id : userFound.id,
            username: userFound.username,
            email: userFound.email,
            rut: userFound.rut,
            rol: userFound.role,
        };
        const accessToken = String(jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" }));
        return accessToken;
    } catch (error) {
        console.error("Error en user.service.js -> login(): ", error);
        return null;
    }
}

export async function logoutUserFromService(clearCookieFunction) {
  try {
    clearCookieFunction("jwt", { httpOnly: true });
    return true;
  } catch (error) {
    console.error("Error en user.service.js -> logout(): ", error);
    return false;
  }
}

export async function getAllStudentsFromService() {
    const BASE_CASE = [];
    try {
        const students = await userRepository.find({where: {role: STUDENT_ROLE}});
        return students || BASE_CASE;
    } catch (error) {
        return BASE_CASE;
    }
}

export async function getAllCareerChiefs(career) {
    const BASE_CASE = [];
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const chiefs = await userRepository.find({where: {carreraId: career, role: CAREER_HEAD_ROLE}});
        return chiefs || BASE_CASE;
    } catch (error) {
        return BASE_CASE;
    }
} 