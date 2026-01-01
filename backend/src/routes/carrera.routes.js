import { Router } from "express";
import { crearCarrera } from "../controllers/carrera.controller";
import { authenticateJwt } from "../middleware/authentication.middleware";

const router=Router();
router.use(authenticateJwt);
router.post("/crear", crearCarrera);
export default router;

