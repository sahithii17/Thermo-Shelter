import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ExistingResponse({ climate, brief, setPage }) {
  const challenges = [
    ["Heat loss", "Optimized envelope, insulation and a protected entry"],
    ["High solar exposure", "Climate-based orientation, shading and controlled glazing"],
    ["Strong wind", "Wind-responsive geometry and reduced exposed openings"],
    ["Snow / rain exposure", "Roof pitch, overhangs and drainage matched to the site"],
    ["Poor solar utilization", "Solar-oriented zones and right-sized energy features"],
    ["Generic planning", `${brief.shelterType} program with purpose-built circulation`],
    ["High energy demand", "Passive design first, with renewable energy where useful"],
    ["Material mismatch", "Climate, cost and local-suitability-aware material selection"]
  ];
  return <main className="page"><div className="page-heading"><div><span className="eyebrow">SITE RESPONSE · {brief.shelterType?.toUpperCase()}</span><h1>Existing shelter → Thermo Shelter response.</h1><p>Relevant assessment prompts for {climate.location}; existing buildings should be verified on site rather than assumed to have every weakness.</p></div><button className="primary-btn" onClick={() => setPage("designs")}>View concepts <ArrowRight size={18}/></button></div><div className="response-intro"><div><AlertTriangle size={20}/><b>Assessment lens</b><p>Prioritize the issues indicated by this climate profile: {climate.thermalPriority?.toLowerCase()}, {climate.windExposure?.toLowerCase()} wind exposure and {climate.precipitationExposure?.toLowerCase()} precipitation exposure.</p></div><div><CheckCircle2 size={20}/><b>Resolved brief</b><p>{brief.siteLength} × {brief.siteWidth} m · {brief.occupants} occupants · ₹{Number(brief.budget).toLocaleString("en-IN")}</p></div></div><div className="response-grid">{challenges.map(([challenge, response]) => <article className="response-row" key={challenge}><div><span className="eyebrow">EXISTING CHALLENGE</span><h2>{challenge}</h2></div><ArrowRight/><div><span className="eyebrow">THERMO SHELTER RESPONSE</span><p>{response}</p></div></article>)}</div></main>;
}
