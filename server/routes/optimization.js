import { Router } from "express";
import { optimizeDesigns } from "../services/optimizationService.js";
const router = Router();
router.post("/run", (req, res, next) => { try { if (!Array.isArray(req.body?.designs)) return res.status(400).json({ error: "Design list is required" }); const designs = optimizeDesigns(req.body.designs); res.json({ designs, top: designs.slice(0, 2) }); } catch (error) { next(error); } });
export default router;
