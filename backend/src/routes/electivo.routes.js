/*
"use strict";

import { Router } from "express";
import {
  getElectivos,
  updateElectivo,
  deleteElectivo,
  createElectivoProfesor,
  createElectivoJefeDeCarrera,
  approveElectivo,
  getElectivosSinAprobar,
  rejectElectivo,
  getElectivoById,
  getAllElectivoNames,
} from "../controllers/electivo.controller.js";
import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
import { isAdminOrProfesor, isJefeDeCarrera } from "../middleware/authorization.middleware.js"; 

const router = Router();

//para todos los usuarios autenticados
router.get("/get/", isAuthenticated, getElectivos);
router.get("/get/:id", isAuthenticated, getElectivoById);
router.get("/get_private/", isAuthenticated, isJefeDeCarrera, getElectivosSinAprobar);

//Solo administrador o profesor pueden crear, actualizar o eliminar electivos
router.post("/", isAuthenticated, isAdminOrProfesor, createElectivoProfesor);
//router.post("/private", isAuthenticated, isJefeDeCarrera, createElectivoJefeDeCarrera);
router.post("/private/approve/:id", isAuthenticated, isJefeDeCarrera, approveElectivo);
router.post("/private/reject/:id", isAuthenticated, isJefeDeCarrera, rejectElectivo);
router.patch("/:id", isAuthenticated, isAdminOrProfesor, updateElectivo);
router.delete("/:id", isAuthenticated, isAdminOrProfesor, deleteElectivo);

router.get("/frontend_list/", isAuthenticated, getAllElectivoNames);


export default router;*/
/*
"use strict";

import { Router } from "express";
import {
  crearElectivo,
  listarElectivos,
  aprobarElectivo,
  rechazarElectivo,
  editarElectivo,
} from "../controllers/electivo.controller.js";

import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
import {
  isAdminOrProfesor,
  isJefeDeCarrera,
  isAdmin,
} from "../middleware/authorization.middleware.js";

const router = Router();



router.get("/", isAuthenticated, listarElectivos);

router.post(
  "/",
  isAuthenticated,
  isAdminOrProfesor,
  crearElectivo
);



router.post(
  "/:id/aprobar",
  isAuthenticated,
  isJefeDeCarrera,
  aprobarElectivo
);


router.post(
  "/:id/rechazar",
  isAuthenticated,
  isJefeDeCarrera,
  rechazarElectivo
);


router.patch(
  "/:id",
  isAuthenticated,
  isAdminOrProfesor,
  editarElectivo
);



export default router;
*/

"use strict";

import { Router } from "express";
import {
  crearElectivo,
  listarElectivos,
  aprobarElectivo,
  rechazarElectivo,
  editarElectivo,
  eliminarElectivo
} from "../controllers/electivo.controller.js";

import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
import {
  isAdminOrProfesor,
  isJefeDeCarrera
} from "../middleware/authorization.middleware.js";

const router = Router();
//LISTAR ELECTIVOS
//alumnos y usuarios autenticados
router.get("/get",isAuthenticated, listarElectivos);

//CREAR ELECTIVO  
//solo profesor, profesor jefe carrera y admin
router.post("/", isAuthenticated, isAdminOrProfesor, crearElectivo);


//APROBAR ELECTIVO
//solo jefe de carrera
router.post("/:id/aprobar", isAuthenticated, isJefeDeCarrera, aprobarElectivo);


//RECHAZAR ELECTIVO
//solo jefe de carrera
router.post("/:id/rechazar", isAuthenticated, isJefeDeCarrera, rechazarElectivo);


//MODIFICAR ELECTIVO
//solo profesor y admin
router.patch("/:id", isAuthenticated, isAdminOrProfesor, editarElectivo);


//ELIMINAR ELECTIVO
//solo profesor y admin
router.delete("/:id", isAuthenticated, isAdminOrProfesor, eliminarElectivo);

export default router;
