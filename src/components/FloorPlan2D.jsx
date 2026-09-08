import { useState } from "react";
import { Plus, Minus, RotateCcw, Sun, Compass } from "lucide-react";
export default function FloorPlan2D({design,thermal}) {
  const [zoom,setZoom]=useState(1); const [heat,setHeat]=useState(false);
  return <div className="plan-shell">
    <div className="plan-toolbar">
      <div><b>2D Architectural Plan</b><small>{design.form} · {design.footprint}</small></div>
      <div className="toolbar-actions">
        <button onClick={()=>setHeat(!heat)} className={heat?"selected":""}><Sun size={15}/> Thermal</button>
        <button onClick={()=>setZoom(Math.min(1.7,zoom+.1))}><Plus size={15}/></button><button onClick={()=>setZoom(Math.max(.7,zoom-.1))}><Minus size={15}/></button><button onClick={()=>setZoom(1)}><RotateCcw size={15}/></button>
      </div>
    </div>
    <div className="plan-canvas"><svg viewBox="0 0 1000 680" style={{transform:`scale(${zoom})`}}>
      <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#dfe7f2" strokeWidth="1"/></pattern>
      <filter id="shadow"><feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity=".14"/></filter></defs>
      <rect width="1000" height="680" fill="url(#grid)"/>
      <g transform="translate(90 75)" filter="url(#shadow)">
        <rect width="820" height="510" rx="8" fill="#fff" stroke="#182b49" strokeWidth="10"/>
        {design.rooms.map(([id,label,x,y,w,h])=>{
          const p=thermal?.zones?.find(z=>z.id===id)?.value || 50;
          return <g key={id}><rect x={x*820} y={y*510} width={w*820} height={h*510} fill={heat?`hsl(${Math.max(0,120-p*1.15)},82%,68%)`:"#f8fbff"} stroke="#51677f" strokeWidth="3"/>
            <text x={(x+w/2)*820} y={(y+h/2)*510} textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="700" fill="#1c2d45">{label}</text>
          </g>
        })}
        <rect x="390" y="505" width="120" height="18" fill="#fff"/><text x="450" y="555" textAnchor="middle" fontSize="14">MAIN ENTRY</text>
      </g>
      <g transform="translate(830 25)"><circle cx="45" cy="45" r="35" fill="#fff" stroke="#172b49" strokeWidth="3"/><path d="M45 15L55 58L45 50L35 58Z" fill="#172b49"/><text x="45" y="82" textAnchor="middle" fontSize="13" fontWeight="700">N</text></g>
      <g transform="translate(100 610)"><Sun size="20"/><text x="28" y="16" fontSize="14">Solar / thermal orientation</text></g>
    </svg></div>
    <div className="plan-legend"><span><i className="legend-wall"/> Wall</span><span><i className="legend-room"/> Room</span><span><i className="legend-sun"/> Solar edge</span><span><Compass size={15}/> North up</span></div>
  </div>
}