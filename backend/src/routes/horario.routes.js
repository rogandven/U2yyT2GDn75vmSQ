"use strict"; 
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { createHorario, deleteHorario, getHorarioById, getHorarios, updateHorario } from "../controllers/electivo.controller.js";

const router = Router();

// router.use(authenticateJwt);
router.post("/", createHorario);
router.get("/:id", getHorarioById);
router.get("/", getHorarios);
router.patch("/:id", updateHorario);
router.delete("/:id", deleteHorario);

export default router;
