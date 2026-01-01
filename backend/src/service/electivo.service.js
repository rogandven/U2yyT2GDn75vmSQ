"use strict";

import { AppDataSource } from "../config/configDb.js";
import electivoEntity from "../entity/electivo.entity.js";
import { addMany } from "./electivo.carrera.service.js";
import { queryRunner } from "./utils/utils.service.js";

export const electivoRepository = AppDataSource.getRepository(electivoEntity);

export async function getElectivos() {
    const electivos = await electivoRepository.find({relations: {profesor: true}});
    return electivos;
}

export async function getElectivoById(id) {
    const electivo = await electivoRepository.findOne({where: {id: id}, relations: {profesor: true}});
    return electivo;
}

export async function createElectivo(data, careerIdArray) {
    await queryRunner.startTransaction();
    let electivo = null;
    try {
        electivo = await electivoRepository.save(electivoRepository.create(data));
        await addMany(careerIdArray, electivo.id, true, false);
        queryRunner.commitTransaction();
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    }
    return electivo;
}

export async function updateElectivo(id, data, careerIdArray) {
    await queryRunner.startTransaction();
    const updateResult = await electivoRepository.update({id: id}, data);
    if (Number(updateResult?.affected) !== 1) {
        queryRunner.rollbackTransaction();
        throw new Error(`Updated ${updateResult?.affected} rows`);
    }
    await addMany(careerIdArray, id, true, false);
    await queryRunner.commitTransaction();
    return updateResult;
}

export async function deleteElectivo(id) {
    await queryRunner.startTransaction();
    const deleteResult = await electivoRepository.delete({id: id});
    if (Number(deleteResult?.affected) !== 1) {
        await queryRunner.rollbackTransaction();
        throw new Error(`Deleted ${updateResult?.affected} rows`);
    }
    await queryRunner.commitTransaction();
    return deleteResult;
}
