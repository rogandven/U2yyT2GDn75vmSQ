"use strict";
import { getHorarios as s_getHorarios } from "../service/horario.service.js";
import { getHorarioById as s_getHorarioById } from "../service/horario.service.js";
import { createHorario as s_createHorario } from "../service/horario.service.js";
import { updateHorario as s_updateHorario } from "../service/horario.service.js";
import { deleteHorario as s_deleteHorario } from "../service/horario.service.js";



export async function getHorarios(req, res) {
    try {
        const horarios = await s_getHorarios();
        if (horarios.length <= 0) {
            return res.status(204).json({message: "No hay horarios para mostrar", horarios: null});
        }
        return res.status(200).json({message: "¡Horarios encontrados con éxito!", horarios: horarios});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor", horarios: null});
    }
}

export async function getHorarioById(req, res) {
    try {
        const horario = await s_getHorarioById(req.params.id);
        if (!horario) {
            return res.status(404).json({message: "Horario no encontrado", horario: null});
        }
        return res.status(200).json({message: "¡Horario encontrado con éxito!", horario: horario});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor", horarios: null});
    }
}

export async function createHorario(req, res) {
    try {
        const horario = await s_createHorario(req.body);
        return res.status(201).json({message: "Horario creado con éxito", horario: horario});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", horario: null});
    }
}

export async function updateHorario(req, res) {
    try {
        const result = await s_updateHorario(req.params.id, req.body);
        return res.status(201).json({message: "Horario actualizado con éxito", result: result});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", result: null});
    }
}

export async function deleteHorario(req, res) {
    try {
        const result = await s_deleteHorario(req.params.id);
        return res.status(201).json({message: "Horario eliminado con éxito", result: result});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", result: null});
    }
}