"use strict";

import HorarioEntity from "../entity/horario.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { findClaseById_electivo, updateHorarioById_Electivo, findAllHorarios, deleteHorarioById_Electivo, doHorariosExist } from "../services/horario.service.js";
import { assignationValidation, integrityValidation, updateValidation } from "../validations/horario.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/response.handlers.js";
import {sendMail} from "../services/email.service.js";
import { getUsers } from "./user.controller.js";
import { getJefeDeCarrera, getUsersFromService } from "../service/user.service.js";

const isValidTimeFormat = (timeStr) => {
    const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!regex.test(timeStr)) return false;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

export async function asignarHorario(req, res) {
  try {
    
    const horarioRepository = AppDataSource.getRepository(HorarioEntity);
    const electivoRepository= AppDataSource.getRepository(ElectivoEntity);
    const { id_electivo } = req.params;
    // console.log(id_electivo);
    if (!id_electivo) {
      return res.status(400).json({ message: "El ID del electivo es obligatorio" });
    }


    const electivo = await electivoRepository.findOneBy({ id: id_electivo});
    if (!electivo) {
      return res.status(404).json({ message: "Electivo no encontrado" });
    }

    
    
    const {hora_inicio, hora_termino, sala, dia } = req.body;

    let result = assignationValidation.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.message });
    }
    result=integrityValidation.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.message });
    }
        
    const existingHorarioSala = await horarioRepository.findOne({
      where: { hora_inicio,hora_termino, sala, dia },
    });
    if (existingHorarioSala)
      return res.status(409).json({ message: "Horario y sala ya registrado." });


    
    const newHorario = horarioRepository.create({
      id_electivo: Number(id_electivo),
      hora_inicio,
      hora_termino,
      sala,
      dia 
    });
    await horarioRepository.save(newHorario);

    console.log("Nuevo horario creado:", JSON.stringify(newHorario));

    if (newHorario && !(await doHorariosExist(id_electivo, newHorario.id_horario))) {
      const JEFES_DE_CARRERA = await getJefeDeCarrera();
      console.log("JEFES DE CARRERA: " + JSON.stringify(JEFES_DE_CARRERA));
      if (JEFES_DE_CARRERA && JEFES_DE_CARRERA.data && JEFES_DE_CARRERA.data.length > 0) {
        JEFES_DE_CARRERA.data.forEach((jefe) => {
          if (jefe.email) {
            const subject = `Se va a impartir el electivo ${electivo.nombre}`;
            const text = `Se ha asignado un nuevo horario al electivo "${electivo.nombre}".\n\nDetalles del horario:\n- Día: ${dia}\n- Hora de inicio: ${hora_inicio}\n- Hora de término: ${hora_termino}\n- Sala: ${sala}\n\nPor favor, revise el sistema para más detalles.`;
            sendMail(jefe.email, subject, text, null);
            // console.log(`Notificación enviada a: ${jefe.email}`);
          }
        });
      } else {
        console.error("No se encontraron jefes de carrera para enviar notificaciones.");
      }
    }

    return res.status(201).json({ message: "Horario registrado exitosamente!", data: newHorario });
  } catch (error) {
    console.error("Error en auth.controller.js -> register(): ", error);
    return res.status(500).json({ message: "Error al registrar el curso" });
  }
}

export function getPublicClass(req, res) {
  handleSuccess(res, 200, "Horarios obtenidas exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export async function getHorarios(req, res) {
  // const clase = req.clase;
  // // console.log(user);
  // // console.log(JSON.stringify(user));
  const horarioData = await findAllHorarios();
  if (!horarioData) {
    return handleErrorClient(res, 400, "Horarios no encontradas");
  }
  // console.log(horarioData);
  return handleSuccess(res, 200, "Horarios obtenidas exitosamente", horarioData);
}
  /* const additionalData = await findClaseById_electivo((clase && clase.id_electivo) || 0);
  if (!additionalData) {
    return handleErrorClient(res, 400, "Clase no encontrado");
  }
  */

  /* handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${clase.id_electivo}! Este es tu clase. Solo tú puedes verlo.`,
    userData: clase,
    additionalData: additionalData
  });
} */

export async function patchHorario(req, res) {
  // const claseId = req.clase.sub;
  const horarioRepository = AppDataSource.getRepository(HorarioEntity);
  const { id } = req.params;
   if(!id){
    return res.status(400).json({ message: "El ID del horario es obligatorio" });
  }
  const { hora_inicio, hora_termino,sala, dia } = req.body;

  const { error } = updateValidation.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const result=integrityValidation.validate(req.body);
  if (result.error) {
    return res.status(400).json({ message: result.error.message });
  }

  const existingHorarioSala = await horarioRepository.findOne({
      where: {  hora_inicio, hora_termino, sala, dia },
    });
    //console.log(existingHorarioSala);
    if (existingHorarioSala && existingHorarioSala.id_horario != id){
      return res.status(409).json({ message: "Horario y sala ya registrado." }); 
    }
      

  try {
    const updatedHorario = await updateHorarioById_Electivo(id, {  hora_inicio, hora_termino, sala, dia });
    console.log(updatedHorario);
    handleSuccess(res, 200, "Horario actualizado exitosamente", updatedHorario)
    // console.log(profesor);
  } catch (error) {
    handleErrorClient(res, 500, "Error al actualizar el horario.", error.message);
  } 
}


export async function deleteHorario(req, res) {
  // const claseId = req.clase.sub;
  const horarioRepository= AppDataSource.getRepository(HorarioEntity); 
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "El ID del horario es obligatorio" });
  }
  // console.log(id);
  try {
    await deleteHorarioById_Electivo(id);
    handleSuccess(res, 200, "Horario eliminado exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar el horario", error.message);
  }
}

export async function sendEmailToJefe(subject, text) {
  /*
  try {
      let correosEnviados = 0;
      let correosEsperados = null;
      const users = await getJefeDeCarrera();
      if (!users) {
        return;
      }
      correosEsperados = users.length;
      users.map((user) => {
        console.log(JSON.stringify(user));
        try {
          if (user.data && user.data.email) {
            sendMail(user.data.email, subject, text);
            console.log("Correo electrónico enviado a:", user.data.email);
            correosEnviados++;
          } else {
            console.error("El usuario no tiene un correo electrónico válido:", user);
            return;
          }
        } catch (error) {
          console.error("Error al enviar correo electrónico a:", user.data.email, error);
        }
      });
      return handleSuccess(res, 200, "Correos electrónicos enviados exitosamente");
  }catch (error) {
      console.error("Error al obtener jefes para enviar correos electrónicos:", error);
  }
  */

  // TA MALO
}

    // Lógica para enviar correos electrónicos a los usuarios
    // Puedes utilizar una biblioteca como nodemailer para enviar correos electrónicos

    // Ejemplo básico (debes configurar el transporte y los detalles del correo):
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {*/


