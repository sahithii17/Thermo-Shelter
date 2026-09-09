const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8787/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The Thermo Shelter service is unavailable");
  return data;
}

export const resolveLocation = (query) => request("/location/analyze", { method: "POST", body: JSON.stringify({ query }) });
export const analyzeRemoteClimate = (input) => request("/climate/analyze", { method: "POST", body: JSON.stringify(input) });
export const generateRemoteDesigns = (input) => request("/designs/generate", { method: "POST", body: JSON.stringify(input) });
export const simulateRemote = (design, climate) => request("/thermal/simulate", { method: "POST", body: JSON.stringify({ design, climate }) });
export const optimizeRemote = (designs) => request("/optimization/run", { method: "POST", body: JSON.stringify({ designs }) });
