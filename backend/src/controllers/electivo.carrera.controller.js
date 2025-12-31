"use strict";
import { getElectivoCarreras as s_getElectivoCarreras } from "../service/electivoCarrera.service.js";
import { getElectivoCarreraById as s_getElectivoCarreraById } from "../service/electivoCarrera.service.js";
import { createElectivoCarrera as s_createElectivoCarrera } from "../service/electivoCarrera.service.js";
import { updateElectivoCarrera as s_updateElectivoCarrera } from "../service/electivoCarrera.service.js";
import { deleteElectivoCarrera as s_deleteElectivoCarrera } from "../service/electivoCarrera.service.js";



export async function getElectivoCarreras(req, res) {
    try {
        const electivoCarreras = await s_getElectivoCarreras();
        if (electivoCarreras.length <= 0) {
            return res.status(204).json({message: "No hay electivoCarreras para mostrar", electivoCarreras: null});
        }
        return res.status(200).json({message: "¡ElectivoCarreras encontrados con éxito!", electivoCarreras: electivoCarreras});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor", electivoCarreras: null});
    }
}

export async function getElectivoCarreraById(req, res) {
    try {
        const electivoCarrera = await s_getElectivoCarreraById(req.params.id);
        if (!electivoCarrera) {
            return res.status(404).json({message: "ElectivoCarrera no encontrado", electivoCarrera: null});
        }
        return res.status(200).json({message: "¡ElectivoCarrera encontrado con éxito!", electivoCarrera: electivoCarrera});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor", electivoCarreras: null});
    }
}

export async function createElectivoCarrera(req, res) {
    try {
        const electivoCarrera = await s_createElectivoCarrera(req.body);
        return res.status(201).json({message: "ElectivoCarrera creado con éxito", electivoCarrera: electivoCarrera});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", electivoCarrera: null});
    }
}

export async function updateElectivoCarrera(req, res) {
    try {
        const result = await s_updateElectivoCarrera(req.params.id, req.body);
        return res.status(201).json({message: "ElectivoCarrera actualizado con éxito", result: result});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", result: null});
    }
}

export async function deleteElectivoCarrera(req, res) {
    try {
        const result = await s_deleteElectivoCarrera(req.params.id);
        return res.status(201).json({message: "ElectivoCarrera eliminado con éxito", result: result});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", result: null});
    }
}