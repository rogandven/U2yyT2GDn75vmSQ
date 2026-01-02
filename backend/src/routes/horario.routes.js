"use strict";
import { Router } from "express";
import { asignarHorario,getHorarios,patchHorario,deleteHorario, getHorariosByIdElectivo } from "../controllers/horario.controller.js";
import { isAdminOrProfesor } from "../middleware/authorization.middleware.js"; 
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);
router.post("/asignar/:id_electivo", isAdminOrProfesor, asignarHorario);
router.get("/", getHorarios);
router.get("/:id_electivo",getHorariosByIdElectivo);
router.patch("/:id", isAdminOrProfesor, patchHorario);
router.delete("/:id", isAdminOrProfesor, deleteHorario);

export default router;
