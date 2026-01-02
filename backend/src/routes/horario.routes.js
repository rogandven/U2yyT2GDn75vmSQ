"use strict";
import { Router } from "express";
import { asignarHorario,getHorarios,patchHorario,deleteHorario } from "../controllers/horario.controller.js";
import { isAdminOrProfesor } from "../middleware/authorization.middleware.js"; 
import { authenticateJwt as isAuthenticated} from "../middleware/authentication.middleware.js";
import { canCrudHorarios } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(isAuthenticated);

router.get("/", getHorarios);

router.post("/asignar/:id_electivo", canCrudHorarios, asignarHorario);
router.patch("/:id", canCrudHorarios, patchHorario);
router.delete("/:id", canCrudHorarios, deleteHorario);

export default router;
