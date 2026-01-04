"use strict";
import { Router } from "express";
import { getUsers, getUserById, getProfile, updateUserById, deleteUserById, registerPrivate, getAllStudentsByCareer } from "../controllers/user.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { canCrudUsers, canViewUsers, isAdmin } from "../middleware/authorization.middleware.js";
import { getAllStudentNames } from "../controllers/user.controller.js";

const router = Router();

//middleware para autenticar el JWT
router.use(authenticateJwt);

//ruta para obtener el perfil del usuario autenticado
router.get("/profile", getProfile);
router.get("/frontend_list", getAllStudentNames);

// Rutas para obtener usuarios (vista): permiten ADMINISTRADOR y JEFE_DE_CARRERA
router.get("/get/", canViewUsers, getUsers);
router.get("/get/:id", canViewUsers, getUserById);
router.get("/get/raw/jefedecarrera", canViewUsers, getAllStudentsByCareer);

//middleware para operaciones de modificación/eliminación/registro: solo CRUD users
router.use(canCrudUsers);

// Rutas que requieren permisos de CRUD
router.patch("/:id", updateUserById);
router.delete("/:id", deleteUserById);
router.post("/", registerPrivate);



export default router;