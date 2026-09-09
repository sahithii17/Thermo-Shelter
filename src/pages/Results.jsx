import { useMemo, useState } from "react";
import { Download, Trophy, ArrowRight } from "lucide-react";
import FloorPlan2D from "../components/FloorPlan2D";
import Shelter3D from "../components/Shelter3D";
import MaterialPanel from "../components/MaterialPanel";

export default function Results({ designs = [], climate = {}, setPage }) {
  const ranked = useMemo(() => [...designs].sort((a, b) => (b.performance?.overall || 0) - (a.performance?.overall || 0)).slice(0, 2), [designs]);
  const [idx, setIdx] = useState(0);
  const design = ranked[idx] || designs[0];
  if (!design) return <main className="page empty-stage"><span className="eyebrow">05 · OPTIMIZED OUTCOMES</span><h1>No optimized design yet.</h1><p>Run thermal verification first.</p><button className="primary-btn" onClick={() => setPage("simulation")}>Return to thermal lab</button></main>;
  function report() {
    const cost = Number(design.predictedCost) || 0;
    const budget = Number(design.budget) || 0;
    const difference = budget - cost;
    const breakdown = { structure: Math.round(cost * 0.28), envelope: Math.round(cost * 0.22), roof: Math.round(cost * 0.12), openings: Math.round(cost * 0.1), interiorAndServices: Math.round(cost * 0.18), energySystems: Math.round(cost * 0.1) };
    const materials = (design.materials || []).map((item) => `${item.application || "Assembly"}: ${item.materialName || "Verified record unavailable"} | ${item.source || "Source unavailable"} | ${item.properties?.thermalConductivity !== undefined ? `k=${item.properties.thermalConductivity} W/m·K` : "thermal conductivity unavailable"}`).join("\n");
    const text = `THERMO SHELTER — DESIGN REPORT\n\nLOCATION & BRIEF\nLocation: ${climate.location || "-"}\nClimate mode: ${climate.mode || "-"}\nShelter type: ${design.shelterType || "-"}\nOccupants: ${design.occupants || "-"}\nSite: ${design.siteLength || "-"} m × ${design.siteWidth || "-"} m (${design.area || "-"} m²)\n\nSELECTED DESIGN\nName: ${design.name}\nFootprint: ${design.footprint || "-"}\nForm: ${design.form || "-"}\nRoof: ${design.roof || "-"}\n\nBUDGET\nUser maximum budget: ₹${budget.toLocaleString("en-IN")}\nPredicted design cost: ₹${cost.toLocaleString("en-IN")}\nDifference: ₹${Math.abs(difference).toLocaleString("en-IN")} ${difference >= 0 ? "under budget" : "over budget"}\nStatus: ${difference >= 0 ? "Within budget" : "Over budget"}\nConceptual breakdown:\n${Object.entries(breakdown).map(([key, value]) => `- ${key}: ₹${value.toLocaleString("en-IN")}`).join("\n")}\nConceptual predicted cost — not a contractor quotation.\n\nTHERMAL RESULTS\nOverall: ${design.performance?.overall ?? "-"}%\nComfort: ${design.performance?.comfort ?? "-"}%\nEfficiency: ${design.performance?.efficiency ?? "-"}%\nEnergy demand: ${design.performance?.energyDemand ?? "-"}\nNet thermal load: ${design.performance?.netLoad ?? "-"}\nMaterial properties used: ${design.performance?.materialPropertiesUsed ? "Yes" : "No verified property available"}\n\nMATERIALS FROM LOCAL DATASET\n${materials || "No material records available."}\n\nNote: Simplified academic prototype; engineering validation required.`;
    const anchor = document.createElement("a");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    anchor.href = url;
    anchor.download = "Thermo_Shelter_Report.txt";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <main className="page"><div className="page-heading"><div><span className="eyebrow">05 · OPTIMIZED OUTCOMES</span><h1>Two concepts rise to the top.</h1><p>Ranked across thermal comfort, efficiency, sustainability, climate fit and budget fit.</p></div><button className="secondary-btn" onClick={report}><Download size={17}/> Download report</button></div><div className="winner-tabs">{ranked.map((item, index) => <button className={index === idx ? "active" : ""} onClick={() => setIdx(index)} key={item.id || index}><Trophy size={16}/> {index === 0 ? "01 · Optimized leader" : "02 · Strong alternative"}<b>{item.name}</b><span>{item.performance?.overall || "-"}% overall</span></button>)}</div><div className="workspace"><div className="workspace-top"><div><span className="eyebrow">FINAL RECOMMENDATION</span><h2>{design.name}</h2><p>{design.subtitle}</p></div><div className="score-badge"><span>Overall</span><b>{design.performance?.overall || "-"}%</b></div></div><div className="visual-grid"><FloorPlan2D design={design} thermal={design.performance}/><Shelter3D design={design}/></div><MaterialPanel design={design}/></div><button className="secondary-btn center-btn" onClick={() => setPage("designs")}>Compare all concepts <ArrowRight size={18}/></button></main>;
}
