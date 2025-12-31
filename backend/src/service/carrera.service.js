"use strict";

import { AppDataSource } from "../config/configDb.js";
import carreraEntity from "../entity/carrera.entity.js";

const careerRepository = AppDataSource.getRepository(carreraEntity);
const queryRunner = AppDataSource.createQueryRunner();

export async function getCarreras() {
    const careers = await careerRepository.find();
    return careers;
}

export async function getCarreraById(id) {
    const career = await careerRepository.findOne({where: {id: id}});
    return career;
}

export async function createCarrera(data) {
    const career = await careerRepository.save(careerRepository.create(data));
    return career;
}

export async function updateCarrera(id, data) {
    await queryRunner.startTransaction();
    const updateResult = await careerRepository.update({id: id}, data);
    if (Number(updateResult?.affected) !== 1) {
        queryRunner.rollbackTransaction();
        throw new Error(`Updated ${updateResult?.affected} rows`);
    }
    queryRunner.commitTransaction();
    return updateResult;
}

export async function deleteCarrera(id) {
    await queryRunner.startTransaction();
    const deleteResult = await careerRepository.delete({id: id});
    if (Number(deleteResult?.affected) !== 1) {
        queryRunner.rollbackTransaction();
        throw new Error(`Deleted ${updateResult?.affected} rows`);
    }
    queryRunner.commitTransaction();
    return deleteResult;
}
