import { getErrorMessage, getResultLength, getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";
import UserEntity from "../entity/user.entity.js";


export async function parseCredentials(a, b) {
    if (a === b) {
        return undefined;
    }
    return a || b;   
}

export async function getUsersFromService() {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const users = await userRepository.find();
        return getServiceResult(false, users, "Usuarios encontrado con éxito", getResultLength(users));
    } catch (error) {
        console.log(error);
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
        return getServiceResult(false, user, "Usuario encontrado con éxito", getResultLength(user));
    } catch (error) {
        console.log(error);
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}

export async function updateUserByIdFromService(id, newData) {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        var oldData = null;
        oldData = await userRepository.findOne({ where: { id } });
        if (!oldData) {
            return getServiceResult(false, null, "Usuario no encontrado", 0);
        }
        /* fullname, username, rut, email, password, role, generation */
        oldData.fullname = newData.fullname || oldData.fullname;
        oldData.username = newData.username || oldData.username;
        oldData.rut = newData.rut || oldData.rut;
        oldData.email = newData.email || oldData.email;
        oldData.password = newData.password || oldData.password;
        oldData.role = newData.role || oldData.role;
        oldData.generation = newData.generation || oldData.generation;

        await userRepository.save(oldData);
        return getServiceResult(false, oldData, "Usuario actualizado con éxito", 1);
    } catch (error) {
        console.log(error);
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}

export async function deleteUserByIdFromService(id) {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();

        const result = await userRepository.remove({ where: { id } });
        console.log(result);

        await queryRunner.commitTransaction();
        return getServiceResult(false, user, "Usuario eliminado con éxito", getResultLength(user));
    } catch (error) {
        console.log(error);
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}