import { Router } from "express";
import { createCarreras, deleteCarrera, getCarreraNames, getCarreras, patchCarrera } from "../controllers/carrera.controller.js";
import { authenticateJwt as isAuthenticated } from "../middleware/authentication.middleware.js";
import { canCrudCareers } from "../middleware/authorization.middleware.js";

const router=Router();
router.use(isAuthenticated);

router.get("/", getCarreras);

router.post("/", canCrudCareers, createCarreras);
router.patch("/:id", canCrudCareers, patchCarrera);
router.delete("/:id", canCrudCareers, deleteCarrera);

router.get("/frontend_list", getCarreraNames);
export default router;

