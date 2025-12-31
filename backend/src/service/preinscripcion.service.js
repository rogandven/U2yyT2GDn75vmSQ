"use strict";

import { AppDataSource } from "../config/configDb.js";
import preinscripcionEntity from "../entity/Preinscripcion.entity.js";

const preinscripcionRepository = AppDataSource.getRepository(preinscripcionEntity);
const queryRunner = AppDataSource.createQueryRunner();

export async function getPreinscripciones() {
    const preinscripciones = await preinscripcionRepository.find();
    return preinscripciones;
}

export async function getPreinscripcionById(id) {
    const preinscripcion = await preinscripcionRepository.findOne({where: {id: id}});
    return preinscripcion;
}

export async function createPreinscripcion(data) {
    const preinscripcion = await preinscripcionRepository.save(preinscripcionRepository.create(data));
    return preinscripcion;
}

export async function updatePreinscripcion(id, data) {
    await queryRunner.startTransaction();
    const updateResult = await preinscripcionRepository.update({id: id}, data);
    if (Number(updateResult?.affected) !== 1) {
        queryRunner.rollbackTransaction();
        throw new Error(`Updated ${updateResult?.affected} rows`);
    }
    queryRunner.commitTransaction();
    return updateResult;
}

export async function deletePreinscripcion(id) {
    await queryRunner.startTransaction();
    const deleteResult = await preinscripcionRepository.delete({id: id});
    if (Number(deleteResult?.affected) !== 1) {
        queryRunner.rollbackTransaction();
        throw new Error(`Deleted ${updateResult?.affected} rows`);
    }
    queryRunner.commitTransaction();
    return deleteResult;
}
