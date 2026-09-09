import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { Download, Trophy, ArrowRight } from "lucide-react";
import FloorPlan2D from "../components/FloorPlan2D";
import Shelter3D from "../components/Shelter3D";
import MaterialPanel from "../components/MaterialPanel";

export default function Results({ designs = [], climate = {}, setPage }) {
  const ranked = useMemo(
    () =>
      [...designs]
        .sort(
          (a, b) =>
            (b.performance?.overall || 0) -
            (a.performance?.overall || 0)
        )
        .slice(0, 2),
    [designs]
  );

  const [idx, setIdx] = useState(0);
  const design = ranked[idx] || designs[0];

  if (!design) {
    return (
      <main className="page empty-stage">
        <span className="eyebrow">05 · OPTIMIZED OUTCOMES</span>
        <h1>No optimized design yet.</h1>
        <p>Run thermal verification first.</p>
        <button
          className="primary-btn"
          onClick={() => setPage("simulation")}
        >
          Return to thermal lab
        </button>
      </main>
    );
  }

  function formatNumber(value, digits = 2) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return String(value ?? "-");
    }

    return number.toLocaleString("en-IN", {
      maximumFractionDigits: digits,
    });
  }

  function formatMoney(value) {
    const number = Number(value) || 0;

    return `INR ${number.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  }

  function report() {
    const cost = Number(design.predictedCost) || 0;
    const budget = Number(design.budget) || 0;
    const difference = budget - cost;

    const breakdown = {
      Structure: Math.round(cost * 0.28),
      Envelope: Math.round(cost * 0.22),
      Roof: Math.round(cost * 0.12),
      Openings: Math.round(cost * 0.1),
      "Interior & Services": Math.round(cost * 0.18),
      "Energy Systems": Math.round(cost * 0.1),
    };

    const materials = design.materials || [];

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    const footerY = pageHeight - 10;

    let y = 20;

    function addPageIfNeeded(height = 10) {
      if (y + height > footerY - 5) {
        pdf.addPage();
        y = 20;
      }
    }

    function addTitle(text) {
      addPageIfNeeded(18);

      pdf.setTextColor(23, 42, 70);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(text, margin, y);

      y += 9;
    }

    function addSection(text) {
      addPageIfNeeded(16);

      pdf.setTextColor(226, 123, 56);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(text.toUpperCase(), margin, y);

      y += 7;
    }

    function addLine(label, value) {
      const safeValue =
        value === null || value === undefined || value === ""
          ? "-"
          : String(value);

      const text = `${label}: ${safeValue}`;

      pdf.setTextColor(23, 42, 70);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);

      const wrapped = pdf.splitTextToSize(text, contentWidth);

      addPageIfNeeded(wrapped.length * 4.8 + 3);

      pdf.text(wrapped, margin, y);
      y += wrapped.length * 4.8 + 1.5;
    }

    function addParagraph(text) {
      pdf.setTextColor(70, 86, 108);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);

      const wrapped = pdf.splitTextToSize(String(text), contentWidth);

      addPageIfNeeded(wrapped.length * 4.8 + 4);

      pdf.text(wrapped, margin, y);
      y += wrapped.length * 4.8 + 3;
    }

    // Report header
    pdf.setTextColor(23, 42, 70);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("THERMO SHELTER", margin, y);

    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(97, 113, 138);
    pdf.text("Climate-Adaptive Design Report", margin, y);

    y += 8;

    pdf.setDrawColor(226, 123, 56);
    pdf.setLineWidth(0.6);
    pdf.line(margin, y, pageWidth - margin, y);

    y += 11;

    addTitle("Design Report");

    // Site brief
    addSection("Location & Site Brief");

    addLine("Location", climate.location);
    addLine("Climate mode", climate.mode);
    addLine("Shelter type", design.shelterType);
    addLine("Occupants", design.occupants);
    addLine(
      "Site",
      `${design.siteLength || "-"} m × ${
        design.siteWidth || "-"
      } m (${design.area || "-"} m²)`
    );

    y += 3;

    // Selected design
    addSection("Selected Design");

    addLine("Name", design.name);
    addLine("Subtitle", design.subtitle);
    addLine("Footprint", design.footprint);
    addLine("Form", design.form);
    addLine("Roof", design.roof);

    y += 3;

    // Budget
    addSection("Budget");

    addLine("Maximum budget", formatMoney(budget));
    addLine("Predicted design cost", formatMoney(cost));
    addLine(
      "Difference",
      `${formatMoney(Math.abs(difference))} ${
        difference >= 0 ? "under budget" : "over budget"
      }`
    );
    addLine(
      "Status",
      difference >= 0 ? "Within budget" : "Over budget"
    );

    y += 2;

    addLine("Structure", formatMoney(breakdown.Structure));
    addLine("Envelope", formatMoney(breakdown.Envelope));
    addLine("Roof", formatMoney(breakdown.Roof));
    addLine("Openings", formatMoney(breakdown.Openings));
    addLine(
      "Interior & Services",
      formatMoney(breakdown["Interior & Services"])
    );
    addLine(
      "Energy Systems",
      formatMoney(breakdown["Energy Systems"])
    );

    addParagraph(
      "Conceptual predicted cost — not a contractor quotation."
    );

    // Thermal results
    addSection("Thermal Performance");

    addLine(
      "Overall",
      `${formatNumber(design.performance?.overall)}%`
    );
    addLine(
      "Comfort",
      `${formatNumber(design.performance?.comfort)}%`
    );
    addLine(
      "Efficiency",
      `${formatNumber(design.performance?.efficiency)}%`
    );
    addLine(
      "Energy demand",
      design.performance?.energyDemand
    );
    addLine(
      "Net thermal load",
      design.performance?.netLoad
    );
    addLine(
      "Material properties used",
      design.performance?.materialPropertiesUsed
        ? "Yes"
        : "No verified property available"
    );

    y += 3;

    // Materials
    addSection("Materials From Local Dataset");

    if (!materials.length) {
      addParagraph("No material records available.");
    } else {
      materials.forEach((item, index) => {
        addPageIfNeeded(32);

        pdf.setTextColor(23, 42, 70);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);

        const materialName =
          item.materialName || "Verified record unavailable";

        const materialTitle = `${index + 1}. ${materialName}`;
        const wrappedTitle = pdf.splitTextToSize(
          materialTitle,
          contentWidth
        );

        pdf.text(wrappedTitle, margin, y);
        y += wrappedTitle.length * 4.8 + 2;

        addLine(
          "Application",
          item.application || "Assembly"
        );

        addLine(
          "Source",
          item.source || "Source unavailable"
        );

        addLine(
          "Thermal conductivity",
          item.properties?.thermalConductivity !== undefined
            ? `${item.properties.thermalConductivity} W/m·K`
            : "Unavailable"
        );

        y += 2;
      });
    }

    // Notes
    addSection("Notes");

    addParagraph(
      "This report is generated from the Thermo Shelter academic prototype. " +
        "The thermal engine and cost model are simplified and should not be " +
        "treated as professional engineering, construction, CFD, BIM, or " +
        "contractor documentation. Real construction should be validated by " +
        "qualified architects and engineers."
    );

    // Footer on every page
    const totalPages = pdf.internal.getNumberOfPages();

    for (let page = 1; page <= totalPages; page += 1) {
      pdf.setPage(page);

      pdf.setTextColor(125, 138, 155);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);

      pdf.text(
        `Thermo Shelter • Page ${page} of ${totalPages}`,
        margin,
        footerY
      );
    }

    pdf.save("Thermo_Shelter_Report.pdf");
  }

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">05 · OPTIMIZED OUTCOMES</span>
          <h1>Two concepts rise to the top.</h1>
          <p>
            Ranked across thermal comfort, efficiency, sustainability,
            climate fit and budget fit.
          </p>
        </div>

        <button className="secondary-btn" onClick={report}>
          <Download size={17} />
          Download report
        </button>
      </div>

      <div className="winner-tabs">
        {ranked.map((item, index) => (
          <button
            className={index === idx ? "active" : ""}
            onClick={() => setIdx(index)}
            key={item.id || index}
          >
            <Trophy size={16} />

            {index === 0
              ? "01 · Optimized leader"
              : "02 · Strong alternative"}

            <b>{item.name}</b>

            <span>
              {item.performance?.overall || "-"}% overall
            </span>
          </button>
        ))}
      </div>

      <div className="workspace">
        <div className="workspace-top">
          <div>
            <span className="eyebrow">FINAL RECOMMENDATION</span>
            <h2>{design.name}</h2>
            <p>{design.subtitle}</p>
          </div>

          <div className="score-badge">
            <span>Overall</span>
            <b>{design.performance?.overall || "-"}%</b>
          </div>
        </div>

        <div className="visual-grid">
          <FloorPlan2D
            design={design}
            thermal={design.performance}
          />

          <Shelter3D design={design} />
        </div>

        <MaterialPanel design={design} />
      </div>

      <button
        className="secondary-btn center-btn"
        onClick={() => setPage("designs")}
      >
        Compare all concepts
        <ArrowRight size={18} />
      </button>
    </main>
  );
}