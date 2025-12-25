"use strict";

import { Router } from "express";
import { CreateInscripciones,getInscripcionesRechazadas,DeleteInscripciones,getInscripcionesAlumno,gestionarInscripcion,getInscripcionesEnEspera,getNotificaciones, gestionarInscripcionDocente } from "../controllers/inscripcion.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin, isJefedeCarrera, isProfesor} from "../middleware/authorization.middleware.js";
const router = Router();

router.post("/Crear/:electivoId", authenticateJwt, CreateInscripciones);
router.get("/Obtener", authenticateJwt,isProfesor,getInscripcionesRechazadas);
router.get("/notificar", authenticateJwt, getNotificaciones);
router.get("/ObtenerAlumno", authenticateJwt, getInscripcionesAlumno);
router.delete("/Eliminar/:inscripcionId", authenticateJwt, DeleteInscripciones);
router.get("/admin/en-espera", authenticateJwt, isJefedeCarrera, getInscripcionesEnEspera);
router.put("/gestionar/:inscripcionId",authenticateJwt, isJefedeCarrera,gestionarInscripcion);
router.put("/gestionar/Docente/:inscripcionId",authenticateJwt,isProfesor,gestionarInscripcionDocente)
export default router;
