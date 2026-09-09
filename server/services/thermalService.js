export function simulateDesign(design, climate) {
  const materials = Array.isArray(design.materials) ? design.materials : [];
  const conductivities = materials.map((material) => Number(material.properties?.thermalConductivity)).filter(Number.isFinite);
  const averageConductivity = conductivities.length ? conductivities.reduce((sum, value) => sum + value, 0) / conductivities.length : null;
  const materialEnvelopeFactor = averageConductivity === null ? 1 : Math.max(0.65, Math.min(1.35, averageConductivity / 0.25));
  const specificHeats = materials.map((material) => Number(material.properties?.specificHeat)).filter(Number.isFinite);
  const thermalMass = specificHeats.length ? specificHeats.reduce((sum, value) => sum + value, 0) / specificHeats.length : null;
  const glazingPenalty = Math.round(design.windowArea * (climate.mode === "hot" ? 28 : 18));
  const massBonus = design.form.includes("Compact") ? 7 : 3;
  const comfort = Math.max(42, Math.min(98, Math.round(design.comfort - glazingPenalty + massBonus + (1 - materialEnvelopeFactor) * 12 + (thermalMass ? 2 : 0))));
  const efficiency = Math.max(40, Math.min(98, Math.round(design.sustainability + design.airtightness * 8 - glazingPenalty / 2)));
  const netLoad = Math.round(((100 - comfort) * 1.8 + design.occupants * 0.9) * materialEnvelopeFactor);
  return { overall: Math.round(comfort * 0.45 + efficiency * 0.35 + (design.budgetDifference >= 0 ? 20 : 8)), comfort, efficiency, climateFit: Math.round((comfort + efficiency) / 2), energyDemand: `${netLoad} kWh/m²/yr`, netLoad: `${netLoad} kWh`, envelopeLoss: `${Math.round((1 - design.airtightness) * 100 * materialEnvelopeFactor)}%`, averageConductivity, thermalMass, materialPropertiesUsed: conductivities.length > 0, note: "Simplified physics-informed estimate; not CFD or certified EnergyPlus analysis." };
}
