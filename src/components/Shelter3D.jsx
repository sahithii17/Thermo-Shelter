import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Html } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";
import { Eye, Rotate3D, DoorOpen, Thermometer } from "lucide-react";

function House({design,mode}) {
  const roof = design.roof.toLowerCase();
  const roofColor = design.id.includes("solar") || design.id==="sunspace" ? "#e9a23b" : "#344d6e";
  const wall = mode==="thermal" ? "#ef8a70" : "#dbe7f2";
  const glass = "#65c9e8";
  const roofGeo = roof.includes("butterfly") ? <mesh rotation={[0,0,0]} position={[0,2.8,0]}><boxGeometry args={[5.9,.18,3.2]}/><meshStandardMaterial color={roofColor}/></mesh> :
    roof.includes("flat") ? <mesh position={[0,2.55,0]}><boxGeometry args={[6.4,.22,4.1]}/><meshStandardMaterial color={roofColor}/></mesh> :
    <mesh rotation={[0,0,roof.includes("mono")||roof.includes("solar")?.18:0]} position={[0,2.65,0]}><boxGeometry args={[6.3,.22,4.3]}/><meshStandardMaterial color={roofColor}/></mesh>;
  const Window=({x,z,rot=0})=><mesh position={[x,1.05,z]} rotation={[0,rot,0]}><boxGeometry args={[1.2,.85,.06]}/><meshStandardMaterial color={glass} metalness={.2} roughness={.2}/></mesh>;
  return <group>
    <mesh position={[0,1,0]}><boxGeometry args={[6.2,2.5,4]}/><meshStandardMaterial color={wall} roughness={.8}/></mesh>
    {roofGeo}
    <Window x={-1.7} z={-2.03}/><Window x={1.2} z={-2.03}/><Window x={-3.13} z={0} rot={Math.PI/2}/><Window x={3.13} z={.8} rot={Math.PI/2}/>
    <mesh position={[0,.65,-2.07]}><boxGeometry args={[.75,1.35,.08]}/><meshStandardMaterial color="#6b4a36"/></mesh>
    {design.id==="sunspace" && <mesh position={[0,1.2,2.08]}><boxGeometry args={[5.7,1.9,.08]}/><meshStandardMaterial color={glass} transparent opacity={.55}/></mesh>}
    {design.id==="courtyard"||design.id==="breeze-courtyard" ? <mesh position={[0,.25,.8]}><boxGeometry args={[2.1,.08,1.4]}/><meshStandardMaterial color="#7acb88"/></mesh>:null}
    {mode==="interior" && <Html position={[0,1.7,0]} center><div className="model-label">Interior cutaway · {design.name}</div></Html>}
    {mode==="thermal" && <mesh position={[0,1.25,2.09]}><planeGeometry args={[5.8,2.1]}/><meshBasicMaterial color="#ff6b55" transparent opacity={.26}/></mesh>}
  </group>
}

export default function Shelter3D({design}) {
 const [mode,setMode]=useState("exterior");
 return <div className="model-shell"><div className="model-head"><div><b>Interactive 3D Model</b><small>Drag to orbit · scroll to zoom · right-drag to pan</small></div><div className="model-tabs">{[["exterior",Eye],["interior",DoorOpen],["thermal",Thermometer]].map(([m,I])=><button key={m} className={mode===m?"active":""} onClick={()=>setMode(m)}><I size={15}/>{m}</button>)}</div></div>
 <div className="model-view"><Canvas shadows><PerspectiveCamera makeDefault position={[8,5.5,9]} fov={42}/><ambientLight intensity={1.8}/><directionalLight position={[6,10,5]} intensity={3} castShadow/><Environment preset="city"/><House design={design} mode={mode}/><gridHelper args={[18,18,"#8fa5bd","#d8e1eb"]}/><OrbitControls enableDamping minDistance={5} maxDistance={18} target={[0,1,0]}/></Canvas><div className="model-hint"><Rotate3D size={16}/> Fully draggable 3D inspection</div></div></div>
}