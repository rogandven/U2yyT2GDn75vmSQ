"use strict";
import { Router } from "express";
import { asignarHorario,getHorarios,patchHorario,deleteHorario, getHorariosByIdElectivo } from "../controllers/horario.controller.js";
import { isAdminOrProfesor } from "../middleware/authorization.middleware.js"; 
import { authenticateJwt as isAuthenticated} from "../middleware/authentication.middleware.js";
import { canCrudHorarios } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(isAuthenticated);

router.get("/", getHorarios);
router.get("/:id_electivo",getHorariosByIdElectivo);
// router.patch("/:id", isAdminOrProfesor, patchHorario);
// router.delete("/:id", isAdminOrProfesor, deleteHorario);

router.post("/asignar/:id_electivo", canCrudHorarios, asignarHorario);
router.patch("/:id", canCrudHorarios, patchHorario);
router.delete("/:id", canCrudHorarios, deleteHorario);

export default router;
