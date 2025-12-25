"use strict";

import { AppDataSource } from "../config/configDb.js";
import InscripcionEntity from "../entity/inscripcion.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import {inscripcionValidation,cancelarInscripcionValidation,gestionarInscripcionValidation,consultarInscripcionesValidation,inscripcionesEnEsperaValidation} from "../validations/inscripcion.validation.js";

export async function CreateInscripciones(req, res) {
  try {
    const { error } = inscripcionValidation.validate(req.params);

    if (error) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.details.map(e => e.message)
      });
    }

    const inscripcionRepository = AppDataSource.getRepository(InscripcionEntity);
    const electivoRepository = AppDataSource.getRepository(ElectivoEntity);

    const { electivoId } = req.params;
    const userId = req.user.id;

    const electivo = await electivoRepository.findOne({ where: { id: electivoId, } });
    console.log(electivo);
    if (!electivo) {
      return res.status(404).json({ message: "Electivo no encontrado" });
    }
    

    const inscripcionExistente = await inscripcionRepository.findOne({
      where: { 
        userId: userId,
        electivoId: electivoId
      }
    });

    if (inscripcionExistente && inscripcionExistente.estado !=="retirada") {
      return res.status(400).json({ 
        message: "Ya tienes una solicitud de inscripción para este electivo",
        estado: inscripcionExistente.estado
      });
    }

    const inscripcionesActivas = await inscripcionRepository.count({
      where: { electivoId: electivoId, estado: "activa" }
    });

    let estadoDetalle = "";
    let enListaEspera = false;

    if (inscripcionesActivas >= electivo.cupos) {
      estadoDetalle = "En lista de espera: No hay cupos disponibles. Pendiente de revisión";
      enListaEspera = true;
    } else {
      estadoDetalle = "Pendiente de revisión";
    }

    const nuevaInscripcion = inscripcionRepository.create({
      electivoNombre: electivo.nombreEl,
      userId: userId,
      electivoId: electivoId,
      electivoNombre: electivo.nombre,
      estado: "en_espera",
      estadoDetalle: estadoDetalle,
      periodo: electivo.periodo
    });

    await inscripcionRepository.save(nuevaInscripcion);
    
    res.status(201).json({
      message: "Solicitud de inscripción enviada exitosamente",
      data: {
        inscripcion: nuevaInscripcion,
        enListaEspera: enListaEspera,
        cuposDisponibles: electivo.cupos - inscripcionesActivas
      }
    });
  } catch (error) {
    console.error("Error en inscripcion.controller.js -> CreateInscripciones(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getInscripcionesAlumno(req, res) {
  try {
    const inscripcionRepository = AppDataSource.getRepository(InscripcionEntity);
    const { error } = consultarInscripcionesValidation.validate(req.query);

    if (error) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.details.map(e => e.message)
      });
    }

    const { periodo, estado } = req.query;
    const userId = req.user.id;
    const where = { userId: userId };
    
    if (periodo) {
      where.periodo = periodo;
    }
    if (estado) {
      where.estado = estado;
    }

    const inscripciones = await inscripcionRepository.find({
      where,
      order: { createdAt: "DESC" }
    });

    res.status(200).json({ message: "Inscripciones encontradas", data: inscripciones });
  } catch (error) {
    console.error("Error en inscripcion.controller.js -> getInscripcionesAlumno(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getInscripcionesRechazadas(req, res) {
  const inscripcionRepository = AppDataSource.getRepository(InscripcionEntity);

  try {
    const inscripciones = await inscripcionRepository.find({
      where: { estado: "rechazada" },
      order: { createdAt: "ASC" },
    });

    res.status(200).json({
      message: "Inscripciones rechazadas encontradas",
      data: inscripciones,
      total: inscripciones.length,
    });
  } catch (error) {
    console.error(
      "Error en inscripcion.controller.js -> getInscripcionesRechazadas(): ",
      error
    );
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function DeleteInscripciones(req, res) {
  try {
    const inscripcionRepository = AppDataSource.getRepository(InscripcionEntity);
    const electivoRepository = AppDataSource.getRepository(ElectivoEntity);
    
    const inscripcionId = Number(req.params.inscripcionId);
    const userId = req.user.id;
    const inscripcion = await inscripcionRepository.findOne({
      where: { 
        id: inscripcionId,
        userId: userId
      }
    });
    

  
    if (inscripcion.estado === "retirada" || inscripcion.estado === "rechazada") {
      return res.status(400).json({ message: "Esta inscripción ya fue cancelada" });
    }
    const electivo = await electivoRepository.findOne({ where: { id: inscripcion.electivoId } });
    
    if (electivo && electivo.fechaFinRetiro && inscripcion.estado === "activa") {
      const ahora = new Date();
      if (ahora > new Date(electivo.fechaFinRetiro)) {
        return res.status(400).json({ message: "El período de retiro ha finalizado" });
      }
    }

    const estadoAnterior = inscripcion.estado;
    inscripcion.estado = "retirada";
    inscripcion.estadoDetalle = "Retiro voluntario";
    await inscripcionRepository.save(inscripcion);

    if (estadoAnterior === "activa" && electivo) {
      electivo.inscritosActuales = (electivo.inscritosActuales || 0) - 1;
      if (electivo.inscritosActuales < 0) electivo.inscritosActuales = 0;
      await electivoRepository.save(electivo);
    }

    res.status(200).json({ message: "Inscripción cancelada exitosamente", data: inscripcion });
  } catch (error) {
    console.error("Error en inscripcion.controller.js -> DeleteInscripciones(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
export async function gestionarInscripcionDocente(req, res) {
  try {
    const inscripcionRepository = AppDataSource.getRepository(InscripcionEntity);
    const electivoRepository = AppDataSource.getRepository(ElectivoEntity);

    const { error } = gestionarInscripcionValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.details.map(e => e.message),
      });
    }

    const { accion, motivo } = req.body;
    const { inscripcionId } = req.params;

    if (!accion || !["aprobar", "rechazar"].includes(accion)) {
      return res.status(400).json({ message: "Acción inválida. Use 'aprobar' o 'rechazar'" });
    }
    if (!motivo || motivo.trim() === "") {
      return res.status(400).json({ message: "El motivo es obligatorio para esta acción" });
    }

    const inscripcion = await inscripcionRepository.findOne({ where: { id: inscripcionId } });
    if (!inscripcion) return res.status(404).json({ message: "Inscripción no encontrada" });
    if (inscripcion.estado !== "rechazada")
      return res.status(400).json({ message: "Esta inscripción no está en espera" });

    const electivo = await electivoRepository.findOne({ where: { id: inscripcion.electivoId } });
    if (!electivo) return res.status(404).json({ message: "Electivo no encontrado" });

    if (accion === "aprobar") {
      const inscripcionesActivas = await inscripcionRepository.count({
        where: { electivoId: inscripcion.electivoId, estado: "activa" },
      });

      if (inscripcionesActivas >= electivo.cupos)
        return res.status(400).json({ message: "No hay cupos disponibles para aprobar esta inscripción" });

      inscripcion.estado = "activa";
      inscripcion.estadoDetalle = motivo; 
      await inscripcionRepository.save(inscripcion);

      electivo.inscritosActuales = (electivo.inscritosActuales || 0) + 1;
      await electivoRepository.save(electivo);

      return res.status(200).json({ message: "Inscripción aprobada exitosamente", data: inscripcion });
    } else {
      inscripcion.estado = "rechazada";
      inscripcion.estadoDetalle = motivo; 
      await inscripcionRepository.save(inscripcion);

      return res.status(200).json({ message: "Inscripción rechazada", data: inscripcion });
    }
  } catch (error) {
    console.error("Error en inscripcion.controller.js -> gestionarInscripcionDocente(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}


export async function gestionarInscripcion(req, res) {
  try {
    const inscripcionRepository = AppDataSource.getRepository(InscripcionEntity);
    const electivoRepository = AppDataSource.getRepository(ElectivoEntity);
    
    const { error } = gestionarInscripcionValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.details.map(e => e.message)
      });
    }

    const { accion, motivo } = req.body;
    const { inscripcionId } = req.params;

    if (!accion || !["aprobar", "rechazar"].includes(accion)) {
      return res.status(400).json({ 
        message: "Acción inválida. Use 'aprobar' o 'rechazar'" 
      });
    }

    if (accion === "rechazar" && !motivo) {
      return res.status(400).json({ 
        message: "El motivo de rechazo es obligatorio" 
      });
    }

    const inscripcion = await inscripcionRepository.findOne({
      where: { id: inscripcionId }
    });

    if (!inscripcion) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    if (inscripcion.estado !== "en_espera") {
      return res.status(400).json({ 
        message: "Esta inscripción no está en espera" 
      });
    }

    if (accion === "aprobar") {
      const inscripcionesActivas = await inscripcionRepository.count({
        where: { electivoId: inscripcion.electivoId, estado: "activa" }
      });

      const electivo = await electivoRepository.findOne({ where: { id: inscripcion.electivoId } });
      
      if (!electivo) {
        return res.status(404).json({ message: "Electivo no encontrado" });
      }

      if (inscripcionesActivas >= electivo.cupos) {
        return res.status(400).json({ 
          message: "No hay cupos disponibles para aprobar esta inscripción" 
        });
      }

      inscripcion.estado = "activa";
      inscripcion.estadoDetalle = "Inscripción aprobada";
      await inscripcionRepository.save(inscripcion);

      electivo.inscritosActuales = (electivo.inscritosActuales || 0) + 1;
      await electivoRepository.save(electivo);

      return res.status(200).json({ 
        message: "Inscripción aprobada exitosamente", 
        data: inscripcion 
      });
    } else {
      inscripcion.estado = "rechazada";
      inscripcion.estadoDetalle = motivo;
      await inscripcionRepository.save(inscripcion);

      return res.status(200).json({ 
        message: "Inscripción rechazada", 
        data: inscripcion 
      });
    }
  } catch (error) {
    console.error("Error en inscripcion.controller.js -> gestionarInscripcion(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}


export async function getInscripcionesEnEspera(req, res) {
  const inscripcionRepository = AppDataSource.getRepository(InscripcionEntity);

  try {
    const inscripciones = await inscripcionRepository.find({
      where: { estado: "en_espera" },
      order: { createdAt: "ASC" },
    });

    res.status(200).json({
      message: "Inscripciones en espera encontradas",
      data: inscripciones,
      total: inscripciones.length,
    });
  } catch (error) {
    console.error(
      "Error en inscripcion.controller.js -> getInscripcionesEnEspera(): ",
      error
    );
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getNotificaciones(req, res) {
  try {
    const inscripcionRepository = AppDataSource.getRepository(InscripcionEntity);
    const userId = req.user.id; 

    const inscripciones = await inscripcionRepository.find({
      where: { userId: userId },
      order: { updatedAt: "DESC" }
    });

    const notificaciones = inscripciones.map(insc => ({
      id: insc.id,
      electivoId: insc.electivoId,
      estado: insc.estado,
      mensaje: insc.estadoDetalle,
      fecha: insc.updatedAt
    }));

    res.status(200).json({ 
      message: "Notificaciones obtenidas", 
      data: notificaciones,
      pendientes: notificaciones.filter(n => n.estado === "en_espera").length
    });
  } catch (error) {
    console.error("Error en inscripcion.controller.js -> getNotificaciones(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}