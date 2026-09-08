export function simulateDesign(design, climate) {
  const cold = climate.mode === "cold";
  const envelopeLoss = Math.round((cold ? 42 : 18) * (1.12 - design.airtightness * .45) * (design.area / 90));
  const solarGain = Math.round((cold ? 48 : 20) * (design.solarExposure/100) * (design.windowArea/.18));
  const ventilationLoss = Math.round((cold ? 15 : 8) * (1.2 - design.airtightness));
  const netLoad = Math.max(5, Math.round(cold ? envelopeLoss + ventilationLoss - solarGain : envelopeLoss + solarGain * .65));
  const comfort = Math.max(65, Math.min(99, Math.round(design.comfort - netLoad*.12 + (design.sustainability-80)*.08)));
  const efficiency = Math.max(60, Math.min(99, Math.round(100 - netLoad*.55)));
  const zones = design.rooms.map(([id,label]) => ({
    id, label,
    value: Math.max(18, Math.min(92, Math.round(comfort + (Math.sin(id.length*3.2)*7) + (cold ? solarGain*.06 : -solarGain*.025))))
  }));
  return { overall: Math.round((comfort*.45 + efficiency*.35 + design.sustainability*.2)),
    comfort, efficiency, climateFit: Math.round((comfort+design.sustainability)/2),
    budgetFit: design.cost, envelopeLoss, solarGain, ventilationLoss, netLoad, zones };
}