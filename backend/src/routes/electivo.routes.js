"use strict";

import { Router } from "express";
import {
  getElectivos,
  updateElectivo,
  deleteElectivo,
  createElectivoProfesor,
  createElectivoJefeDeCarrera,
  approveElectivo,
  getElectivosSinAprobar,
  rejectElectivo,
} from "../controllers/electivo.controller.js";
import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
import { isAdminOrProfesor, isJefeDeCarrera } from "../middleware/authorization.middleware.js"; 

const router = Router();

//para todos los usuarios autenticados
router.get("/", isAuthenticated, getElectivos);
router.get("/private", isAuthenticated, isJefeDeCarrera, getElectivosSinAprobar);

//Solo administrador o profesor pueden crear, actualizar o eliminar electivos
router.post("/", isAuthenticated, isAdminOrProfesor, createElectivoProfesor);
router.post("/private", isAuthenticated, isJefeDeCarrera, createElectivoJefeDeCarrera);
router.post("/private/approve/:id", isAuthenticated, isJefeDeCarrera, approveElectivo);
router.post("/private/reject/:id", isAuthenticated, isJefeDeCarrera, rejectElectivo);
router.patch("/:id", isAuthenticated, isAdminOrProfesor, updateElectivo);
router.delete("/:id", isAuthenticated, isAdminOrProfesor, deleteElectivo);

export default router;