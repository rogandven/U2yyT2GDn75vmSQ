"use strict"; 
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { createElectivo, deleteElectivo, getElectivoById, getElectivos, updateElectivo } from "../controllers/electivo.controller.js";

const router = Router();

// router.use(authenticateJwt);
router.post("/", createElectivo);
router.get("/:id", getElectivoById);
router.get("/", getElectivos);
router.patch("/:id", updateElectivo);
router.delete("/:id", deleteElectivo);

export default router;
