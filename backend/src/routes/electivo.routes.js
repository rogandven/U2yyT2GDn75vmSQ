"use strict";
import { Router } from "express";
import { getElectivo,getElectivos, getElectivoById, updateElectivoById, deleteElectivoById, createElectivo, aprobarElectivo, rechazarElectivo } from "../controllers/electivo.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { isJefe } from "../middleware/authorization.middleware.js";
const router = Router();

// Middleware para autenticar el JWT
router.use(authenticateJwt);

// Rutas públicas
router.get("/electivos", getElectivos);

// Rutas para obtener electivos
router.get("/", getElectivo);
router.post("/", createElectivo);
router.get("/:id", getElectivoById);
router.put("/:id", updateElectivoById);
router.delete("/:id", deleteElectivoById);

router.post("/:id/aprobar", isJefe, aprobarElectivo);
router.post("/:id/rechazar", isJefe, rechazarElectivo);


export default router;