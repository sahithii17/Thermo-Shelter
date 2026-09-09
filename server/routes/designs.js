import { Router } from "express";
import { normalizeBrief } from "../utils/validation.js";
import { generateDesigns } from "../services/designService.js";
const router = Router();
router.post("/generate", (req, res, next) => { try { const brief = normalizeBrief(req.body); if (!brief.climate) return res.status(400).json({ error: "Climate profile is required" }); res.json({ designs: generateDesigns(brief.climate, brief) }); } catch (error) { next(error); } });
export default router;
