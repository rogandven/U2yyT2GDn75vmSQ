"use strict";
import { getElectivos as s_getElectivos } from "../service/electivo.service.js";
import { getElectivoById as s_getElectivoById } from "../service/electivo.service.js";
import { createElectivo as s_createElectivo } from "../service/electivo.service.js";
import { updateElectivo as s_updateElectivo } from "../service/electivo.service.js";
import { deleteElectivo as s_deleteElectivo } from "../service/electivo.service.js";



export async function getElectivos(req, res) {
    try {
        const electivos = await s_getElectivos();
        if (electivos.length <= 0) {
            return res.status(204).json({message: "No hay electivos para mostrar", electivos: null});
        }
        return res.status(200).json({message: "¡Electivos encontrados con éxito!", electivos: electivos});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor", electivos: null});
    }
}

export async function getElectivoById(req, res) {
    try {
        const electivo = await s_getElectivoById(req.params.id);
        if (!electivo) {
            return res.status(404).json({message: "Electivo no encontrado", electivo: null});
        }
        return res.status(200).json({message: "¡Electivo encontrado con éxito!", electivo: electivo});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor", electivos: null});
    }
}

export async function createElectivo(req, res) {
    try {
        const electivo = await s_createElectivo(req.body);
        return res.status(201).json({message: "Electivo creado con éxito", electivo: electivo});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", electivo: null});
    }
}

export async function updateElectivo(req, res) {
    try {
        const result = await s_updateElectivo(req.params.id, req.body);
        return res.status(201).json({message: "Electivo actualizado con éxito", result: result});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", result: null});
    }
}

export async function deleteElectivo(req, res) {
    try {
        const result = await s_deleteElectivo(req.params.id);
        return res.status(201).json({message: "Electivo eliminado con éxito", result: result});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", result: null});
    }
}