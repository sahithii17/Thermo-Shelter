export function scoreDesign(design, performance) {
  const total = Math.round(performance.comfort*.35 + performance.efficiency*.25 + design.sustainability*.20 + (100-design.cost)*.10 + performance.climateFit*.10);
  return { ...design, performance, score: total };
}