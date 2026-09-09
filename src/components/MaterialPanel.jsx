import { Box } from "lucide-react";

export default function MaterialPanel({ design = {} }) {
  const materials = (Array.isArray(design.materials) ? design.materials : [])
    .filter((material) => material && typeof material === "object")
    .filter((material) => material.sourceRecordId);

  const cost =
    design.predictedCost || Math.round((design.area || 0) * 38000);

  return (
    <section className="material-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">SPECIFICATION</span>
          <h3>Verified materials</h3>
        </div>
        <Box size={25} />
      </div>

      {materials.length > 0 && (
        <div className="materials-grid">
          {materials.map((material, index) => {
            const reason = Array.isArray(material.recommendationReason)
              ? material.recommendationReason.join(" ")
              : material.recommendationReason;

            return (
              <div
                className="material"
                key={`${material.materialName || "material"}-${index}`}
              >
                <small>{material.application || "Assembly"}</small>
                <b>{material.materialName}</b>
                {reason && <span>{reason}</span>}
              </div>
            );
          })}
        </div>
      )}

      <div className="material-budget">
        <b>Predicted total</b>
        <strong>₹{cost.toLocaleString("en-IN")}</strong>
        <span className={cost <= (design.budget || Infinity) ? "within" : "over"}>
          {cost <= (design.budget || Infinity) ? "Within" : "Over"} ₹
          {Number(design.budget || 0).toLocaleString("en-IN")} budget
        </span>
      </div>
    </section>
  );
}