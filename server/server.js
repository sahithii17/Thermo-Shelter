import "dotenv/config";
import express from "express";
import cors from "cors";
import locationRoutes from "./routes/location.js";
import climateRoutes from "./routes/climate.js";
import designRoutes from "./routes/designs.js";
import thermalRoutes from "./routes/thermal.js";
import budgetRoutes from "./routes/budget.js";
import optimizationRoutes from "./routes/optimization.js";
import projectRoutes from "./routes/projects.js";

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "thermo-shelter" }));
app.use("/api/location", locationRoutes);
app.use("/api/climate", climateRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/thermal", thermalRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/optimization", optimizationRoutes);
app.use("/api/projects", projectRoutes);
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || "Unexpected server error" });
});
const server = app.listen(port, () => console.log(`Thermo Shelter API listening on http://localhost:${port}`));
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the existing process with: lsof -tiTCP:${port} -sTCP:LISTEN | xargs kill`);
    console.error(`Or start Thermo Shelter on another port with: PORT=8788 npm run server`);
    process.exitCode = 1;
    return;
  }
  console.error("Thermo Shelter API failed to start:", error);
  process.exitCode = 1;
});
