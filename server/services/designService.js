const programs = {
  Residential: ["Thermal Entry", "Living + Dining", "Kitchen", "Sleeping", "Bath", "Storage"],
  "Army / Field Accommodation": ["Protected Entry", "Sleeping Modules", "Equipment Store", "Shared Wash", "Utility", "Efficient Circulation"],
  "Research Laboratory": ["Controlled Entry", "Laboratory Workspace", "Equipment Area", "Sample Storage", "Staff Workroom", "Service Zone"],
  "Medical / Emergency": ["Reception", "Waiting", "Treatment", "Staff Base", "Clinical Storage", "Controlled Service"],
  Educational: ["Covered Entry", "Teaching Studio", "Flexible Learning", "Resource Store", "Staff Area", "Wash Zone"],
  Community: ["Welcome", "Multi-use Hall", "Kitchenette", "Quiet Room", "Storage", "Service Zone"],
  "Transit / Bus Shelter": ["Protected Waiting", "Accessible Seating", "Information Zone", "Weather Buffer", "Service Cabinet"],
  "Storage / Utility": ["Secure Entry", "Storage Bay", "Equipment Bay", "Maintenance", "Utility Core"],
  Custom: ["Entry", "Primary Workspace", "Support Space", "Storage", "Service Zone"]
};
const forms = ["Courtyard", "Linear spine", "Clustered modules", "Compact core", "Raised pavilion"];
const roofs = ["Solar mono-pitch", "Ventilated gable", "Butterfly monitor", "Deep-overhang flat", "Snow-shedding pitch"];
import { recommendMaterials } from "./materialService.js";

function materialForDesign(materials, index, application) {
  const material = materials[index % Math.max(materials.length, 1)];
  if (!material) return { application, materialName: "No verified dataset record available", source: "Unavailable", sourceUrl: null, sourceRecordId: null, properties: {}, recommendationReason: "No imported record matched this project requirement; no material property is asserted." };
  return { ...material, application };
}

export function generateDesigns(climate, brief) {
  const type = brief.shelterType || "Residential";
  const names = type === "Research Laboratory" ? ["Field Lab Spine", "Solar Sample Core", "Ventilated Lab Court", "Modular Research Wing", "Cold Chain Pod"] : type === "Transit / Bus Shelter" ? ["Civic Canopy", "Windbreak Station", "Solar Waiting Room", "Transit Courtyard", "Modular Stop"] : ["Solar Core", "Thermal Buffer", "Climate Court", "Adaptive Modules", "Wind-Smart Pod"];
  const program = programs[type] || programs.Custom;
  const recommendedMaterials = recommendMaterials({ climate, shelterType: type, budget: brief.budget, limit: Math.max(5, names.length) });
  return names.map((name, index) => {
    const scale = Math.min(1.35, Math.max(0.7, brief.occupants / 4));
    const area = Math.round(Math.min(brief.siteArea * 0.8, Math.max(program.length * 10 * scale, 48 + index * 8)));
    const rooms = program.map((label, roomIndex) => [label.toLowerCase().replaceAll(" ", "-"), label, 0.04 + (roomIndex % 3) * 0.32, 0.06 + Math.floor(roomIndex / 3) * 0.45, 0.28, 0.35]);
    const predictedCost = Math.round(area * (type === "Research Laboratory" ? 72000 : type === "Medical / Emergency" ? 58000 : 38000 + index * 3500));
    const materialPalette = [
      materialForDesign(recommendedMaterials, index, "Wall / envelope"),
      materialForDesign(recommendedMaterials, index + 1, "Roof assembly"),
      materialForDesign(recommendedMaterials, index + 2, "Floor / thermal mass"),
      materialForDesign(recommendedMaterials, index + 3, "Insulation"),
      materialForDesign(recommendedMaterials, index + 4, "Openings / shading")
    ];
    const materialFactor = materialPalette.reduce((sum, material) => sum + (material.properties.thermalConductivity || 0.25), 0) / materialPalette.length;
    const materialCostFactor = materialPalette.some((material) => !material.properties.thermalConductivity) ? 1.05 : 1;
    const adjustedCost = Math.round(predictedCost * materialCostFactor * (1 + Math.min(materialFactor, 1) * 0.08));
    return { id: `${type.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-${index}`, name, subtitle: `${type} concept with ${program.length} programmed zones`, form: forms[index], roof: roofs[index], footprint: `${Math.round(Math.sqrt(area * 1.25))} x ${Math.round(Math.sqrt(area / 1.25))} m`, area, cost: Math.min(98, 68 + index * 5), sustainability: 82 + (index % 4) * 4, comfort: 84 + ((index + 1) % 5) * 3, windowArea: 0.12 + index * 0.04, airtightness: climate.mode === "hot" ? 0.68 + index * 0.03 : 0.88 + index * 0.015, solarExposure: 62 + index * 7, strategies: climate.strategies.slice(0, 2).concat(type === "Research Laboratory" ? "Controlled access and equipment zoning" : `${type} circulation logic`), rooms, materials: materialPalette, materialPropertiesAvailable: materialPalette.every((material) => Object.keys(material.properties).length > 0), location: brief.location, latitude: brief.latitude, longitude: brief.longitude, occupants: brief.occupants, shelterType: type, budget: brief.budget, siteLength: brief.siteLength, siteWidth: brief.siteWidth, predictedCost: adjustedCost, budgetDifference: brief.budget - adjustedCost, performance: null };
  });
}
