import { Router } from "express";
import { geocodeLocation } from "../services/geocodingService.js";
const router = Router();
router.post("/analyze", async (req, res, next) => { try { if (!req.body?.query) return res.status(400).json({ error: "Enter a location name" }); res.json(await geocodeLocation(req.body.query)); } catch (error) { next(error); } });
export default router;
