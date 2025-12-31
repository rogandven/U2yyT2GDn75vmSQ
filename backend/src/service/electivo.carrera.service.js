"use strict";

import { AppDataSource } from "../config/configDb.js";
import electivoCarreraEntity from "../entity/Electivo-Carrera.entity.js";

const electivoCarreraRepository = AppDataSource.getRepository(electivoCarreraEntity);
const queryRunner = AppDataSource.createQueryRunner();

export async function getElectivoCarreras() {
    const electivoCarreras = await electivoCarreraRepository.find();
    return electivoCarreras;
}

export async function getElectivoCarreraById(id) {
    const electivoCarrera = await electivoCarreraRepository.findOne({where: {id: id}});
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
        queryRunner.rollbackTransaction();
        throw new Error(`Updated ${updateResult?.affected} rows`);
    }
    queryRunner.commitTransaction();
    return updateResult;
}

export async function deleteElectivoCarrera(id) {
    await queryRunner.startTransaction();
    const deleteResult = await electivoCarreraRepository.delete({id: id});
    if (Number(deleteResult?.affected) !== 1) {
        queryRunner.rollbackTransaction();
        throw new Error(`Deleted ${updateResult?.affected} rows`);
    }
    queryRunner.commitTransaction();
    return deleteResult;
}
