/*
import { AppDataSource } from "../../config/configDb.js";
import { UserEntity } from "../../entity/user.entity.js";
import ElectivoEntity from "../../entity/electivo.entity.js";
import InscripcionEntity from "../../entity/inscripcion.entity.js";
import { ESTADOS_VALIDOS } from "../../constants/electivo.constants.js";
import { parseUnixDate_ALT } from "../../helpers/date.helper.js";
import { APPROVED, VALID_STATUS_ARRAY } from "../../constants/inscripcion.constants.js";

const userRepository = AppDataSource.getRepository(UserEntity);
const electivoRepository = AppDataSource.getRepository(ElectivoEntity);
const inscripcionRepo = AppDataSource.getRepository(InscripcionEntity);

export const userExists = async (id) => {
    try {
        const usuario = await userRepository.findOneBy({id: id});
        // console.log(usuario);
        if (!usuario) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}


export const inscripcionAlreadyExists = async (id_inscripcion, id_usuario, id_electivo) => {
    try {
        let inscripciones = await inscripcionRepo.find({where: {id_usuario: id_usuario, id_electivo: id_electivo}});
        if (id_inscripcion !== null) {
            inscripciones = inscripciones.filter((inscripcion) => {
                return Number(inscripcion.id_inscripcion) !== Number(id_inscripcion);
            });
        }
        return inscripciones.length !== 0;
    } catch (error) {
        console.error(error);
        return true;
    }
}

export const formatMessage = (data, message) => {
    return {
        data: Object(data),
        message: String(message),
    }
}

export const inscripcionBelongsToUser = (inscripcion, id_usuario) => {
    return inscripcion.id_usuario === id_usuario;
}

export const countInscripciones = async (id_electivo) => {
    try {
        const cantidad = await inscripcionRepo.count({where: {id_electivo: id_electivo}});
        return Number(cantidad);
    } catch (error) {
        return 9999;
    }
}

export const countInscripcionesAprobadas = async (id_electivo) => {
    try {
        const cantidad = await inscripcionRepo.count({where: {id_electivo: id_electivo, estado: APPROVED}});
        return Number(cantidad);
    } catch (error) {
        return 9999;
    }
}

export const countInscripcionesByUser = async (id_usuario) => {
    try {
        const cantidad = await inscripcionRepo.count({where: {id_usuario: id_usuario}});
        return Number(cantidad);
    } catch (error) {
        return 9999;
    }
}*/

"use strict";

import { AppDataSource } from "../../config/configDb.js";
import { UsuarioEntity } from "../../entity/usuario.entity.js";
import { ElectivoEntity } from "../../entity/electivo.entity.js";
import { PreinscripcionEntity } from "../../entity/preinscripcion.entity.js";
import { ESTADO_PREINSCRIPCION } from "../../constants/preinscripcion.constants.js";

const userRepository = AppDataSource.getRepository(UsuarioEntity);
const electivoRepository = AppDataSource.getRepository(ElectivoEntity);
const inscripcionRepo = AppDataSource.getRepository(PreinscripcionEntity);


export const userExists = async (id) => {
    try {
        const usuario = await userRepository.findOneBy({ id });
        return Boolean(usuario);
    } catch {
        return false;
    }
};

export const electivoExistsAndApproved = async (id_electivo) => {
    try {
        const electivo = await electivoRepository.findOneBy({ id_electivo });
        if (!electivo) return false;
        return electivo.estado === "APROBADO";
    } catch {
        return false;
    }
};

export const inscripcionAlreadyExists = async (usuarioId, electivoId) => {
    try {
        const count = await inscripcionRepo.count({
            where: {
                usuario: { id: usuarioId },
                electivo: { id_electivo: electivoId },
            },
        });
        return count > 0;
    } catch {
        return true;
    }
};

export const countInscripciones = async (id_electivo) => {
    try {
        return await inscripcionRepo.count({
            where: {
                electivo: { id_electivo },
            },
        });
    } catch {
        return 9999;
    }
};


export const countInscripcionesAprobadas = async (id_electivo) => {
    try {
        return await inscripcionRepo.count({
            where: {
                electivo: { id_electivo },
                estado: ESTADO_PREINSCRIPCION.APROBADA,
            },
        });
    } catch {
        return 9999;
    }
};

export const countInscripcionesByUser = async (id_usuario) => {
    try {
        return await inscripcionRepo.count({
            where: {
                usuario: { id: id_usuario },
            },
        });
    } catch {
        return 9999;
    }
};
