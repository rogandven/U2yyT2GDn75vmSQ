"use strict";

import { APPROVED, AWAITING, REJECTED } from "../constants/inscripcion.constants.js";
import { createInscripcion, deleteInscripcion, getInscripcion, getInscripciones, inscripcionAlreadyExists, isInvalidInscripcion, updateInscripcion } from "../service/inscripcion.service.js";
import { userExists as _userExists } from "../service/utils/utils.inscription.service.js";
import { createValidation, integrityValidation, updateValidation } from "../validations/inscripcion.validation.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { validationFunctionHelper } from "./utils/utils.controller.js";
import { getElectivoName } from "./electivo.controller.js";
import { getUserNameById } from "./user.controller.js";
import { BASE_CASE } from "../service/utils/utils.service.js";

const processInscripcionArray = async (array) => {
    let current = null;
    if (Array.isArray(array)) {
        for (let i = 0; i < array.length; i++) {
            try {
                current = String(await getElectivoName(array[i].id_electivo));
                array[i].nombre_electivo = current;
                current = String(await getUserNameById(array[i].id_usuario));
                array[i].nombre_usuario = current;
            } catch (error) {}
        }   
    }
}

const getGenericResult = (data, message) => {
    return {data, message};
}

const getGenericError = (res) => {
    return res.status(500).json({data: null, message: "Error interno del servidor"});
}

const invalidResult = (result) => {
    return (!result || !result.data || !result.data.length);
}

export const private_getInscripciones = async (req, res) => {
    try {
        const result = await getInscripciones();
        if (invalidResult(result) || result.data.length <= 0) {
            result.message = "No hay inscripciones para mostrar";
            return res.status(204).json(result);
        }
        await processInscripcionArray(result.data);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}

export const private_getInscripcionesByUser = async (req, res) => {
    const idValidationResult = idValidation.validate(req.params);
    if (idValidationResult.error) {
        return res.status(400).json(getGenericResult(null, idValidationResult.error.message));
    }
    const userExists = await _userExists(req.params.id);
    if (!userExists) {
        return res.status(404).json(getGenericResult(null, "Usuario no encontrado"));
    }

    try {
        let result = await getInscripciones();
        if (invalidResult(result)) {
            result.message = "No hay inscripciones para mostrar";
            return res.status(204).json(result);
        }
        result.data = result.data.filter((inscripcion) => {
            return inscripcion.id_usuario === req.params.id;
        });
        if (result.data.length <= 0) {
            return res.status(204).json(result);
        }
        await processInscripcionArray(result.data);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}   

const getInscripcionHelper = async (req) => {
    const idValidationResult = idValidation.validate(req.params);
    if (idValidationResult.error) {
        return {code: 400, json: getGenericResult(null, idValidationResult.error.message)}
    }

    try {
        let result = await getInscripcion(req.params.id);
        if (!result || (await isInvalidInscripcion(result.data))) {
            return {code: 404, json: getGenericResult(null, "Inscripción no encontrada")}
        }
        await processInscripcionArray([result.data]);
        return {code: 200, json: result}
    } catch (error) {
        console.error(error);
        return {code: 500, json: {data: null, message: "Error interno del servidor"}};
    }
}

export const private_getInscripcion = async (req, res) => {
    const result = await getInscripcionHelper(req);
    return res.status(result.code).json(result.json);
}

export const private_getInscripcionesSinAprobar = async (req, res) => {
    try {
        let result = await getInscripciones();
        if (invalidResult(result)) {
            result.message = "No hay inscripciones para mostrar";
            return res.status(204).json(result);
        }
        result.data = result.data.filter((inscripcion) => {
            return inscripcion.estado === AWAITING;
        });
        await processInscripcionArray(result.data);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}

const createInscriptionHelper = async (req, res) => {
    try {
        const validationResult = validationFunctionHelper([integrityValidation, createValidation], req.body);
        if (validationResult) {
            return res.status(400).json(getGenericResult(null, validationResult));
        }
        if (await isInvalidInscripcion(req.body)) {
            return res.status(404).json(getGenericResult(null, "Usuario o electivo no encontrado"));
        }
        if (await inscripcionAlreadyExists(null, req.body.id_usuario, req.body.id_electivo)) {
            return res.status(409).json(getGenericResult(null, "Ya existe esta inscripción"));
        }
        const inscripcionCreada = await createInscripcion(req.body);
        if (inscripcionCreada && inscripcionCreada.data) {
            return res.status(200).json(inscripcionCreada);
        }
        return getGenericError(res);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}

export const private_createInscripcion = async (req, res) => {
    if (!req.body) {
        return res.status(400).json(getGenericResult(null, "Datos no proporcionados"));
    }
    req.body.estado = APPROVED;
    return await createInscriptionHelper(req, res);
}

const updateInscriptionHelper = async (req, res, id_checks) => {
    try {
        const idValidationResult = idValidation.validate(req.params);
        if (idValidationResult.error) {
            return res.status(400).json(getGenericResult(null, idValidationResult.error.message));
        }
        const validationResult = validationFunctionHelper([integrityValidation, updateValidation], req.body);
        if (validationResult) {
            return res.status(400).json(getGenericResult(null, validationResult));
        }
        const rawInscripcion = await getInscripcion(req.params.id);
        if (!(rawInscripcion.data && rawInscripcion.data.id_inscripcion)) {
            return res.status(400).json(getGenericResult(null, "Inscripción no encontrada"));
        }

        if (id_checks && (rawInscripcion.data.id_usuario !== req.user.id)) {
            return res.status(401).json(getGenericResult(null, "No se puede editar la inscripción de otro usuario"));
        }
        if (id_checks && (req.body.id_usuario !== req.user.id)) {
            return res.status(401).json(getGenericResult(null, "No se puede inscribir a otro alumno"));
        }     

        const editedInscripcion = {
            id_electivo: (req.body.id_electivo || rawInscripcion.data.id_electivo), 
            id_usuario: (req.body.id_usuario || rawInscripcion.data.id_usuario)
        };

        // console.log(editedInscripcion);
        if (await isInvalidInscripcion(editedInscripcion)) {
            return res.status(404).json(getGenericResult(null, "Usuario o electivo no encontrado"));
        }
        if (await inscripcionAlreadyExists(req.params.id, editedInscripcion.id_usuario, editedInscripcion.id_electivo)) {
            return res.status(409).json(getGenericResult(null, "Ya existe esta inscripción"));
        }
        const inscripcionCreada = await updateInscripcion(req.body, {id_inscripcion: req.params.id});
        if (inscripcionCreada && inscripcionCreada.data) {
            return res.status(200).json(inscripcionCreada);
        }
        return getGenericError(res);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}

export const private_updateInscripcion = async (req, res) => {
    return await updateInscriptionHelper(req, res, false);
}

const deleteInscripcionHelper = async (req, res, id_checks) => {
    try {
        const idValidationResult = idValidation.validate(req.params);
        if (idValidationResult.error) {
            return res.status(400).json(getGenericResult(null, idValidationResult.error.message));
        }
        const inscripcion = await getInscripcion(req.params.id);
        if (!(inscripcion.data) || !(inscripcion.data.id_inscripcion)) {
            return res.status(404).json(getGenericResult(null, "Inscripción no encontrada"));
        }
        if (id_checks && (inscripcion.data.id_usuario !== req.user.id)) {
            return res.status(401).json(getGenericResult(null, "No es posible eliminar una inscripción que no es tuya"));
        }
        const deletedInscripcion = await deleteInscripcion(inscripcion.data);
        return res.status(200).json(deletedInscripcion);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}

export const private_deleteInscripcion = async (req, res) => {
    return deleteInscripcionHelper(req, res, false);
}

const changeInscriptionStatusHelper = async (req, res, status) => {
    try {
        if (req.body) {
            return res.status(400).json(getGenericResult(null, "No se pueden pasar parámetros a este endpoint"));
        }
        req.body = {estado: status};
        return private_updateInscripcion(req, res);
    } catch (error) {
        console.error(error);
        return getGenericError(res); 
    }
} 

export const private_approveInscripcion = async (req, res) => {
    return await changeInscriptionStatusHelper(req, res, APPROVED);
}

export const private_rejectInscripcion = async (req, res) => {
    return await changeInscriptionStatusHelper(req, res, REJECTED);
}

export const public_getInscripcion = async (req, res) => {
    const result = await getInscripcionHelper(req);
    if (result.json.data && (result.json.data.id_usuario === req.user.id)) {
        return res.status(result.code).json(result.json);
    }
    return res.status(401).json({message: "Acceso denegado", data: null});
}

export const public_getInscripcionesByUser = async (req, res) => {
    try {
        let result = await getInscripciones();
        if (invalidResult(result)) {
            result.message = "No hay inscripciones para mostrar";
            return res.status(204).json(result);
        }
        result.data = result.data.filter((inscripcion) => {
            return inscripcion.id_usuario === req.user.id;
        });
        await processInscripcionArray(result.data);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}

export const public_createInscripcion = async (req, res) => {
    if (!req.body) {
        return res.status(400).json(getGenericResult(null, "Datos no proporcionados"));
    }
    if (req.body.id_usuario) {
        return res.status(401).json(getGenericResult(null, "No se puede crear una inscripción para otro usuario"));
    }
    if (req.body.estado) {
        return res.status(401).json(getGenericResult(null, "No se puede autoasignar un estado"));
    }
    req.body.id_usuario = req.user.id;
    req.body.estado = AWAITING;
    return await createInscriptionHelper(req, res);
}

export const public_updateInscripcion = async (req, res) => {
    if (!req.body) {
        return res.status(400).json(getGenericResult(null, "Datos no proporcionados"));
    }
    req.body.estado = AWAITING;
    req.body.id_usuario = req.user.id;
    return await updateInscriptionHelper(req, res, true);
}

export const public_deleteInscripcion = async (req, res) => {
    return deleteInscripcionHelper(req, res, true);
}