import { Router } from "express";
import { saveProject, getProject } from "../services/projectService.js";
const router = Router();
router.post("/", (req, res, next) => { try { if (!req.body?.brief) return res.status(400).json({ error: "Project brief is required" }); res.status(201).json(saveProject(req.body)); } catch (error) { next(error); } });
router.get("/:id", (req, res) => { const project = getProject(req.params.id); if (!project) return res.status(404).json({ error: "Project not found" }); res.json(project); });
export default router;
