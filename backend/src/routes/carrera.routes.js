"use strict"; 
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { createCarrera, deleteCarrera, getCarreraById, getCarreras, updateCarrera } from "../controllers/carrera.controller.js";

const router = Router();

// router.use(authenticateJwt);
router.post("/", createCarrera);
router.get("/:id", getCarreraById);
router.get("/", getCarreras);
router.patch("/:id", updateCarrera);
router.delete("/:id", deleteCarrera);

export default router;
