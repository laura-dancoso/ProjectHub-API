import express from "express";
import cors from "cors";
import morgan from "morgan";
import projectsRoutes from "./routes/projects.routes.js";
import degreesRoutes from "./routes/degrees.routes.js";
import subjectsRoutes from "./routes/subjects.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", projectsRoutes);
app.use("/api", degreesRoutes);
app.use("/api", subjectsRoutes);

export default app;