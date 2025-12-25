"use strict";

import { Router } from "express";
import { CreateInscripciones,getInscripcionesRechazadas,DeleteInscripciones,getInscripcionesAlumno,gestionarInscripcion,getInscripcionesEnEspera,getNotificaciones, gestionarInscripcionDocente } from "../controllers/inscripcion.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
const router = Router();

router.post("/Crear/:electivoId", authenticateJwt, CreateInscripciones);
router.get("/Obtener", authenticateJwt,getInscripcionesRechazadas);
router.get("/notificar", authenticateJwt, getNotificaciones);
router.get("/ObtenerAlumno", authenticateJwt, getInscripcionesAlumno);
router.delete("/Eliminar/:inscripcionId", authenticateJwt, DeleteInscripciones);

router.get("/admin/en-espera", authenticateJwt, getInscripcionesEnEspera);
router.put("/gestionar/:inscripcionId",authenticateJwt,gestionarInscripcion);
router.put("/gestionar/Docente/:inscripcionId",authenticateJwt,gestionarInscripcionDocente)
export default router;
