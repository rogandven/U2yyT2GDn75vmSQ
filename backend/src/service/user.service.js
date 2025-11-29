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
    var queryRunner = {};
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();

        const result = await userRepository.remove({ where: { id } });
        console.log(result);

        await queryRunner.commitTransaction();
        return getServiceResult(false, user, "Usuario eliminado con éxito", getResultLength(user));
    } catch (error) {
        console.log(error);
        if (queryRunner.rollbackTransaction) {
            queryRunner.rollbackTransaction();
        }
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}

export async function registerUserFromService(newData) {
    // TODO!!! TODO!!! TODO!!! TODO!!!TODO!!! TODO!!!TODO!!! TODO!!!TODO!!! TODO!!!
    /* fullname, username, rut, email, password, role, generation */
    try {
        // Obtener el repositorio de usuarios y validar los datos de entrada
        const userRepository = AppDataSource.getRepository(UserEntity);

        // Verificar si el usuario ya existe verificando email, rut y username
        const existingEmailUser = await userRepository.findOne({
        where: { email },
        });
        if (existingEmailUser)
        return res.status(409).json({ message: "Correo ya registrado." });

        const existingRutUser = await userRepository.findOne({ where: { rut } });
        if (existingRutUser)
        return res.status(409).json({ message: "Rut ya registrado." });

        const existingUsernameUser = await userRepository.findOne({
        where: { username },
        });
        if (existingUsernameUser)
        return res
            .status(409)
            .json({ message: "Nombre de usuario ya registrado." });

        // Crear un nuevo usuario y guardar en la base de datos
        const newUser = userRepository.create({
        username,
        email,
        rut,
        password: await encryptPassword(password),
        });
        await userRepository.save(newUser);

        // Excluir la contraseña del objeto de respuesta
        const { contraseña, ...dataUser } = newUser;

        res
        .status(201)
        .json({ message: "Usuario registrado exitosamente!", data: dataUser });
    } catch (error) {
        console.error("Error en auth.controller.js -> register(): ", error);
        return res.status(500).json({ message: "Error al registrar el usuario" });
    }
}