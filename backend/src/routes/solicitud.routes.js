import { Router } from "express";
import { crearSolicitudAlumno, listarSolicitudesAlumno, listarSolicitudesJefe, aprobarSolicitud, rechazarSolicitud} from "../controllers/solicitud.controller.js";
import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
import { canCrudRequests, canMakeRequests, isJefeDeCarrera } from "../middleware/authorization.middleware.js";

const router = Router();
router.use(isAuthenticated)

router.post("/Alumno/Crear", canMakeRequests, crearSolicitudAlumno);
router.get("/Alumno/Obtener", canMakeRequests, listarSolicitudesAlumno);

router.get("/JefedeCarrera/Obtener", canCrudRequests, listarSolicitudesJefe);
router.post("/JefedeCarrera/aprobar/:id", canCrudRequests, aprobarSolicitud);
router.post("/JefedeCarrera/rechazar/:id", canCrudRequests, rechazarSolicitud);

export default router;
