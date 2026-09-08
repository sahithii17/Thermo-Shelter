import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Brief from "./pages/Brief"; import Climate from "./pages/Climate"; import Designs from "./pages/Designs"; import Simulation from "./pages/Simulation"; import Results from "./pages/Results";
import { analyzeClimate } from "./data/climateData"; import { generateDesigns } from "./architecture/designGenerator";
export default function App(){
 const [page,setPage]=useState("brief"); const [brief,setBrief]=useState({location:"Ladakh",occupants:4,budget:"Medium"});
 const [climate,setClimate]=useState(analyzeClimate("Ladakh")); const [designs,setDesigns]=useState([]);
 useEffect(()=>{const c=analyzeClimate(brief.location);setClimate(c);setDesigns(generateDesigns(c,brief))},[brief.location,brief.occupants,brief.budget]);
 const content=page==="brief"?<Brief brief={brief} setBrief={setBrief} setPage={setPage}/>:page==="climate"?<Climate climate={climate} setPage={setPage}/>:page==="designs"?<Designs designs={designs} setDesigns={setDesigns} setPage={setPage} climate={climate}/>:page==="simulation"?<Simulation designs={designs} setDesigns={setDesigns} climate={climate} setPage={setPage}/>:<Results designs={designs} climate={climate} setPage={setPage}/>;
 return <><Nav page={page} setPage={setPage}/>{content}<footer>THERMO SHELTER <span>•</span> Climate-adaptive design prototype</footer></>
}