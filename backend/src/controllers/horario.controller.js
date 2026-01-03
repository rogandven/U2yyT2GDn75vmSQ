"use strict";
import { assignationValidation, integrityValidation, updateValidation, validateHourBusiness, validateHourIntegrity } from "../validations/horario.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/response.handlers.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { electivoExists, RAW_getElectivoById } from "../service/electivo.service.js";
import { createHorario, findAllHorarios, getConflictingHorarios, deleteHorarioById_Electivo, isFirstHorario } from "../services/horario.service.js";
import { getHorario, updateHorarioById_Electivo } from "../services/horario.service.js";
import { HORARIO_NO_ENCONTRADO } from "../constants/horarioConstants.js";
import { getElectivoName } from "./electivo.controller.js";
import { EMAIL_getAllCareerChiefs, getUserByIdFromService } from "../service/user.service.js";
import { sendMail } from "../services/email.service.js";
import {getControllerResult_NEW} from "./utils/utils.controller.js";
import {getElectivoByIdFromService} from "../service/electivo.service.js"

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
    if (result.error) {
      return String(result.error.message);
    }
    result=integrityFunction.validate(body);
    if (result.error) {
      return String(result.error.message);
    }
    return null;
}

const electivoExistanceCheckerHelper = async (id_electivo) => {
    const electivoReallyExists = (await electivoExists(id_electivo));

    if (electivoReallyExists === null) {
      return {message: String("Error interno del servidor"), status: 500};
    }
    if (electivoReallyExists === false) {
      return {message: String("Electivo no encontrado"), status: 400};
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
    const { id_electivo } = req.params;
    let validationResult = idValidation.validate({id: id_electivo});
    if (validationResult.error) {
      return res.status(400).json({message: validationResult.error?.message || "ID inválido"});
    }
    const electivo = await RAW_getElectivoById(id_electivo);
    validationResult = joiValidationHelper(assignationValidation, integrityValidation, req.body);
    if (validationResult) {
      return res.status(400).json({message: validationResult});
    }
    let result = timeValidationHelper(req.body.hora_inicio, req.body.hora_termino);
    if (result) {
      return res.status(400).json({ message: String(result) });
    } 
    const electivoReallyExists = await electivoExistanceCheckerHelper(id_electivo);
    if (electivoReallyExists) {
      return res.status(electivoReallyExists.status).json({message: electivoReallyExists.message});
    }

    const { hora_inicio, hora_termino, sala, dia } = req.body;
    const user =getUserByIdFromService(4);

    const existingHorarioSala = await getConflictingHorarios(hora_inicio, hora_termino, sala, dia);
    if (existingHorarioSala.length > 0) {
      return res.status(409).json({ message: "Horario y sala ya registrados.", conflicts: existingHorarioSala });
    }
    
    if (await isFirstHorario(id_electivo)) {
      const chiefs = await EMAIL_getAllCareerChiefs(req.user.carrera || req.user.career);
      const nombre = String(electivo?.nombre || "Electivo desconocido");

      chiefs.forEach((chief) => {
        sendMail(chief.email, "Confirmación", `El electivo ${nombre.toUpperCase()} va a ser impartido por ${String(req.user.fullname || req.user.username || "Profesor desconocido").toUpperCase()}. Por favor, revise el sistema.`);
      });
    }


    if (newHorario = await createHorario(id_electivo, hora_inicio, hora_termino, sala, dia)) {
      const subject = " Nueva propuesta de electivo";
      const mensaje = `
      Buenas tardes hago envío de este mensaje para pedir que se realize el electivo ${electivo.nombre}, esperando su respuesta
      se despide atentamente 
      `
      const mensajeHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b00, #ff8c00); color: white; padding: 25px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Mensaje para electivos</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema de Rally</p>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #ff6b00; margin-top: 0;">${electivo.nombre}</h2>

          <div style="background-color: #fff3e0; border-left: 4px solid #ff6b00; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>📍 Lugar:</strong> ${evento.lugar}</p>
            <p style="margin: 10px 0 0 0; color: #555;">${mensaje}</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              Atentamente,<br><strong>profesor ubb</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    // Enviar correo a cada usuario
    const promesasEmail = user.map(async (user) => {
      if (user.email) {
        try {
          await sendEmail(
            user.email,
            subject,
            mensaje,
            mensajeHTML
          );
          console.log(`✓ Email enviado a: ${user.email}`);
        } catch (error) {
          console.error(`✗ Error enviando email a ${user.email}:`, error.message);
        }
      }
    });

    // Esperar a que todos los correos se envíen
    await Promise.all(promesasEmail);
      return res.status(201).json({ message: "Horario registrado exitosamente!", data: newHorario });
    } else {
      return res.status(500).json({message: "Error al registrar horario"});
    }
  } catch (error) {
    console.error("Error en auth.controller.js -> register(): ", error);
    return res.status(500).json({ message: "Error al registrar el horario" });
  }
}

export async function getHorariosByIdElectivo(req, res) {
    const { id_electivo } = req.params;
    const validationResult = idValidation.validate({id_electivo: id_electivo});
    if (validationResult.error) {
      return res.status(400).json(getControllerResult_NEW(validationResult.error.message, null));
    }
    const serviceResult = await getElectivoByIdFromService(id_electivo);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult_NEW(serviceResult.details, serviceResult));
    }
    return res.status(200).json(getControllerResult_NEW(serviceResult.details, serviceResult));
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
    validationResult = joiValidationHelper(updateValidation, integrityValidation);
    if (validationResult) {
      return res.status(400).json({message: String(validationResult)});
    }

    const horarioToUpdate = await getHorario(id);
    if (!horarioToUpdate) {
      return handleErrorClient(res, 404, "Horario no encontrado");
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

export async function getElectivoById(id_electivo) {
try {
    const electivos = await electivoRepo.findOne({ where: { id: id_instancia } });

    if (!electivos) {
        return getServiceResult(false, null, "Electivo no encontrado", 0);
    }

    return getServiceResult(false, electivos, "Electivo encontrado", 1);
  } catch (error) {
    console.error("Error en electivo.controller.js -> getUserById(): ", error);
    return getServiceResult(true, null, error.message? error.message : "Error al encontrar electivo", 0);
  }
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



