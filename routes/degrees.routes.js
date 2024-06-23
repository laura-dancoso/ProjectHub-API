import { Router } from "express";
import { getDegrees } from "../controllers/degrees.controller.js";

const router = Router();

router.get('/degrees', getDegrees);

export default router;
