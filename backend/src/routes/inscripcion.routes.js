"use strict";

import { Router } from "express";
import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
// import { isAdminOrProfesor } from "../middleware/authorization.middleware.js"; 
// import { private_getInscripcion, private_getInscripcionesByUser, private_getInscripciones, private_getInscripcionesSinAprobar, public_getInscripcion, public_getInscripcionesByUser, public_createInscripcion, public_updateInscripcion, public_deleteInscripcion } from "../controllers/inscripcion.controller.js";
// import { private_createInscripcion, private_updateInscripcion, private_deleteInscripcion } from "../controllers/inscripcion.controller.js";
// import { private_approveInscripcion, private_rejectInscripcion } from "../controllers/inscripcion.controller.js";
const router = Router();
/*
// PRIVATE
router.get("/admin/", isAuthenticated, isAdminOrProfesor, private_getInscripciones);
router.get("/admin/user/:id", isAuthenticated, isAdminOrProfesor, private_getInscripcionesByUser);
router.get("/admin/inscripcion/:id", isAuthenticated, isAdminOrProfesor, private_getInscripcion);
router.get("/admin/pendiente", isAuthenticated, isAdminOrProfesor, private_getInscripcionesSinAprobar);

router.post("/admin/", isAuthenticated, isAdminOrProfesor, private_createInscripcion);
router.patch("/admin/:id", isAuthenticated, isAdminOrProfesor, private_updateInscripcion);
router.delete("/admin/:id", isAuthenticated, isAdminOrProfesor, private_deleteInscripcion);

router.post("/aprobar/:id", isAuthenticated, isAdminOrProfesor, private_approveInscripcion);
router.post("/rechazar/:id", isAuthenticated, isAdminOrProfesor, private_rejectInscripcion);

// PUBLIC
router.get("/:id", isAuthenticated, public_getInscripcion);
router.get("/", isAuthenticated, public_getInscripcionesByUser);

router.post("/", isAuthenticated, public_createInscripcion);
router.patch("/:id", isAuthenticated, public_updateInscripcion);
router.delete("/:id", isAuthenticated, public_deleteInscripcion);
*/ 
export default router;
