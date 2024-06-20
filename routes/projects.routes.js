import { Router } from "express";
import { TEST } from "../config.js";

const router = Router();

router.get("/", (req, resp)=>{
    resp.send(TEST)
});

export default router;
