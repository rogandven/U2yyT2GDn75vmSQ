import { getErrorMessage, getResultLength, getServiceResult } from "./utils/utils.service.js";
import UserEntity from "../entity/user.entity.js";

export async function getUsersFromService() {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const users = await userRepository.find();
        return getServiceResult(false, users, null, getResultLength(users));
    } catch (error) {
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}

export async function getUserByIdFromService(id) {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const user = await userRepository.findOne({ where: { id } });
        return getServiceResult(false, user, null, getResultLength(user));
    } catch (error) {
        return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}