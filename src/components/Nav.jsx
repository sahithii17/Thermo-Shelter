import { ThermometerSun, Map, Layers3, Cpu, Sparkles } from "lucide-react";
export default function Nav({page,setPage}) {
  const items=[["brief","Site Brief",Map],["climate","Climate",ThermometerSun],["designs","Design Lab",Layers3],["simulation","Thermal Lab",Cpu],["results","Final Designs",Sparkles]];
  return <header className="topbar">
    <div className="brand" onClick={()=>setPage("brief")}><div className="brand-mark">T</div><div><b>Thermo Shelter</b><span>Climate-adaptive architecture</span></div></div>
    <nav>{items.map(([id,label,I])=><button className={page===id?"active":""} onClick={()=>setPage(id)} key={id}><I size={17}/>{label}</button>)}</nav>
  </header>
}