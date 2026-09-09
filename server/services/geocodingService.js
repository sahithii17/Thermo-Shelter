export async function geocodeLocation(query) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  const response = await fetch(url);
  if (!response.ok) throw new Error("Location service is unavailable");
  const data = await response.json();
  let result = data.results?.find((item) => item.name.toLowerCase() === query.trim().toLowerCase());
  result ||= data.results?.find((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()) && item.feature_code?.startsWith("PPL"));
  result ||= data.results?.find((item) => item.feature_code?.startsWith("PPLC") || item.feature_code?.startsWith("ADM"));
  if (!result) {
    const fallbackUrl = new URL("https://nominatim.openstreetmap.org/search");
    fallbackUrl.searchParams.set("q", query);
    fallbackUrl.searchParams.set("format", "jsonv2");
    fallbackUrl.searchParams.set("addressdetails", "1");
    const fallbackResponse = await fetch(fallbackUrl, { headers: { "User-Agent": "ThermoShelter/1.0 location analysis" } });
    const fallback = await fallbackResponse.json();
    const item = fallback[0];
    if (item) result = { name: item.name || item.display_name.split(",")[0], country: item.address?.country, country_code: item.address?.country_code, admin1: item.address?.state || item.address?.region, admin2: item.address?.county, latitude: Number(item.lat), longitude: Number(item.lon), elevation: null, timezone: null };
  }
  if (!result) {
    const error = new Error("Location not found. Try a city, region, or country name.");
    error.status = 404;
    throw error;
  }
  return { name: result.name, country: result.country, countryCode: result.country_code, admin1: result.admin1, admin2: result.admin2, latitude: result.latitude, longitude: result.longitude, elevation: result.elevation, timezone: result.timezone };
}
