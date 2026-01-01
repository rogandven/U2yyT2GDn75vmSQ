import { Router } from "express";
import { createCarreras, deleteCarrera, getCarreras, patchCarrera } from "../controllers/carrera.controller.js";
import { authenticateJwt} from "../middleware/authentication.middleware.js";

const router=Router();
router.use(authenticateJwt);
router.post("/crear", createCarreras);
router.get("/",getCarreras);
router.patch("/:id",patchCarrera);
router.delete("/:id",deleteCarrera);
export default router;

