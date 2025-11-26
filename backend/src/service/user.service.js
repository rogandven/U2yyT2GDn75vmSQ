import { getErrorMessage, getResultLength } from "./utils/utils.service.js";
import UserEntity from "../entity/user.entity.js";

export async function getUsersFromService() {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const users = await userRepository.find();
        return {error: false, users: users, details: null, length: getResultLength(users)};
    } catch (error) {
        return {error: true, users: null, details: getErrorMessage(), length: 0};
    }
}

export async function getUserByIdFromService() {
    try {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const users = await userRepository.find();
        return {error: false, users: users, details: null, length: getResultLength(users)};
    } catch (error) {
        return {error: true, users: null, details: getErrorMessage(), length: 0};
    }
}