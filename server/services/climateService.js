function average(values = []) {
  const usable = values.filter((value) => Number.isFinite(value));
  return usable.length ? usable.reduce((sum, value) => sum + value, 0) / usable.length : null;
}

export async function fetchClimate({ latitude, longitude, location, elevation }) {
  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  const end = new Date();
  const start = new Date(end);
  start.setFullYear(end.getFullYear() - 5);
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("start_date", start.toISOString().slice(0, 10));
  url.searchParams.set("end_date", end.toISOString().slice(0, 10));
  url.searchParams.set("daily", "temperature_2m_mean,temperature_2m_min,temperature_2m_max,relative_humidity_2m_mean,precipitation_sum,rain_sum,snowfall_sum,windspeed_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,sunrise,sunset");
  url.searchParams.set("timezone", "auto");
  const response = await fetch(url);
  if (!response.ok) throw new Error("Climate service is unavailable for this location");
  const data = await response.json();
  const daily = data.daily || {};
  const mins = daily.temperature_2m_min || [];
  const maxes = daily.temperature_2m_max || [];
  if (!daily.temperature_2m_mean?.length) throw new Error("Climate data is unavailable for these coordinates");
  const climate = {
    location, latitude: Number(latitude), longitude: Number(longitude), elevation: elevation ?? data.elevation ?? null,
    avgTemp: average(daily.temperature_2m_mean), minTemp: mins.length ? Math.min(...mins) : null, maxTemp: maxes.length ? Math.max(...maxes) : null,
    humidity: average(daily.relative_humidity_2m_mean), rainfall: average(daily.rain_sum), precipitation: average(daily.precipitation_sum), snowfall: average(daily.snowfall_sum),
    wind: average(daily.windspeed_10m_max), windDirection: average(daily.winddirection_10m_dominant), solar: average(daily.shortwave_radiation_sum) / 1000,
    source: "Open-Meteo archive, five-year daily averages", estimated: false
  };
  const cold = climate.avgTemp < 15 || climate.minTemp < 0;
  climate.mode = cold ? "cold" : climate.avgTemp > 25 ? "hot" : "temperate";
  climate.thermalPriority = cold ? "Retain heat" : climate.mode === "hot" ? "Reject heat" : "Balance heat and ventilation";
  climate.windExposure = climate.wind > 5 ? "High" : climate.wind > 2.5 ? "Moderate" : "Low";
  climate.precipitationExposure = (climate.snowfall || 0) > 2 ? "Snow-aware" : climate.precipitation > 4 ? "Rain-aware" : "Low";
  climate.note = `${climate.mode[0].toUpperCase() + climate.mode.slice(1)} climate with ${climate.windExposure.toLowerCase()} wind exposure and ${climate.precipitationExposure.toLowerCase()} precipitation exposure.`;
  climate.strategies = cold ? ["Compact insulated envelope", "Solar-oriented living zones", "Protected entry and low infiltration"] : climate.mode === "hot" ? ["Deep external shading", "Cross ventilation and night purge", "Reflective roof with thermal mass"] : ["Adjustable shading", "Mixed-mode ventilation", "Balanced envelope insulation"];
  return climate;
}
