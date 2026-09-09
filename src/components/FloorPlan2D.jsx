import { useState } from "react";
import { Compass, Minus, Plus, RotateCcw, Sun } from "lucide-react";

export default function FloorPlan2D({ design = {}, thermal }) {
  const [zoom, setZoom] = useState(1);
  const [heat, setHeat] = useState(false);

  const siteLength = Number(design.siteLength) || 12;
  const siteWidth = Number(design.siteWidth) || 8;
  const buildingLength = Number(design.buildingLength) || siteLength;
  const buildingWidth = Number(design.buildingWidth) || siteWidth;
  const buildingHeight = Number(design.buildingHeight) || 3.2;

  const planX = 150;
  const planY = 135;
  const planWidth = 700;
  const planHeight = 390;

  return (
    <section className="plan-shell">
      <div className="plan-toolbar">
        <div>
          <b>2D Architectural Plan</b>
          <small>
            {design.form || "Climate-responsive plan"} ·{" "}
            {design.footprint || `${buildingLength} × ${buildingWidth} m`}
          </small>
        </div>

        <div className="toolbar-actions">
          <button
            className={heat ? "selected" : ""}
            onClick={() => setHeat((value) => !value)}
          >
            <Sun size={15} /> Thermal
          </button>
          <button onClick={() => setZoom((value) => Math.min(1.7, value + 0.1))}>
            <Plus size={15} />
          </button>
          <button onClick={() => setZoom((value) => Math.max(0.7, value - 0.1))}>
            <Minus size={15} />
          </button>
          <button onClick={() => setZoom(1)}>
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      <div className="plan-canvas">
        <svg
          viewBox="0 0 1000 680"
          role="img"
          aria-label={`${design.name || "Building"} architectural plan`}
          style={{ transform: `scale(${zoom})` }}
        >
          <defs>
            <pattern id="plan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="#dfe7f2" />
            </pattern>
            <filter id="plan-shadow">
              <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity=".14" />
            </filter>
          </defs>

          <rect width="1000" height="680" fill="url(#plan-grid)" />

          <text x="500" y="32" textAnchor="middle" className="plan-dimension-label">
            SITE LENGTH · {siteLength.toFixed(1)} m
          </text>
          <line x1="150" y1="52" x2="850" y2="52" className="dimension-line" />
          <line x1="150" y1="44" x2="150" y2="60" className="dimension-tick" />
          <line x1="850" y1="44" x2="850" y2="60" className="dimension-tick" />

          <text
            x="930"
            y="330"
            textAnchor="middle"
            className="plan-dimension-label"
            transform="rotate(90 930 330)"
          >
            SITE WIDTH · {siteWidth.toFixed(1)} m
          </text>
          <line x1="885" y1="135" x2="885" y2="525" className="dimension-line" />

          <g filter="url(#plan-shadow)">
            <rect
              x={planX}
              y={planY}
              width={planWidth}
              height={planHeight}
              rx="8"
              fill="#fff"
              stroke="#182b49"
              strokeWidth="10"
            />

            {(design.rooms || []).map(([id, label, x, y, w, h]) => {
              const thermalValue =
                thermal?.zones?.find((zone) => zone.id === id)?.value || 50;

              return (
                <g key={`${id}-${label}`}>
                  <rect
                    x={planX + x * planWidth}
                    y={planY + y * planHeight}
                    width={w * planWidth}
                    height={h * planHeight}
                    fill={
                      heat
                        ? `hsl(${Math.max(
                            0,
                            120 - thermalValue * 1.15
                          )},82%,68%)`
                        : "#f8fbff"
                    }
                    stroke="#51677f"
                    strokeWidth="3"
                  />
                  <text
                    x={planX + (x + w / 2) * planWidth}
                    y={planY + (y + h / 2) * planHeight}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="16"
                    fontWeight="700"
                    fill="#1c2d45"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            <rect
              x={planX + planWidth / 2 - 55}
              y={planY + planHeight - 3}
              width="110"
              height="16"
              fill="#fff"
            />
            <text
              x={planX + planWidth / 2}
              y={planY + planHeight + 27}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
            >
              MAIN ENTRY
            </text>
          </g>

          <text x="500" y="575" textAnchor="middle" className="plan-dimension-label">
            BUILDING LENGTH · {buildingLength.toFixed(1)} m
          </text>
          <text x="500" y="600" textAnchor="middle" className="plan-meta-label">
            BUILDING WIDTH · {buildingWidth.toFixed(1)} m · HEIGHT ·{" "}
            {buildingHeight.toFixed(1)} m
          </text>

          <g transform="translate(65 90)">
            <circle cx="35" cy="35" r="27" fill="#fff" stroke="#172b49" strokeWidth="3" />
            <path d="M35 12L43 47L35 40L27 47Z" fill="#172b49" />
            <text x="35" y="68" textAnchor="middle" fontSize="13" fontWeight="700">
              N
            </text>
          </g>
        </svg>
      </div>

      <div className="plan-legend">
        <span><i className="legend-wall" /> Wall</span>
        <span><i className="legend-room" /> Room</span>
        <span><i className="legend-sun" /> Thermal zone</span>
        <span><Compass size={15} /> North up</span>
      </div>
    </section>
  );
}