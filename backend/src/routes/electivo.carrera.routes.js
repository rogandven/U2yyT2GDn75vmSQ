"use strict"; 
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { createElectivoCarrera, deleteElectivoCarrera, getElectivoCarreraById, getElectivoCarreras, updateElectivoCarrera } from "../controllers/electivo.carrera.controller.js";

const router = Router();

// router.use(authenticateJwt);
router.post("/", createElectivoCarrera);
router.get("/:id", getElectivoCarreraById);
router.get("/", getElectivoCarreras);
router.patch("/:id", updateElectivoCarrera);
router.delete("/:id", deleteElectivoCarrera);

export default router;
