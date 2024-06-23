import { Router } from "express";
import { getSubjects } from "../controllers/subjects.controller.js";

const router = Router();

router.get('/subjects', getSubjects);

export default router;
