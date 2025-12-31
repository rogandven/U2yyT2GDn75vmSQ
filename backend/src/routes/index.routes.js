
"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import carreraRoutes from "./carrera.routes.js";
import electivoCarreraRoutes from "./electivo.carrera.routes.js";
import electivoRoutes from "./electivo.routes.js";
import horarioRoutes from "./horario.routes.js";



const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/carreras", carreraRoutes);
router.use("/electivo-carrera", electivoCarreraRoutes);
router.use("/electivo/", electivoRoutes);
router.use("/horario", horarioRoutes);


export default router;