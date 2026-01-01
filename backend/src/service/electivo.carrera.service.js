"use strict";

import { AppDataSource } from "../config/configDb.js";
import electivoCarreraEntity from "../entity/Electivo-Carrera.entity.js";
import { queryRunner } from "./utils/utils.service.js";

export const electivoCarreraRepository = AppDataSource.getRepository(electivoCarreraEntity);

export async function getElectivoCarreras() {
    const electivoCarreras = await electivoCarreraRepository.find({relations: {electivo: true, carrera: true}});
    return electivoCarreras;
}

export async function getElectivoCarreraById(id) {
    const electivoCarrera = await electivoCarreraRepository.findOne({where: {id: id}, relations: {electivo: true, carrera: true}});
    return electivoCarrera;
}

export async function createElectivoCarrera(data) {
    const electivoCarrera = await electivoCarreraRepository.save(electivoCarreraRepository.create(data));
    return electivoCarrera;
}

export async function updateElectivoCarrera(id, data) {
    await queryRunner.startTransaction();
    const updateResult = await electivoCarreraRepository.update({id: id}, data);
    if (Number(updateResult?.affected) !== 1) {
        await queryRunner.rollbackTransaction();
        throw new Error(`Updated ${updateResult?.affected} rows`);
    }
    await queryRunner.commitTransaction();
    return updateResult;
}

export async function deleteElectivoCarrera(id) {
    await queryRunner.startTransaction();
    const deleteResult = await electivoCarreraRepository.delete({id: id});
    if (Number(deleteResult?.affected) !== 1) {
        await queryRunner.rollbackTransaction();
        throw new Error(`Deleted ${updateResult?.affected} rows`);
    }
    await queryRunner.commitTransaction();
    return deleteResult;
}

export async function addMany(careerIdArray, id_electivo, transactionStarted, commit) {
    if (!Array.isArray(careerIdArray)) {
        throw Error("Invalid career array");
    }
    if (!transactionStarted) {
        await queryRunner.startTransaction();
    }
    await electivoCarreraRepository.delete({electivoId: id_electivo});
    for (let i = 0; i < careerIdArray.length; i++) {
        try {
            await createElectivoCarrera({electivoId: id_electivo, carreraId: careerIdArray[i]});
        } catch (error) {
            queryRunner.rollbackTransaction();
            throw error;
        }
    }
    if (commit) {
        await queryRunner.commitTransaction();
    }
}