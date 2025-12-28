"use strict";
import { Router } from "express";
import { getUsers, getUserById, getProfile, updateUserById, deleteUserById, registerPrivate } from "../controllers/user.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { getAllStudentNames } from "../controllers/user.controller.js";

const router = Router();

//middleware para autenticar el JWT
router.use(authenticateJwt);

//ruta para obtener el perfil del usuario autenticado
router.get("/profile", getProfile);
router.get("/frontend_list", getAllStudentNames);

//middleware para verificar si el usuario es administrador
router.use(isAdmin);

// Rutas para obtener usuarios
router.get("/get/", getUsers);
router.get("/get/:id", getUserById);
router.patch("/:id", updateUserById);
router.delete("/:id", deleteUserById);
router.post("/", registerPrivate);



export default router;