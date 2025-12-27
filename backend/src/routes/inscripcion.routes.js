"use strict";

import { Router } from "express";
import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
import { isAdminOrProfesor } from "../middleware/authorization.middleware.js"; 
import { private_getInscripciones, private_getInscripcionesByUser, private_getInscripcion, private_getInscripcionesSinAprobar, private_createInscripcion, private_updateInscripcion, private_deleteInscripcion, private_approveInscripcion, private_rejectInscripcion, public_getInscripcion, public_getInscripcionesByUser, public_createInscripcion, public_updateInscripcion, public_deleteInscripcion, shallDisplayWarning } from "../controllers/inscripcion.controller.js";
const router = Router();

router.get("/admin/", isAuthenticated, isAdminOrProfesor, private_getInscripciones);
router.get("/admin/user/:id", isAuthenticated, isAdminOrProfesor, private_getInscripcionesByUser);
router.get("/admin/inscripcion/:id", isAuthenticated, isAdminOrProfesor, private_getInscripcion);
router.get("/admin/pendiente", isAuthenticated, isAdminOrProfesor, private_getInscripcionesSinAprobar);
router.post("/admin/", isAuthenticated, isAdminOrProfesor, private_createInscripcion);
router.patch("/admin/:id", isAuthenticated, isAdminOrProfesor, private_updateInscripcion);
router.delete("/admin/:id", isAuthenticated, isAdminOrProfesor, private_deleteInscripcion);
router.post("/aprobar/:id", isAuthenticated, isAdminOrProfesor, private_approveInscripcion);
router.post("/rechazar/:id", isAuthenticated, isAdminOrProfesor, private_rejectInscripcion);

router.get("/:id", isAuthenticated, public_getInscripcion);
router.get("/", isAuthenticated, public_getInscripcionesByUser);
router.post("/", isAuthenticated, public_createInscripcion);
router.patch("/:id", isAuthenticated, public_updateInscripcion);
router.delete("/:id", isAuthenticated, public_deleteInscripcion);

router.get("/shall_display_warning", isAuthenticated, shallDisplayWarning);

export default router;
