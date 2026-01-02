import { Router } from "express"
// import { login, register, logout } from "../controllers/auth.controller.js"
import { login, registerPublic, logout } from "../controllers/user.controller.js";

const router = new Router();

// Rutas de autenticación
// router.post("/register", registerPublic);
router.post("/login", login);
router.post("/logout", logout);

export default router;