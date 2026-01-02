import { Router } from "express";
import { crearSolicitudAlumno, listarSolicitudesAlumno, listarSolicitudesJefe, aprobarSolicitud, rechazarSolicitud} from "../controllers/solicitud.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isJefeDeCarrera } from "../middleware/authorization.middleware.js";

const router = Router();

router.post("/Alumno/Crear",authenticateJwt, crearSolicitudAlumno);
router.get("/Alumno/Obtener",authenticateJwt, listarSolicitudesAlumno);

router.get("/JefedeCarrera/Obtener",authenticateJwt, listarSolicitudesJefe);
router.post("/JefedeCarrera/aprobar/:id",authenticateJwt, aprobarSolicitud);
router.post("/JefedeCarrera/rechazar/:id", authenticateJwt, rechazarSolicitud);

export default router;
