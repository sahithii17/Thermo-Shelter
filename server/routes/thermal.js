import { Router } from "express";
import { simulateDesign } from "../services/thermalService.js";
const router = Router();
router.post("/simulate", (req, res, next) => { try { if (!req.body?.design || !req.body?.climate) return res.status(400).json({ error: "Design and climate are required" }); res.json({ performance: simulateDesign(req.body.design, req.body.climate) }); } catch (error) { next(error); } });
export default router;
