export const climateData = {
  Ladakh: {
    mode: "cold",
    avgTemp: -2,
    minTemp: -18,
    maxTemp: 15,
    solar: 6.4,
    wind: 4.8,
    rainfall: 110,
    humidity: 34,
    altitude: 3500,
    note: "Cold, high-altitude climate with strong solar exposure and winter heat-loss risk."
  },
  Hyderabad: {
    mode: "hot",
    avgTemp: 28,
    minTemp: 18,
    maxTemp: 39,
    solar: 5.8,
    wind: 2.7,
    rainfall: 780,
    humidity: 58,
    altitude: 540,
    note: "Warm climate where shading, ventilation and heat rejection are important."
  },
  Delhi: {
    mode: "hot",
    avgTemp: 27,
    minTemp: 7,
    maxTemp: 42,
    solar: 5.7,
    wind: 2.4,
    rainfall: 650,
    humidity: 52,
    altitude: 216,
    note: "Hot summers with strong solar gains and seasonal humidity."
  }
};

export function analyzeClimate(location = "Ladakh") {
  const key = Object.keys(climateData).find(k => k.toLowerCase() === location.toLowerCase()) || "Ladakh";
  return { location: key, ...climateData[key] };
}