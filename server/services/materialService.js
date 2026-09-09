import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MATERIALS_DIR = path.join(__dirname, "../data/materials");

// Safely load a JSON file
function loadJSON(filename, fallback = []) {
  try {
    const filePath = path.join(MATERIALS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      console.warn(`Material data file not found: ${filename}`);
      return fallback;
    }

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Error loading ${filename}:`, error.message);
    return fallback;
  }
}

// Load material knowledge base
const nistMaterials = loadJSON("nist_materials.json", []);
const ashraeReferences = loadJSON("ashrae_references.json", []);
const bisStandards = loadJSON("bis_standards.json", []);
const materialSources = loadJSON("material_sources.json", []);
const sourceRecords = Array.isArray(materialSources) ? materialSources : (materialSources.sources || []);

/**
 * Get all available materials
 */
export function getAllMaterials() {
  const ashrae = Array.isArray(ashraeReferences) ? ashraeReferences : ashraeReferences.records || [];
  return [
    ...(Array.isArray(nistMaterials) ? nistMaterials : []).map((material) => normalizeMaterial(material, "NIST SRD 81", sourceRecords.find((source) => source.id === "NIST-SRD81"))),
    ...ashrae.map((material) => normalizeMaterial(material, "ASHRAE Handbook, Chapter 26", sourceRecords.find((source) => source.id === "ASHRAE-F25-CH26")))
  ];
}

function firstNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object") {
    const values = [value.min, value.max].filter((item) => Number.isFinite(Number(item))).map(Number);
    return values.length ? values.reduce((sum, item) => sum + item, 0) / values.length : null;
  }
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function normalizeMaterial(material, sourceName, source) {
  const name = material.materialName || material.material || material.name || material.Material || "Unnamed material";
  const conductivity = firstNumber(material.thermalConductivity ?? material.thermal_conductivity ?? material.thermal_conductivity_W_mK ?? material["Thermal Conductivity"]);
  const density = firstNumber(material.density_kg_m3 ?? material.density ?? material.bulkDensity ?? material["Bulk Density"]);
  const specificHeat = firstNumber(material.specific_heat_kJ_kgK ?? material.specificHeat ?? material["Specific Heat"]);
  const thickness = firstNumber(material.thickness_m ?? material.thickness ?? material.Thickness);
  const resistance = firstNumber(material.thermalResistance ?? material.resistance ?? material.Resistance);
  return {
    materialName: name,
    source: sourceName,
    sourceUrl: material.sourceUrl || source?.url || "",
    sourceRecordId: material.id || material.ID || null,
    properties: {
      ...(conductivity !== null ? { thermalConductivity: conductivity } : {}),
      ...(density !== null ? { density } : {}),
      ...(specificHeat !== null ? { specificHeat } : {}),
      ...(thickness !== null ? { thickness } : {}),
      ...(resistance !== null ? { thermalResistance: resistance } : {})
    },
    applications: material.applications || [],
    standards: material.standards || [],
    reference: material.sourceReference || null,
    raw: material
  };
}

/**
 * Determine the thermal requirement from climate
 */
function getThermalRequirement(climate) {
  const temperature =
    Number(climate?.avgTemp) ||
    Number(climate?.avgTemperature) ||
    Number(climate?.averageTemperature) ||
    Number(climate?.temperature) ||
    25;

  if (temperature < 15) {
    return {
      mode: "cold",
      priority: "low_conductivity",
      target: "heat_retention"
    };
  }

  if (temperature > 30) {
    return {
      mode: "hot",
      priority: "low_conductivity",
      target: "heat_reduction"
    };
  }

  return {
    mode: "moderate",
    priority: "balanced",
    target: "balanced_thermal_performance"
  };
}

/**
 * Get shelter-type requirements
 */
function getShelterRequirements(shelterType) {
  const type = String(shelterType || "").toLowerCase();

  if (type.includes("army") || type.includes("field")) {
    return {
      preferredApplications: ["portable", "field", "temporary", "wall", "roof"],
      priorities: ["durability", "low_weight", "weather_resistance"]
    };
  }

  if (type.includes("research") || type.includes("laboratory")) {
    return {
      preferredApplications: ["wall", "roof", "floor"],
      priorities: ["thermal_stability", "durability", "fire_resistance"]
    };
  }

  if (type.includes("medical") || type.includes("emergency")) {
    return {
      preferredApplications: ["wall", "roof", "floor"],
      priorities: ["hygiene", "durability", "fire_resistance"]
    };
  }

  if (type.includes("residential")) {
    return {
      preferredApplications: ["wall", "roof", "floor", "insulation"],
      priorities: ["thermal_comfort", "durability", "cost"]
    };
  }

  if (type.includes("storage") || type.includes("utility")) {
    return {
      preferredApplications: ["wall", "roof", "floor"],
      priorities: ["durability", "cost"]
    };
  }

  return {
    preferredApplications: ["wall", "roof", "floor"],
    priorities: ["thermal_performance", "cost", "durability"]
  };
}

/**
 * Extract thermal conductivity from different dataset formats
 */
function getConductivity(material) {
  return Number(
    material.properties?.thermalConductivity ??
    material.thermalConductivity ??
    material.thermal_conductivity ??
    material.conductivity ??
    material.k ??
    Infinity
  );
}

/**
 * Extract density from different dataset formats
 */
function getDensity(material) {
  return Number(
    material.properties?.density ??
    material.density ??
    material.bulkDensity ??
    material.bulk_density ??
    Infinity
  );
}

/**
 * Score a material for the current project
 */
function scoreMaterial(material, climate, shelterType, budget) {
  let score = 0;

  const conductivity = getConductivity(material);
  const density = getDensity(material);

  const thermal = getThermalRequirement(climate);
  const shelter = getShelterRequirements(shelterType);

  // -----------------------------------------
  // 1. THERMAL PERFORMANCE
  // -----------------------------------------

  if (Number.isFinite(conductivity)) {
    if (conductivity <= 0.04) score += 40;
    else if (conductivity <= 0.10) score += 30;
    else if (conductivity <= 0.20) score += 20;
    else if (conductivity <= 0.50) score += 10;
  }

  // -----------------------------------------
  // 2. CLIMATE
  // -----------------------------------------

  if (thermal.mode === "cold") {
    if (conductivity <= 0.08) score += 20;
  }

  if (thermal.mode === "hot") {
    if (conductivity <= 0.10) score += 15;
  }

  if (thermal.mode === "moderate") {
    if (conductivity <= 0.20) score += 10;
  }

  // -----------------------------------------
  // 3. SHELTER TYPE
  // -----------------------------------------

  const applications = material.applications || [];
  const materialText = JSON.stringify(material).toLowerCase();

  shelter.preferredApplications.forEach((application) => {
    if (
      applications
        .map((x) => String(x).toLowerCase())
        .includes(application.toLowerCase()) ||
      materialText.includes(application.toLowerCase())
    ) {
      score += 5;
    }
  });

  // -----------------------------------------
  // 4. PORTABLE / FIELD SHELTER
  // -----------------------------------------

  if (
    (shelterType || "").toLowerCase().includes("army") &&
    Number.isFinite(density) &&
    density < 1000
  ) {
    score += 10;
  }

  // -----------------------------------------
  // 5. COST
  // -----------------------------------------

  const cost = Number(
    material.approximateCost ??
    material.cost ??
    material.costPerUnit ??
    Infinity
  );

  if (Number.isFinite(cost) && Number.isFinite(budget)) {
    if (cost < budget * 0.10) score += 10;
    else if (cost < budget * 0.20) score += 5;
  }

  return score;
}

/**
 * Recommend the best materials
 */
export function recommendMaterials({
  climate = {},
  shelterType = "Residential",
  budget = null,
  limit = 8
} = {}) {

  const materials = getAllMaterials();

  const scoredMaterials = materials.map((material) => ({
    ...material,
    recommendationScore: scoreMaterial(
      material,
      climate,
      shelterType,
      Number(budget)
    )
  }));

  return scoredMaterials
    .sort(
      (a, b) =>
        b.recommendationScore - a.recommendationScore
    )
    .slice(0, limit)
    .map((material) => ({
      ...material,
      recommendationReason: explainMaterialRecommendation(material, climate, shelterType)
    }));
}

/**
 * Get a specific material by name
 */
export function getMaterialByName(name) {
  if (!name) return null;

  const searchName = String(name).toLowerCase();

  return getAllMaterials().find((material) => {
    const materialName =
      material.materialName ||
      material.material ||
      material.name ||
      material.Material ||
      "";

    return String(materialName)
      .toLowerCase()
      .includes(searchName);
  }) || null;
}

/**
 * Get the source information
 */
export function getMaterialSources() {
  const ashrae = Array.isArray(ashraeReferences) ? ashraeReferences : ashraeReferences.records || [];
  return {
    nist: Array.isArray(nistMaterials) ? nistMaterials.length : 0,
    ashrae: ashrae.length,
    bis: bisStandards,
    sources: sourceRecords
  };
}

/**
 * Explain why a material was recommended
 */
export function explainMaterialRecommendation(
  material,
  climate,
  shelterType
) {
  const conductivity = getConductivity(material);
  const thermal = getThermalRequirement(climate);

  const reasons = [];

  if (Number.isFinite(conductivity)) {
    if (conductivity <= 0.10) {
      reasons.push(
        "Low thermal conductivity provides good insulation performance."
      );
    }
  }

  if (thermal.mode === "cold") {
    reasons.push(
      "Suitable for cold-climate heat-retention requirements."
    );
  }

  if (thermal.mode === "hot") {
    reasons.push(
      "Suitable for reducing unwanted heat transfer in hot conditions."
    );
  }

  reasons.push(
    `Recommendation evaluated for ${shelterType} shelter requirements.`
  );

  return reasons;
}