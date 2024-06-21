import { Router } from "express";
import { getProjectById, getProjects } from "../controllers/projects.controller.js";

const router = Router();

router.get('/projects', getProjects);

router.get('/projects/:id', getProjectById);

export default router;
