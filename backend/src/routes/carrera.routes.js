import { Router } from "express";
import { createCarrera } from "../controllers/carrera.controller";
import { authenticateJwt } from "../middleware/authentication.middleware";

const router=Router();
router.use(authenticateJwt);
router.post("/crear", createCarrera);
export default router;

