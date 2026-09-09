const coldMaterials = [
  ["Foundation","Reinforced concrete strip foundation"],
  ["Structure","Light steel / engineered timber frame"],
  ["External wall","Insulated composite masonry wall"],
  ["Insulation","Mineral wool + rigid thermal insulation"],
  ["Roof","Insulated standing-seam metal roof"],
  ["Windows","Double-glazed low-E windows"],
  ["Door","Insulated solid-core exterior door"],
  ["Floor","Local stone / insulated concrete floor"],
  ["Exterior finish","Weather-resistant insulated render"]
];

const hotMaterials = [
  ["Foundation","Reinforced concrete strip foundation"],
  ["Structure","RCC / light steel frame"],
  ["External wall","Insulated masonry wall"],
  ["Insulation","Rigid thermal insulation"],
  ["Roof","Reflective insulated metal roof"],
  ["Windows","Low-E double glazing with operable vents"],
  ["Door","Insulated solid-core exterior door"],
  ["Floor","Cool concrete / local stone floor"],
  ["Exterior finish","Light-colored weather-resistant finish"]
];

const cold = [
  {
    id:"solar-core", name:"Solar Core", subtitle:"Compact passive-solar thermal core",
    form:"Compact rectangle", roof:"Mono-pitch solar roof", footprint:"10.5 × 8.0 m",
    area:84, cost:78, sustainability:91, comfort:94, windowArea:0.16, airtightness:0.91,
    solarExposure:92, strategies:["South solar glazing","Compact envelope","Deep insulation"],
    rooms:[
      ["entry","Thermal Entry",0.05,0.72,0.20,0.23],["living","Living + Dining",0.27,0.10,0.67,0.47],
      ["kitchen","Kitchen",0.27,0.60,0.31,0.32],["sleep","Sleeping",0.59,0.60,0.35,0.32],
      ["bath","Bath",0.05,0.10,0.20,0.48],["utility","Utility",0.05,0.48,0.20,0.22]
    ],
    materials:coldMaterials
  },
  {
    id:"thermal-buffer", name:"Thermal Buffer", subtitle:"Layered service band reduces cold-side losses",
    form:"Deep rectangle", roof:"Insulated gable roof", footprint:"12.0 × 7.0 m",
    area:84, cost:82, sustainability:88, comfort:96, windowArea:0.12, airtightness:0.95,
    solarExposure:82, strategies:["Service buffer","Low infiltration","Thermal zoning"],
    rooms:[
      ["buffer","Service Buffer",0.03,0.04,0.24,0.92],["living","Living",0.30,0.08,0.42,0.42],
      ["sleep","Sleeping",0.75,0.08,0.22,0.42],["kitchen","Kitchen",0.30,0.54,0.30,0.39],
      ["bath","Bath",0.62,0.54,0.17,0.39],["study","Study",0.81,0.54,0.16,0.39]
    ],
    materials:coldMaterials
  },
  {
    id:"sunspace", name:"Sunspace House", subtitle:"Solar greenhouse zone becomes a daytime thermal buffer",
    form:"Sunspace rectangle", roof:"South-facing mono pitch", footprint:"11.0 × 8.5 m",
    area:93, cost:86, sustainability:95, comfort:92, windowArea:0.22, airtightness:0.88,
    solarExposure:97, strategies:["Sunspace buffer","Solar collection","Night insulation"],
    rooms:[
      ["sun","Sunspace",0.03,0.04,0.94,0.22],["living","Living",0.06,0.31,0.52,0.37],
      ["kitchen","Kitchen",0.62,0.31,0.32,0.37],["sleep","Sleeping",0.06,0.72,0.42,0.23],
      ["bath","Bath",0.50,0.72,0.20,0.23],["entry","Entry",0.74,0.72,0.20,0.23]
    ],
    materials:coldMaterials
  },
  {
    id:"courtyard", name:"Sheltered Courtyard", subtitle:"Wind-protected compact U-form",
    form:"Courtyard U-form", roof:"Three-sided pitched roof", footprint:"11.5 × 9.0 m",
    area:91, cost:90, sustainability:89, comfort:95, windowArea:0.15, airtightness:0.93,
    solarExposure:86, strategies:["Wind shelter","Protected court","Compact mass"],
    rooms:[
      ["living","Living",0.04,0.05,0.38,0.40],["sleep","Sleeping",0.58,0.05,0.38,0.40],
      ["kitchen","Kitchen",0.04,0.55,0.27,0.38],["bath","Bath",0.35,0.55,0.27,0.38],
      ["court","Solar Courtyard",0.66,0.55,0.30,0.38]
    ],
    materials:coldMaterials
  },
  {
    id:"wind-smart", name:"Wind-Smart Pod", subtitle:"Aerodynamic raised pod for exposed sites",
    form:"Raised compact pod", roof:"Aerodynamic pitched roof", footprint:"9.5 × 8.0 m",
    area:76, cost:75, sustainability:87, comfort:91, windowArea:0.13, airtightness:0.90,
    solarExposure:80, strategies:["Aerodynamic form","Raised floor","Protected entry"],
    rooms:[
      ["entry","Airlock Entry",0.04,0.34,0.20,0.32],["living","Living",0.27,0.06,0.44,0.47],
      ["kitchen","Kitchen",0.75,0.06,0.20,0.30],["sleep","Sleeping",0.75,0.42,0.20,0.48],
      ["bath","Bath",0.27,0.60,0.20,0.31],["utility","Utility",0.50,0.60,0.20,0.31]
    ],
    materials:coldMaterials
  }
];

const hot = [
  {
    id:"breeze-courtyard", name:"Breeze Courtyard", subtitle:"Cross-ventilated courtyard house",
    form:"Courtyard U-form", roof:"Ventilated pitched roof", footprint:"11.5 × 9.0 m",
    area:91,cost:84,sustainability:94,comfort:93,windowArea:.25,airtightness:.72,solarExposure:62,
    strategies:["Cross ventilation","Deep shade","Night purge"],
    rooms:[
      ["living","Living",.04,.05,.38,.40],["sleep","Sleeping",.58,.05,.38,.40],
      ["kitchen","Kitchen",.04,.55,.27,.38],["bath","Bath",.35,.55,.27,.38],["court","Breeze Court",.66,.55,.30,.38]
    ],materials:hotMaterials
  },
  {
    id:"shade-spine", name:"Shade Spine", subtitle:"Linear plan with shaded circulation spine",
    form:"Linear bar", roof:"High ventilated roof", footprint:"13.0 × 7.0 m",
    area:91,cost:79,sustainability:91,comfort:90,windowArea:.22,airtightness:.70,solarExposure:58,
    strategies:["Shaded spine","Cross ventilation","Roof exhaust"],
    rooms:[
      ["shade","Shaded Spine",.03,.42,.94,.18],["living","Living",.03,.05,.43,.31],
      ["sleep","Sleeping",.50,.05,.47,.31],["kitchen","Kitchen",.03,.64,.28,.31],["bath","Bath",.35,.64,.20,.31],["study","Study",.58,.64,.39,.31]
    ],materials:hotMaterials
  },
  {
    id:"cool-mass", name:"Cool Mass", subtitle:"Thermal-mass core delays daytime heat",
    form:"Compact rectangle", roof:"Reflective flat roof", footprint:"10.0 × 8.0 m",
    area:80,cost:76,sustainability:88,comfort:92,windowArea:.15,airtightness:.78,solarExposure:55,
    strategies:["Thermal mass","Reflective roof","Small openings"],
    rooms:[
      ["living","Living",.04,.05,.56,.45],["sleep","Sleeping",.64,.05,.32,.45],
      ["kitchen","Kitchen",.04,.56,.28,.39],["bath","Bath",.35,.56,.25,.39],["mass","Cool Mass Core",.63,.56,.33,.39]
    ],materials:hotMaterials
  },
  {
    id:"vent-roof", name:"Vent Roof Pavilion", subtitle:"Butterfly roof drives high-level exhaust",
    form:"Butterfly pavilion", roof:"Butterfly ventilated roof", footprint:"12.0 × 8.0 m",
    area:96,cost:88,sustainability:96,comfort:95,windowArea:.28,airtightness:.65,solarExposure:60,
    strategies:["Stack ventilation","Roof monitors","Large shaded openings"],
    rooms:[
      ["living","Open Living",.04,.05,.55,.45],["sleep","Sleeping",.63,.05,.33,.45],
      ["kitchen","Kitchen",.04,.56,.26,.38],["bath","Bath",.33,.56,.20,.38],["court","Vent Court",.57,.56,.39,.38]
    ],materials:hotMaterials
  },
  {
    id:"porous", name:"Porous Pavilion", subtitle:"Lightweight openable plan for hot evenings",
    form:"Open pavilion", roof:"Large-overhang roof", footprint:"12.0 × 8.0 m",
    area:96,cost:72,sustainability:93,comfort:89,windowArea:.34,airtightness:.58,solarExposure:57,
    strategies:["Operable envelope","Large overhangs","Day/night mode"],
    rooms:[
      ["living","Open Living",.04,.06,.58,.46],["sleep","Sleeping",.66,.06,.30,.46],
      ["kitchen","Kitchen",.04,.58,.28,.35],["bath","Bath",.35,.58,.22,.35],["porch","Shaded Porch",.60,.58,.36,.35]
    ],materials:hotMaterials
  }
];

export function generateDesigns(climate, brief={}) {
  const type = brief.shelterType || "Residential";
  const programs = {
    Residential: ["Thermal Entry", "Living + Dining", "Kitchen", "Sleeping", "Bath", "Storage"],
    "Army / Field Accommodation": ["Protected Entry", "Sleeping Modules", "Equipment Store", "Shared Wash", "Utility", "Efficient Circulation"],
    "Research Laboratory": ["Controlled Entry", "Laboratory Workspace", "Equipment Area", "Sample Storage", "Staff Workroom", "Service Zone"],
    "Medical / Emergency": ["Reception", "Waiting", "Treatment", "Staff Base", "Clinical Storage", "Controlled Service"],
    "Transit / Bus Shelter": ["Protected Waiting", "Accessible Seating", "Information Zone", "Weather Buffer", "Service Cabinet"]
  };
  const labels = programs[type] || programs.Residential;
  return (climate.mode === "hot" ? hot : cold).map((d, index) => ({
    ...d,
    name: type === "Residential" ? d.name : `${type} ${["Core", "Spine", "Court", "Modules", "Pavilion"][index]}`,
    subtitle: `${type} program with climate-responsive planning`,
    rooms: d.rooms.map((room, roomIndex) => [room[0], labels[roomIndex % labels.length], room[2], room[3], room[4], room[5]]),
    shelterType: type,
    siteLength: Number(brief.siteLength) || 12,
    siteWidth: Number(brief.siteWidth) || 8,
    siteArea: Number(brief.siteArea) || (Number(brief.siteLength) || 12) * (Number(brief.siteWidth) || 8),
    location: climate.location,
    latitude: brief.latitude,
    longitude: brief.longitude,
    occupants: brief.occupants || 4,
    budget: Number(brief.budget) || 2500000,
    predictedCost: Math.round((d.area || 84) * (type === "Research Laboratory" ? 72000 : 38000 + index * 3500)),
    performance: null
  }));
}