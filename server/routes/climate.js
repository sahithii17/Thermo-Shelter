import { Router } from "express";
import { fetchClimate } from "../services/climateService.js";
const router = Router();
router.post("/analyze", async (req, res, next) => { try { const { latitude, longitude } = req.body || {}; if (!Number.isFinite(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90 || !Number.isFinite(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180) return res.status(400).json({ error: "Latitude must be between -90 and 90 and longitude between -180 and 180" }); res.json(await fetchClimate(req.body)); } catch (error) { next(error); } });
export default router;
