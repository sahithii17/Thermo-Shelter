export function estimateBudget(design) {
  const materialCount = Array.isArray(design.materials) ? design.materials.length : 0;
  const quantityBasis = (design.area || 0) * 2.8;
  const materialQuantity = Math.round(quantityBasis * Math.max(materialCount, 1));
  const breakdown = { structure: Math.round(design.predictedCost * 0.28), envelope: Math.round(design.predictedCost * 0.22), roof: Math.round(design.predictedCost * 0.12), openings: Math.round(design.predictedCost * 0.1), interiorAndServices: Math.round(design.predictedCost * 0.18), energySystems: Math.round(design.predictedCost * 0.1) };
  return { predictedTotal: Object.values(breakdown).reduce((sum, value) => sum + value, 0), budget: design.budget, difference: design.budget - design.predictedCost, withinBudget: design.predictedCost <= design.budget, breakdown, materialQuantityBasis: `${materialQuantity} m²-equivalent material basis`, materialSources: (design.materials || []).map((material) => ({ materialName: material.materialName, source: material.source, sourceRecordId: material.sourceRecordId })), disclaimer: "Conceptual predicted cost - not a contractor quotation." };
}
