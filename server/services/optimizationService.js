export function optimizeDesigns(designs) {
  const score = (design) => (design.performance?.overall || 0) + (design.sustainability || 0) + (design.performance?.climateFit || 0) * 0.2 + (design.materialPropertiesAvailable ? 8 : 0) + (design.budgetDifference >= 0 ? 12 : 0);
  return [...designs].sort((a, b) => score(b) - score(a)).map((design, index) => ({ ...design, optimizationScore: Math.round(score(design)), rank: index + 1, optimizationReason: index < 2 ? "Best combined thermal, climate, cost, sustainability, occupant, site and verified-material fit." : "Strong alternative with a trade-off in the multi-objective score." }));
}
