import { Router } from "express";
import { getProjectById, getProjects, createNewProject, deleteProjectById, updateProjectById} from "../controllers/projects.controller.js";

const router = Router();

router.get('/projects', getProjects);

router.get('/projects/:id', getProjectById);

router.post('/projects', createNewProject);

router.delete('/projects/:id', deleteProjectById);

router.put('/projects/:id', updateProjectById);

export default router;
