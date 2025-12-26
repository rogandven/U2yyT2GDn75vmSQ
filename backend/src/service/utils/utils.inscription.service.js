import { AppDataSource } from "../../config/configDb.js";
import { UserEntity } from "../../entity/user.entity.js";
import ElectivoEntity from "../../entity/electivo.entity.js";
import InscripcionEntity from "../../entity/inscripcion.entity.js";
import { ESTADOS_VALIDOS } from "../../constants/electivo.constants.js";
import { parseUnixDate_ALT } from "../../helpers/date.helper.js";

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

export const isValidDate = async (electivo) => {
    const today = String(parseUnixDate_ALT(Date.now().toString()));
    if (today.localeCompare(apertura) < 0) {
        return true;
    }
    if (today.localeCompare(cierre) > 0) {
        return false;
    }
    const inscripciones = await countInscripciones(electivo.id);
    if (electivo.cupos >= inscripciones) {
        return false;
    }
    return true;
}

export const electivoExists = async (id) => {
    try {
        const electivo = await electivoRepository.findOne({where: {id: id}});
        // console.log(electivo);
        if (!electivo) {
            return false;
        }
        if (electivo.estado !== ESTADOS_VALIDOS.APROBADO) {
            return false;
        }
        if (!(await isValidDate(electivo))) {
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