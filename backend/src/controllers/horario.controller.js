/*
"use strict";
import { assignationValidation, integrityValidation, updateValidation, validateHourBusiness, validateHourIntegrity } from "../validations/horario.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/response.handlers.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { electivoExists, RAW_getElectivoById } from "../service/electivo.service.js";
import { createHorario, findAllHorarios, getConflictingHorarios, deleteHorarioById_Electivo, isFirstHorario } from "../services/horario.service.js";
import { getHorario, updateHorarioById_Electivo } from "../services/horario.service.js";
import { HORARIO_NO_ENCONTRADO } from "../constants/horarioConstants.js";
import { getElectivoName } from "./electivo.controller.js";
import { EMAIL_getAllCareerChiefs } from "../service/user.service.js";
import sendMail from "../services/email.service.js";
import { ADMIN_ROLE, CAREER_HEAD_ROLE } from "../constants/user.constants.js";


const processHorarioArray = async (array) => {
  let current = null;
  if (Array.isArray(array)) {
    for (let i = 0; i < array.length; i++) {
      try {
        current = String(await getElectivoName(array[i].id_electivo));
        array[i].nombre_electivo = current;
      } catch (error) {}
    }
  }
}

const isValidTimeFormat = (timeStr) => {
    const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!regex.test(timeStr)) return false;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

const timeValidationHelper = (hora_inicio, hora_termino) => {
  let result = validateHourIntegrity(hora_inicio, "hora de inicio");
  if (result) {
    return String(result);
  }
  result = validateHourIntegrity(hora_termino, "hora de termino");
  if (result) {
    return String(result);
  }
  result = validateHourBusiness(hora_inicio, hora_termino);
  if (result) {
    return String(result);
  }
  return null;
} 

const joiValidationHelper = (validationFunction, integrityFunction, body) => {
    let result = validationFunction.validate(body);
    // console.log(result);
    if (result.error) {
      return String(result.error.message);
    }
    result=integrityFunction.validate(body);
    // console.log(result);
    if (result.error) {
      return String(result.error.message);
    }
    return null;
}



export async function asignarHorario(req, res) {
  try {
    let newHorario = null;
    if (!req.body || !req.params) {
      return res.status(400).json({ message: "Datos no proporcionados"});
    }
    if (req.body.dia) {
      req.body.dia = String(req.body.dia).toLowerCase().trim();
    }
    if (req.body.dia === "día" || req.body.dia === "dia") {
      return res.status(400).json({ message: "Debe seleccionar un día de la semana"});
    }
    const { id_electivo } = req.params;
    let validationResult = idValidation.validate({id: id_electivo});
    if (validationResult.error) {
      return res.status(400).json({message: validationResult.error?.message || "ID inválido"});
    }
    validationResult = joiValidationHelper(assignationValidation, integrityValidation, req.body);
    if (validationResult) {
      return res.status(400).json({message: validationResult});
    }
    let result = timeValidationHelper(req.body.hora_inicio, req.body.hora_termino);
    if (result) {
      return res.status(400).json({ message: String(result) });
    } 

    const electivo = await RAW_getElectivoById(id_electivo);
    console.log(electivo);
    if (!electivo) {
      return handleErrorClient(res, 404, "Electivo no encontrado");
    }

    const canSkipChecks = ((req.user.role || req.user.rol) === ADMIN_ROLE);

    console.log(req.user.id);
    console.log(electivo.id_profesor);
    console.log(electivo.carreras);
    console.log(req.user.carrera);

    if (!canSkipChecks) {
       if (!(String(electivo.carreras).split(",").includes(req.user.carrera))) {
        return handleErrorClient(res, 401, "Debe pertenecer a una de las carreras del electivo");
       }
      if ((req.user.role !== CAREER_HEAD_ROLE) && (req.user.id !== electivo.id_profesor)) {
        return handleErrorClient(res, 401, "No puede crear un horario para un electivo que no es suyo");
      }
    }

    const { hora_inicio, hora_termino, sala, dia } = req.body;

    const existingHorarioSala = await getConflictingHorarios(hora_inicio, hora_termino, sala, dia);
    if (existingHorarioSala.length > 0) {
      return res.status(409).json({ message: "Horario y sala ya registrados.", conflicts: existingHorarioSala });
    }
    
    if (await isFirstHorario(id_electivo)) {
      const chiefs = await EMAIL_getAllCareerChiefs(req.user.carrera || req.user.career);
      const electivo = await RAW_getElectivoById(id_electivo);
      const nombre = String(electivo?.nombre || "Electivo desconocido");

      chiefs.forEach((chief) => {
        sendMail(chief.email, "Confirmación", `El electivo ${nombre.toUpperCase()} va a ser impartido por ${String(req.user.fullname || req.user.username || "Profesor desconocido").toUpperCase()}. Por favor, revise el sistema.`);
      });
    }


    if (newHorario = await createHorario(id_electivo, hora_inicio, hora_termino, sala, dia)) {
      return res.status(201).json({ message: "Horario registrado exitosamente!", data: newHorario });
    } else {
      return res.status(500).json({message: "Error al registrar horario"});
    }
  } catch (error) {
    console.error("Error en auth.controller.js -> register(): ", error);
    return res.status(500).json({ message: "Error al registrar el horario" });
  }
}

export async function patchHorario(req, res) {
  try {
    if (!req || !req.params || !req.body) {
      return res.status(400).json({message: "Datos no proporcionados"});
    }
    const { id } = req.params;
    if(!id){
      return res.status(400).json({ message: "El ID del horario es obligatorio" });
    }
    let validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
      return res.status(400).json({message: validationResult.error?.message || "ID inválido"});
    }

    if (req.body.dia) {
      req.body.dia = String(req.body.dia).toLowerCase().trim();
    }
    if (req.body.dia === "día" || req.body.dia === "dia") {
      return res.status(400).json({ message: "Debe seleccionar un día de la semana"});
    }

    validationResult = joiValidationHelper(updateValidation, integrityValidation, req.body);
    // console.log(validationResult);
    if (validationResult) {
      return res.status(400).json({message: String(validationResult)});
    }

    const horarioToUpdate = await getHorario(id);
    if (!horarioToUpdate) {
      return handleErrorClient(res, 404, "Horario no encontrado");
    }
    const electivo = await RAW_getElectivoById(horarioToUpdate.id_electivo);
    if (!electivo) {
      return handleErrorClient(res, 404, "Electivo no encontrado");
    }

    const canSkipChecks = ((req.user.role || req.user.rol) === ADMIN_ROLE);

    if (!canSkipChecks) {
       if (!(String(electivo.carreras).split(",").includes(req.user.carrera))) {
        return handleErrorClient(res, 401, "Debe pertenecer a una de las carreras del electivo");
       }
      if (((req.user.role || req.user.rol) !== CAREER_HEAD_ROLE) && (req.user.id !== electivo.id_profesor)) {
        return handleErrorClient(res, 401, "No puede crear un horario para un electivo que no es suyo");
      }
    }
    
    Object.assign(horarioToUpdate, req.body);

    let result = timeValidationHelper(horarioToUpdate.hora_inicio, horarioToUpdate.hora_termino);
    if (result) {
      return res.status(400).json({ message: String(result) });
    } 

    let existingHorarioSala = await getConflictingHorarios(horarioToUpdate.hora_inicio, horarioToUpdate.hora_termino, horarioToUpdate.sala, horarioToUpdate.dia);
    existingHorarioSala = existingHorarioSala.filter((horario) => {
      return Number(horario.id_horario) !== Number(horarioToUpdate.id_horario);
    });
    
    if (existingHorarioSala.length > 0) {
      return res.status(409).json({ message: "Horario y sala ya registrados.", conflicts: existingHorarioSala });
    }
    const updatedHorario = await updateHorarioById_Electivo(horarioToUpdate);
    if (!(updatedHorario.data)) {
      if (!(updatedHorario.error)) {
        return handleErrorClient(res, 500, updatedHorario.message);
      }
      return handleErrorClient(res, 400, updatedHorario.message);
    }
    return handleSuccess(res, 200, "¡Horario actualizado con éxito!", updatedHorario.data);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor", error);
  }
}

export function getPublicClass(req, res) {
  handleSuccess(res, 200, "Horarios obtenidas exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export async function getHorarios(req, res) {
  const horarioData = await findAllHorarios();
  if (!horarioData) {
    return handleErrorClient(res, 400, "Horarios no encontrados");
  }
  await processHorarioArray(horarioData);
  return handleSuccess(res, 200, "Horarios obtenidos exitosamente", horarioData);
}

export async function deleteHorario(req, res) {
  try {  
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "El ID del horario es obligatorio" });
    }
    let validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
      return handleErrorClient(res, 400, validationResult.error.message);
    }


    const result = await deleteHorarioById_Electivo(id);
    if (result && result.result && result.result.affected >= 1) {
      return handleSuccess(res, 200, "Horario eliminado exitosamente", result);
    }
    if (result.message === HORARIO_NO_ENCONTRADO) {
      return handleErrorClient(res, 404, result.message, result.result);
    }
    return handleErrorClient(res, 400, result.message, result.result);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al eliminar el horario", error.message);
  }
}
*/

"use strict";

import { AppDataSource } from "../config/configDb.js";
import { HorarioEntity } from "../entity/horario.entity.js";
import { ElectivoEntity } from "../entity/electivo.entity.js";
import { getControllerResult_NEW } from "./utils/utils.controller.js";

/**
 * Asignar (crear) un horario a un electivo
 * POST /horario/:id_electivo
 */
export async function asignarHorario(req, res) {
  try {
    const { id_electivo } = req.params;
    const { dia, hora_inicio, hora_termino, sala } = req.body;

    const electivoRepo = AppDataSource.getRepository(ElectivoEntity);
    const horarioRepo = AppDataSource.getRepository(HorarioEntity);

    const electivo = await electivoRepo.findOneBy({ id_electivo });
    if (!electivo) {
      return res.status(404).json({ message: "Electivo no encontrado" });
    }

    const horario = horarioRepo.create({
      dia,
      hora_inicio,
      hora_termino,
      sala,
      electivo,
    });

    await horarioRepo.save(horario);

    return getControllerResult_NEW(
      res,
      201,
      "Horario asignado correctamente",
      horario
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al asignar horario" });
  }
}

/**
 * Obtener horarios (todos o por electivo)
 * GET /horario
 * GET /horario/:id_electivo
 */
export async function getHorarios(req, res) {
  try {
    const { id_electivo } = req.params;
    const horarioRepo = AppDataSource.getRepository(HorarioEntity);

    const where = id_electivo
      ? { electivo: { id_electivo } }
      : {};

    const horarios = await horarioRepo.find({
      where,
      relations: { electivo: true },
    });

    return getControllerResult_NEW(
      res,
      200,
      "Horarios obtenidos correctamente",
      horarios
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener horarios" });
  }
}

/**
 * Actualizar horario
 * PATCH /horario/:id
 */
export async function patchHorario(req, res) {
  try {
    const { id } = req.params;
    const horarioRepo = AppDataSource.getRepository(HorarioEntity);

    const horario = await horarioRepo.findOneBy({ id });
    if (!horario) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    Object.assign(horario, req.body);
    await horarioRepo.save(horario);

    return getControllerResult_NEW(
      res,
      200,
      "Horario actualizado correctamente",
      horario
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar horario" });
  }
}

/**
 * Eliminar horario
 * DELETE /horario/:id
 */
export async function deleteHorario(req, res) {
  try {
    const { id } = req.params;
    const horarioRepo = AppDataSource.getRepository(HorarioEntity);

    const horario = await horarioRepo.findOneBy({ id });
    if (!horario) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    await horarioRepo.remove(horario);

    return getControllerResult_NEW(
      res,
      200,
      "Horario eliminado correctamente"
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar horario" });
  }
}

