"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import electivoRoutes from "./electivo.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

//ruta del electivo
router.use("/electivos", electivoRoutes);

export default router;