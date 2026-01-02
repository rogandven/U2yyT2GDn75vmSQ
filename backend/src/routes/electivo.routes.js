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
  getElectivoById,
  getAllElectivoNames,
} from "../controllers/electivo.controller.js";
import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
import { isAdminOrProfesor, isJefeDeCarrera } from "../middleware/authorization.middleware.js"; 
import { canApproveElectivos, canCrudElectivos } from "../middleware/authorization.middleware.js";

const router = Router();
router.use(isAuthenticated);
//para todos los usuarios autenticados
router.get("/get/", getElectivos);
router.get("/get/:id", getElectivoById);

//Solo administrador o profesor pueden crear, actualizar o eliminar electivos
router.post("/", canCrudElectivos, createElectivoProfesor);
router.patch("/:id", canCrudElectivos, updateElectivo);
router.delete("/:id", canCrudElectivos, deleteElectivo);

router.get("/get_private/", canApproveElectivos, getElectivosSinAprobar);
router.post("/private", canApproveElectivos, createElectivoJefeDeCarrera);
router.post("/private/approve/:id", canApproveElectivos, approveElectivo);
router.post("/private/reject/:id", canApproveElectivos, rejectElectivo);

router.get("/frontend_list/", getAllElectivoNames);


export default router;