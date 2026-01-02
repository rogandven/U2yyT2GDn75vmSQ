"use strict";

import { Router } from "express";
import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
<<<<<<< HEAD
import { isAdminOrProfesor } from "../middleware/authorization.middleware.js"; 
import { private_getInscripciones, private_getInscripcionesByUser, private_getInscripcion, private_getInscripcionesSinAprobar, private_createInscripcion, private_updateInscripcion, private_deleteInscripcion, private_approveInscripcion, private_rejectInscripcion, public_getInscripcion, public_getInscripcionesByUser, public_createInscripcion, public_updateInscripcion, public_deleteInscripcion, shallDisplayWarning } from "../controllers/inscripcion.controller.js";
=======
import { canModerateInscripciones, canSignUpToElectivos, isAdminOrProfesor } from "../middleware/authorization.middleware.js"; 
import { private_getInscripciones, private_getInscripcionesByUser, private_getInscripcion, private_getInscripcionesSinAprobar, private_createInscripcion, private_updateInscripcion, private_deleteInscripcion, private_approveInscripcion, private_rejectInscripcion, public_getInscripcion, public_getInscripcionesByUser, public_createInscripcion, public_updateInscripcion, public_deleteInscripcion } from "../controllers/inscripcion.controller.js";
>>>>>>> MERGE-02-01-2026-2
const router = Router();

router.use(isAuthenticated)

<<<<<<< HEAD
router.get("/:id", isAuthenticated, public_getInscripcion);
router.get("/", isAuthenticated, public_getInscripcionesByUser);
router.post("/", isAuthenticated, public_createInscripcion);
router.patch("/:id", isAuthenticated, public_updateInscripcion);
router.delete("/:id", isAuthenticated, public_deleteInscripcion);

router.get("/sdw/", isAuthenticated, shallDisplayWarning);

=======
router.get("/admin/", canModerateInscripciones, private_getInscripciones);
router.get("/admin/user/:id", canModerateInscripciones, private_getInscripcionesByUser);
router.get("/admin/inscripcion/:id", canModerateInscripciones, private_getInscripcion);
router.get("/admin/pendiente", canModerateInscripciones, private_getInscripcionesSinAprobar);
router.post("/admin/", canModerateInscripciones, private_createInscripcion);
router.patch("/admin/:id", canModerateInscripciones, private_updateInscripcion);
router.delete("/admin/:id", canModerateInscripciones, private_deleteInscripcion);
router.post("/aprobar/:id", canModerateInscripciones, private_approveInscripcion);
router.post("/rechazar/:id", canModerateInscripciones, private_rejectInscripcion);

router.get("/:id", canSignUpToElectivos, public_getInscripcion);
router.get("/", canSignUpToElectivos,public_getInscripcionesByUser);
router.post("/", canSignUpToElectivos,public_createInscripcion);
router.patch("/:id", canSignUpToElectivos,public_updateInscripcion);
router.delete("/:id", canSignUpToElectivos,public_deleteInscripcion);
>>>>>>> MERGE-02-01-2026-2
export default router;
