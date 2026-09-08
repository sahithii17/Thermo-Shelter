export default function ClimateChart({climate}) {
  const vals=[climate.minTemp,climate.avgTemp,climate.maxTemp];
  return <div className="climate-chart"><div className="chart-title">Temperature envelope</div><div className="bars">{vals.map((v,i)=><div className="bar-wrap" key={i}><div className="bar" style={{height:`${Math.max(12,Math.min(100,(v+20)/62*100))}%`}}></div><span>{["Min","Avg","Max"][i]}</span><b>{v}°C</b></div>)}</div></div>
}