"use strict";

import { AppDataSource } from "../config/configDb.js";
import horarioEntity from "../entity/horario.entity.js";
import { queryRunner } from "./utils/utils.service.js";

export const horarioRepository = AppDataSource.getRepository(horarioEntity);

export async function getHorarios() {
    const horarios = await horarioRepository.find({relations: {electivo: true}});
    return horarios;
}

export async function getHorarioById(id) {
    const horario = await horarioRepository.findOne({where: {id: id}, relations: {electivo: true}});
    return horario;
}

export async function createHorario(data) {
    const horario = await horarioRepository.save(horarioRepository.create(data));
    return horario;
}

export async function updateHorario(id, data) {
    await queryRunner.startTransaction();
    const updateResult = await horarioRepository.update({id: id}, data);
    if (Number(updateResult?.affected) !== 1) {
        await queryRunner.rollbackTransaction();
        throw new Error(`Updated ${updateResult?.affected} rows`);
    }
    await queryRunner.commitTransaction();
    return updateResult;
}

export async function deleteHorario(id) {
    await queryRunner.startTransaction();
    const deleteResult = await horarioRepository.delete({id: id});
    if (Number(deleteResult?.affected) !== 1) {
        await queryRunner.rollbackTransaction();
        throw new Error(`Deleted ${updateResult?.affected} rows`);
    }
    await queryRunner.commitTransaction();
    return deleteResult;
}
