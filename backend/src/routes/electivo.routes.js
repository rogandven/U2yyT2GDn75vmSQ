"use strict";
import { Router } from "express";
import { getElectivo,getElectivos, getElectivoById, updateElectivoById, deleteElectivoById } from "../controllers/electivo.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// Middleware para autenticar el JWT
router.use(authenticateJwt);

// Rutas públicas
router.get("/electivos", getElectivos);

// Rutas para obtener usuarios
router.get("/", getElectivo);
router.get("/:id", getElectivoById);
router.put("/:id", updateElectivoById);
router.delete("/:id", deleteElectivoById);

export default router;