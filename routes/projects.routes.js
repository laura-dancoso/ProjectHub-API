import { Router } from "express";
import { getProjectById, getProjects, createNewProject, deleteProjectById, updateProjectById} from "../controllers/projects.controller.js";
import multer
 from "multer";
const router = Router();

router.get('/projects', getProjects);

router.get('/projects/:id', getProjectById);

const storage = multer.memoryStorage();
const upload = multer({ storage:  storage})
const files = upload.fields([{ name: 'project', maxCount: 1 }, { name: 'covers', maxCount: 5 }])

router.post('/projects', files, createNewProject);

router.delete('/projects/:id', deleteProjectById);

router.put('/projects/:id', updateProjectById);

export default router;
