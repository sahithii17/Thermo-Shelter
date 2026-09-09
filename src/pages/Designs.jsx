import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import DesignCard from "../components/DesignCard";
import FloorPlan2D from "../components/FloorPlan2D";
import Shelter3D from "../components/Shelter3D";
import MaterialPanel from "../components/MaterialPanel";

export default function Designs({ designs = [], setPage }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= designs.length) setIdx(0);
  }, [designs.length, idx]);

  const design = designs[idx];

  if (!design) {
    return (
      <main className="page empty-stage">
        <span className="eyebrow">03 · GENERATIVE ARCHITECTURE</span>
        <h1>No design generated yet.</h1>
        <p>Complete Climate Analysis first.</p>
        <button className="primary-btn" onClick={() => setPage("climate")}>
          Return to climate
        </button>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">03 · GENERATIVE ARCHITECTURE</span>
          <h1>Five different ways to solve the climate.</h1>
          <p>
            Each concept changes spatial organization, openings, roof response,
            materials, and thermal strategy.
          </p>
        </div>

        <button className="primary-btn" onClick={() => setPage("simulation")}>
          Run thermal verification <ArrowRight size={18} />
        </button>
      </div>

      <div className="design-grid">
        {designs.map((item, index) => (
          <DesignCard
            key={item.id || index}
            design={item}
            selected={index === idx}
            onSelect={() => setIdx(index)}
          />
        ))}
      </div>

      <div className="workspace">
        <div className="workspace-top">
          <div>
            <span className="eyebrow">SELECTED CONCEPT</span>
            <h2>{design.name}</h2>
            <p>
              {design.subtitle} · {design.footprint}
            </p>
          </div>

          <div className="score-badge">
            <span>Design fit</span>
            <b>
              {Math.round(
                ((design.comfort || 0) +
                  (design.sustainability || 0) +
                  (100 - (design.cost || 100))) /
                  3
              )}
              %
            </b>
          </div>
        </div>

        <div className="visual-grid">
          <FloorPlan2D design={design} />
          <Shelter3D design={design} />
        </div>

        <MaterialPanel design={design} />
      </div>
    </main>
  );
}