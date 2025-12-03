/*
import { Router } from "express";
import {
  getElectivos,
  createElectivo,
  updateElectivo,
  deleteElectivo,
} from "../controllers/electivo.controller.js";
import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.get("/", isAuthenticated, getElectivos);

router.post("/", isAuthenticated, isAdmin, createElectivo);
router.patch("/:id", isAuthenticated, isAdmin, updateElectivo);
router.delete("/:id", isAuthenticated, isAdmin, deleteElectivo);

export default router;
*/

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
router.post("/private/approve", isAuthenticated, isJefeDeCarrera, approveElectivo);
router.patch("/:id", isAuthenticated, isAdminOrProfesor, updateElectivo);
router.delete("/:id", isAuthenticated, isAdminOrProfesor, deleteElectivo);

export default router;


