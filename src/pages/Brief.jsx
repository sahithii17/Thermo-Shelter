import { useState } from "react";
import { MapPin, Users, WalletCards, Ruler, Building2, ArrowRight, Search } from "lucide-react";
import { resolveLocation } from "../services/api";

const shelterTypes = ["Residential", "Army / Field Accommodation", "Research Laboratory", "Medical / Emergency", "Educational", "Community", "Transit / Bus Shelter", "Storage / Utility", "Custom"];

export default function Brief({ brief, setBrief, setPage }) {
  const [form, setForm] = useState(brief);
  const [resolved, setResolved] = useState(null);
  const [error, setError] = useState("");
  const update = (key, value) => setForm((current) => {
    const next = { ...current, [key]: value };
    if (key === "location") { delete next.latitude; delete next.longitude; delete next.elevation; setResolved(null); }
    return next;
  });
  async function locate() {
    setError("");
    if (!form.location.trim()) { setError("Enter a location name first."); return; }
    try { setResolved(await resolveLocation(form.location)); } catch (e) { setError(e.message); }
  }
  function submit() {
    if (!form.location || !Number(form.siteLength) || !Number(form.siteWidth) || !Number(form.occupants) || !Number(form.budget)) { setError("Enter a location, positive site dimensions, occupants and budget."); return; }
    const latitude = Number(form.latitude); const longitude = Number(form.longitude);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) { setError("Latitude must be between -90 and 90 and longitude between -180 and 180."); return; }
    setBrief({ ...form, latitude, longitude, siteLength: Number(form.siteLength), siteWidth: Number(form.siteWidth), siteArea: Number(form.siteLength) * Number(form.siteWidth), occupants: Number(form.occupants), budget: Number(form.budget) });
    setPage("climate");
  }
  const hasCoordinates = form.latitude !== undefined && form.longitude !== undefined;
  return <main className="page hero-page"><div className="hero-copy"><span className="eyebrow">CLIMATE-ADAPTIVE ARCHITECTURE</span><h1>Design a shelter that <em>responds</em> to its climate.</h1><p>Thermo Shelter turns site conditions, climate intelligence and thermal performance into distinct architectural concepts.</p></div><div className="brief-card"><div className="brief-title"><div><span className="eyebrow">01 · SITE BRIEF</span><h2>Tell us about the project</h2></div><div className="pulse-dot"/></div><label><MapPin/> Location<input value={form.location || ""} onChange={(e) => update("location", e.target.value)} placeholder="Leh, Ladakh or any place worldwide"/><button className="icon-btn" onClick={locate} title="Resolve location"><Search size={16}/></button></label>{resolved && <div className="resolved-location">Resolved: {resolved.name}, {resolved.admin1 || resolved.country} · {Number(resolved.latitude).toFixed(4)}, {Number(resolved.longitude).toFixed(4)} <button onClick={() => setForm({ ...form, ...resolved, location: `${resolved.name}, ${resolved.admin1 || resolved.country}` })}>Confirm</button></div>}<div className="form-two"><label>Latitude<input type="number" min="-90" max="90" step="any" value={form.latitude ?? ""} onChange={(e) => update("latitude", e.target.value)} placeholder="-90 to 90"/></label><label>Longitude<input type="number" min="-180" max="180" step="any" value={form.longitude ?? ""} onChange={(e) => update("longitude", e.target.value)} placeholder="-180 to 180"/></label></div><div className="form-two"><label><Ruler/> Site length (m)<input type="number" min="1" value={form.siteLength ?? ""} onChange={(e) => update("siteLength", e.target.value)}/></label><label>Site width (m)<input type="number" min="1" value={form.siteWidth ?? ""} onChange={(e) => update("siteWidth", e.target.value)}/></label></div><div className="form-two"><label><Users/> Occupants<input type="number" min="1" value={form.occupants ?? ""} onChange={(e) => update("occupants", e.target.value)}/></label><label><WalletCards/> Maximum budget (₹)<input type="number" min="1" value={form.budget ?? ""} onChange={(e) => update("budget", e.target.value)}/></label></div><label><Building2/> Shelter type<select value={form.shelterType} onChange={(e) => update("shelterType", e.target.value)}>{shelterTypes.map((type) => <option key={type}>{type}</option>)}</select></label>{hasCoordinates && <small className="coordinates">Using coordinates {Number(form.latitude).toFixed(4)}, {Number(form.longitude).toFixed(4)}</small>}{error && <div className="error-banner">{error}</div>}<button className="primary-btn" onClick={hasCoordinates ? submit : locate}>{hasCoordinates ? "Analyze climate" : "Resolve location"} <ArrowRight size={18}/></button></div><div className="method-strip"><span>Location intelligence</span><i>→</i><span>Generative architecture</span><i>→</i><span>Thermal verification</span><i>→</i><span>Optimization</span></div></main>;
}
