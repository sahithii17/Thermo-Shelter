import { Router } from "express";
import { estimateBudget } from "../services/budgetService.js";
const router = Router();
router.post("/estimate", (req, res, next) => { try { if (!req.body?.design) return res.status(400).json({ error: "Design is required" }); res.json(estimateBudget(req.body.design)); } catch (error) { next(error); } });
export default router;
