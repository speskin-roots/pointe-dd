import { useState } from "react";

// ── SHARED CONSTANTS ────────────────────────────────────────────────────────
const CONTRACT_TOTAL = 23000000;
const POINTE_UNITS = 518;
const OAK_UNITS = 182;
const TOTAL_DOORS = 700;
const PRICE_PER_DOOR = CONTRACT_TOTAL / TOTAL_DOORS; // ~32,857

// Blended price split pro-rata by doors
const POINTE_PRICE = Math.round((POINTE_UNITS / TOTAL_DOORS) * CONTRACT_TOTAL);
const OAK_PRICE    = Math.round((OAK_UNITS   / TOTAL_DOORS) * CONTRACT_TOTAL);

const OAK = {
  totalUnits:182, occupied:147, vacant:36, occPct:80.77,
  avgMarketRent:762.80, avgLeasedRent:709.10,
  totalMarketMonthly:138830, totalBillingMonthly:106462,
  totalRentMonthly:104237, parkingMonthly:2225,
  annualBilling:106462*12, annualMarketPotential:138830*12,
};
const DEL = {
  total:99797.93, current:35198.67, d30:14845.33, d60:8687.50, d90:41066.43,
};

// ── HELPERS ─────────────────────────────────────────────────────────────────
const fmt  = n => n.toLocaleString("en-US",{maximumFractionDigits:0});
const fmtD = n => "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtM = n => "$"+(n/1e6).toFixed(2)+"M";

const Section = ({title,color,children}) => (
  <div style={{marginBottom:18,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.08)"}}>
    <div style={{background:color,padding:"9px 18px"}}>
      <h3 style={{margin:0,color:"#fff",fontSize:13,fontWeight:700,letterSpacing:0.3}}>{title}</h3>
    </div>
    <div style={{background:"#fff",padding:"14px 18px"}}>{children}</div>
  </div>
);
const Row = ({label,value,sub,flag}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"6px 0",borderBottom:"1px solid #f1f5f9"}}>
    <span style={{fontSize:12,color:"#475569",flex:1,paddingRight:12}}>{label}</span>
    <div style={{textAlign:"right",minWidth:180}}>
      <span style={{fontSize:12,fontWeight:700,color:flag==="red"?"#dc2626":flag==="green"?"#16a34a":flag==="yellow"?"#d97706":"#1e293b"}}>{value}</span>
      {sub&&<div style={{fontSize:10,color:"#94a3b8"}}>{sub}</div>}
    </div>
  </div>
);
const Badge = ({text,color}) => (
  <span style={{display:"inline-block",padding:"2px 9px",borderRadius:20,fontSize:10,fontWeight:700,marginRight:5,marginBottom:4,
    background:color==="red"?"#fee2e2":color==="yellow"?"#fef3c7":color==="green"?"#dcfce7":"#e0e7ff",
    color:color==="red"?"#dc2626":color==="yellow"?"#b45309":color==="green"?"#15803d":"#4338ca"}}>{text}</span>
);
const Alrt = ({type,children}) => (
  <div style={{background:type==="red"?"#fef2f2":type==="yellow"?"#fffbeb":type==="purple"?"#f5f3ff":"#f0fdf4",
    border:`1px solid ${type==="red"?"#fca5a5":type==="yellow"?"#fcd34d":type==="purple"?"#c4b5fd":"#86efac"}`,
    borderRadius:8,padding:"9px 13px",marginBottom:10,fontSize:12,
    color:type==="red"?"#991b1b":type==="yellow"?"#92400e":type==="purple"?"#4c1d95":"#166534"}}>{children}</div>
);
const KpiGrid = ({items}) => (
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:16}}>
    {items.map(({label,value,color,sub})=>(
      <div key={label} style={{background:"#fff",borderRadius:10,padding:"11px 8px",textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
        <div style={{fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",marginBottom:2}}>{label}</div>
        <div style={{fontSize:15,fontWeight:900,color}}>{value}</div>
        {sub&&<div style={{fontSize:9,color:"#94a3b8",marginTop:1}}>{sub}</div>}
      </div>
    ))}
  </div>
);

// ── EXIT MODEL CALC ─────────────────────────────────────────────────────────
function calcRows(scenarios, numUnits, expR, capR) {
  return scenarios.map(s => {
    const egi  = numUnits * s.rent * s.occ * 12;
    const noi  = egi * (1 - expR/100);
    const val  = noi / (capR/100);
    return { ...s, egi, noi, val, perDoor: val/numUnits };
  });
}

// ── COMP DATA ────────────────────────────────────────────────────────────────
const pointeComps = [
  {name:"Las Plazas ⭐ PRIMARY COMP",addr:"3940 S Shaver St — DIRECTLY ACROSS THE STREET",dist:"0 mi",built:"1964",units:"80",occ:"90%+ occupied · <5% delinquency",occF:"green",rents:"Magnolia 1BR/580sf $809 · Willow 1BR/620sf $829 · Palm 2BR/750sf $949 · Cypress 2BR/925sf $999 · Oak 3BR/1200sf $1,299",eff:"$809–$1,299 confirmed asking",note:"🏆 BEST DIRECT COMP — across the street, same vintage, $13K/door renovation, 90%+ occ, <5% delinquency, waiting list on all 2BR+. ⚠️ 1BRs are the ONLY struggle — direct signal for Pointe's 1BR lease-up strategy.",noteF:"green",ph:"(346) 980-7106",primary:true,
    floorplans:[
      {name:"Magnolia",bed:"1BR/1BA",sqft:580, rent:809},
      {name:"Willow",  bed:"1BR/1BA",sqft:620, rent:829},
      {name:"Palm",    bed:"2BR",    sqft:750, rent:949},
      {name:"Cypress", bed:"2BR",    sqft:925, rent:999},
      {name:"Oak",     bed:"3BR",    sqft:1200,rent:1299},
    ]},
  {name:"Veranda Village",addr:"3635 Shaver St, Pasadena TX",dist:"~3 mi",built:"1971",units:"329–422",occ:"Low",occF:"red",rents:"$549–~$1,050",eff:"~$549–$800 effective",note:"⚠️ Weakest comp — sets the floor. Significant deferred maintenance.",noteF:"red"},
  {name:"Quay Point",addr:"3925 Arlington Square Dr, Houston TX",dist:"~4 mi",built:"1963",units:"134",occ:"~14% vacancy",occF:"red",rents:"$660–$1,020",eff:"~$660–$900",note:"Active vacancy with price-drop promotions.",noteF:"yellow"},
  {name:"Willow Tree (SMI Realty)",addr:"4910 Allendale Rd, Houston TX",dist:"~4 mi",built:"1974",units:"206",occ:"5 units listed",occF:"yellow",rents:"1BR $830 | 2BR $855",eff:"~$830–$1,195",note:"🔍 1BR at $830 is BELOW The Pointe's $912 avg — partial reno doesn't justify premium.",noteF:"yellow",ph:"(832) 706-4314"},
  {name:"Las Plazas",addr:"3940 S Shaver St, Houston TX",dist:"~4 mi",built:"1964",units:"80",occ:"Active availability",occF:"yellow",rents:"1BR $809–$829 | 2BR $949–$999",eff:"~$809–$1,100",note:"📋 $1.35M reno ($17K/unit) still yields 1BR BELOW Pointe avg.",noteF:"yellow",ph:"(346) 980-7106"},
  {name:"Quarters on Red Bluff",addr:"2300 Red Bluff Rd, Pasadena TX",dist:"~1.5 mi",built:"1971",units:"170",occ:"95% occupied",occF:"green",rents:"1BR $840–$975 | 2BR $975–$1,250",eff:"~$840–$1,100",note:"✅ Same 1971 vintage, same submarket, 95% occ. Best proof of concept.",noteF:"green",ph:"(713) 473-5521"},
  {name:"Vista Azul",addr:"3500 Red Bluff Rd, Pasadena TX",dist:"~1 mi",built:"1971",units:"308",occ:"106 units vacant",occF:"red",rents:"1BR $849–$925 | 2BR $1,100–$1,199",eff:"~$749–$1,050",note:"⚠️ Full reno + poor management = 106 vacancies. Management is the differentiator.",noteF:"yellow",ph:"(346) 222-4228"},
  {name:"Terracita",addr:"801 S Allen-Genoa Rd, South Houston TX",dist:"~3 mi",built:"1962",units:"177",occ:"91.5% occupied",occF:"green",rents:"$939–$1,579 All Bills Paid",eff:"~$815–$1,050 ex-utilities",note:"✅ Best stabilized comp. Normalize -$100–$125/mo for utilities.",noteF:"green"},
  {name:"Red Pines ⭐ ASPIRATIONAL",addr:"3823 Red Bluff Rd, Pasadena TX",dist:"~2 mi",built:"Vintage — gut-reno",units:"Mid-size",occ:"Active — 5-star, stable",occF:"green",rents:"Studio $749 | 1BR $899–$929 | 2BR $1,099–$1,175 | 3BR $1,499",eff:"$749–$1,499 — no concessions",note:"🏆 Same Pasadena submarket, fully repositioned. Rent ceiling for The Pointe.",noteF:"green",ph:"(832) 219-6757",asp:true},
];
const oakComps = [
  {name:"Silver Club",addr:"5160 Silver Creek Dr, Houston TX",dist:"~0.15 mi",built:"1960–62",units:"45",occ:"Active",occF:"yellow",rents:"$950–$1,050",eff:"~$950–$1,050",note:"Closest comp to Oak Shadows. Updated tile/granite. Sets nearby floor.",noteF:"yellow"},
  {name:"Willow Tree (SMI Realty)",addr:"4910 Allendale Rd, Houston TX",dist:"~4 mi",built:"1974",units:"206",occ:"5 units listed",occF:"yellow",rents:"1BR $830 | 2BR $855",eff:"~$830–$1,195",note:"🔍 Partial reno, bilingual management. Similar workforce profile.",noteF:"yellow",ph:"(832) 706-4314"},
  {name:"Terracita",addr:"801 S Allen-Genoa Rd, South Houston TX",dist:"~3 mi",built:"1962",units:"177",occ:"91.5% occupied",occF:"green",rents:"$939–$1,579 All Bills Paid",eff:"~$815–$1,050 ex-utilities",note:"✅ Best stabilized reference for Oak Shadows post-renovation ceiling.",noteF:"green"},
  {name:"Red Pines ⭐ ASPIRATIONAL",addr:"3823 Red Bluff Rd, Pasadena TX",dist:"~2 mi",built:"Vintage — gut-reno",units:"Mid-size",occ:"Active — stable leasing",occF:"green",rents:"Studio $749 | 1BR $899–$929 | 2BR $1,099–$1,175",eff:"$749–$1,175 — no concessions",note:"🏆 Aspirational ceiling for Oak Shadows if fully repositioned.",noteF:"green",ph:"(832) 219-6757",asp:true},
];

const oakMix = [
  {type:"1x1-450",sqft:450,mkt:500, total:1, occ:1, occPct:100,avgLeased:500, avail:0,rentGap:0,   note:"Single unit — essentially market"},
  {type:"1x1-490",sqft:490,mkt:750, total:58,occ:55,occPct:94.83,avgLeased:625,avail:3,rentGap:-125,note:"Strong demand. $125/door below market. Biggest rent uplift pool."},
  {type:"1x1-520",sqft:520,mkt:595, total:49,occ:43,occPct:87.76,avgLeased:656,avail:7,rentGap:+61, note:"⚠️ Market rate OUTDATED. True market ~$670–$720."},
  {type:"2x1-1167",sqft:1167,mkt:1200,total:1,occ:1,occPct:100,avgLeased:600,avail:0,rentGap:-600,note:"🔴 PW EMPLOYEE @ $600 vs $1,200 market. Pull lease immediately."},
  {type:"2x1-745",sqft:745,mkt:895, total:1, occ:1, occPct:100,avgLeased:850, avail:0,rentGap:-45, note:"Near market."},
  {type:"2x1-750",sqft:750,mkt:895, total:50,occ:32,occPct:64,  avgLeased:879, avail:18,rentGap:-16,note:"🔴 BIGGEST PROBLEM: 18 of 50 vacant. Occupancy crisis, not pricing."},
  {type:"2x1-756",sqft:756,mkt:895, total:1, occ:1, occPct:100,avgLeased:600, avail:0,rentGap:-295,note:"$295 below market. Renew to market at lease end."},
  {type:"2x1-847",sqft:847,mkt:895, total:1, occ:1, occPct:100,avgLeased:895, avail:0,rentGap:0,   note:"At market."},
  {type:"2x1-850",sqft:850,mkt:950, total:13,occ:7, occPct:53.85,avgLeased:941,avail:6,rentGap:-9, note:"🔴 53.8% occ — 6 of 13 vacant. Inspect all."},
  {type:"2x1-950",sqft:950,mkt:1150,total:1, occ:1, occPct:100,avgLeased:1150,avail:0,rentGap:0,   note:"At market."},
  {type:"STU-340",sqft:340,mkt:590, total:6, occ:4, occPct:66.67,avgLeased:580,avail:2,rentGap:-10, note:"2 studios vacant. Near market on occupied."},
];

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [prop, setProp] = useState("combined"); // "combined" | "pointe" | "oak"
  const [tab,  setTab]  = useState("summary");
  const [pointeAllocPct, setPointeAllocPct] = useState(Math.round(POINTE_UNITS/TOTAL_DOORS*100)); // default ~74%

  // Exit model state — Pointe
  const [pCapR, setPCapR] = useState(7.5);
  const [pExpR, setPExpR] = useState(58);
  const [pRenoK,setPRenoK]= useState(13);
  const [pHold, setPHold] = useState(3);
  // Exit model state — Oak
  const [oCapR, setOCapR] = useState(7.5);
  const [oExpR, setOExpR] = useState(50);
  const [oRenoK,setORenoK]= useState(5);
  const [oHold, setOHold] = useState(3);

  const PROPS = [
    {id:"combined", label:"📋 Combined Portfolio", color:"#0f172a", accent:"#3b82f6"},
    {id:"pointe",   label:"🏢 The Pointe",          color:"#1e3a5f", accent:"#60a5fa"},
    {id:"oak",      label:"🏠 Oak Shadows",          color:"#14532d", accent:"#4ade80"},
  ];

  const tabSets = {
    combined: [
      {id:"summary",   label:"📋 Summary"},
      {id:"risks",     label:"⚠️ Risks"},
      {id:"nextsteps", label:"✅ Next Steps"},
    ],
    pointe: [
      {id:"overview",  label:"🏢 Overview"},
      {id:"market",    label:"📊 Market"},
      {id:"comps",     label:"🏢 Comps"},
      {id:"exit",      label:"💰 Exit Model"},
      {id:"risks",     label:"⚠️ Risks"},
      {id:"nextsteps", label:"✅ Next Steps"},
      {id:"econ",      label:"🏭 Economic Intel"},
    ],
    oak: [
      {id:"overview",     label:"🏠 Overview"},
      {id:"delinquency",  label:"💸 Delinquency"},
      {id:"market",       label:"📊 Market"},
      {id:"comps",        label:"🏢 Comps"},
      {id:"exit",         label:"💰 Exit Model"},
      {id:"risks",        label:"⚠️ Risks"},
      {id:"nextsteps",    label:"✅ Next Steps"},
      {id:"econ",         label:"🏭 Economic Intel"},
    ],
  };

  const switchProp = (id) => { setProp(id); setTab(tabSets[id][0].id); };
  const activeProp = PROPS.find(p=>p.id===prop);

  const pRows = calcRows([
    {label:"Today (65% / $912)",        occ:0.65,rent:912},
    {label:"75% / $912",                occ:0.75,rent:912},
    {label:"80% / $950 post-reno",      occ:0.80,rent:950},
    {label:"85% / $975 post-reno",      occ:0.85,rent:975},
    {label:"90% / $1,000 post-reno",    occ:0.90,rent:1000},
    {label:"95% / $1,025 (bull case)",  occ:0.95,rent:1025},
  ], POINTE_UNITS, pExpR, pCapR);

  const oRows = calcRows([
    {label:"Today (80.8% / $709 in-place)", occ:0.8077,rent:709.10},
    {label:"85% / $762 (at market)",        occ:0.85,  rent:762.80},
    {label:"90% / $800 (fill 2BR vacants)", occ:0.90,  rent:800},
    {label:"93% / $840 (light improvements)",occ:0.93, rent:840},
    {label:"95% / $875 (stabilized)",       occ:0.95,  rent:875},
    {label:"95% / $895 (bull — 2BR at mkt)",occ:0.95,  rent:895},
  ], OAK_UNITS, oExpR, oCapR);

  const oakNOI = OAK.annualBilling * (1 - oExpR/100);

  const ExitTable = ({rows, numUnits, entryPrice, renoK, hold, color}) => {
    const allIn = entryPrice + renoK*1000;
    return (
      <div style={{overflowX:"auto",borderRadius:10,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.08)",marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead>
            <tr style={{background:"#0f172a",color:"#fff"}}>
              {["Scenario","NOI","Exit Value","$/Door","vs Entry","vs All-In","Ann. Return"].map(h=>(
                <th key={h} style={{padding:"9px 9px",textAlign:h==="Scenario"?"left":"right",fontWeight:600,fontSize:10}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i) => {
              const ann = allIn>0&&hold>0?(Math.pow(r.perDoor/allIn,1/hold)-1)*100:0;
              const aboveAllin = r.perDoor >= allIn;
              const aboveEntry = r.perDoor >= entryPrice;
              return (
                <tr key={i} style={{background:aboveAllin?"#f0fdf4":i%2===0?"#fff":"#f8fafc",borderLeft:`4px solid ${aboveAllin?"#16a34a":aboveEntry?"#d97706":"#dc2626"}`}}>
                  <td style={{padding:"7px 9px",fontWeight:600,fontSize:11}}>{r.label}</td>
                  <td style={{padding:"7px 9px",textAlign:"right"}}>{fmtM(r.noi)}</td>
                  <td style={{padding:"7px 9px",textAlign:"right"}}>{fmtM(r.val)}</td>
                  <td style={{padding:"7px 9px",textAlign:"right",fontWeight:800,color:aboveAllin?"#15803d":aboveEntry?"#d97706":"#dc2626"}}>${Math.round(r.perDoor/1000)}K</td>
                  <td style={{padding:"7px 9px",textAlign:"right",color:r.perDoor-entryPrice>=0?"#15803d":"#dc2626",fontWeight:600}}>{r.perDoor-entryPrice>=0?"+":""}{Math.round((r.perDoor-entryPrice)/1000)}K</td>
                  <td style={{padding:"7px 9px",textAlign:"right",color:r.perDoor-allIn>=0?"#15803d":"#dc2626",fontWeight:600}}>{r.perDoor-allIn>=0?"+":""}{Math.round((r.perDoor-allIn)/1000)}K</td>
                  <td style={{padding:"7px 9px",textAlign:"right",fontWeight:700,color:ann>=15?"#15803d":ann>=8?"#d97706":"#dc2626"}}>{ann>=0?ann.toFixed(1):"—"}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const EconContent = () => <>
    <Section title="🟢 Tailwind #1 — Port Houston Ship Channel Expansion (Project 11)" color="#166634">
      <Alrt type="green"><strong>Multi-decade federal infrastructure investment.</strong> Blue-collar jobs that match the tenant profile at both properties.</Alrt>
      <Row label="Scope" value="530 ft → 700 ft channel widening" flag="green"/>
      <Row label="Port-led dredging" value="Complete (Oct 2025)" flag="green"/>
      <Row label="USACE remaining" value="Full completion 2029" flag="green"/>
      <Row label="FY2026 federal allocation" value="$161M + $53.6M O&M" flag="green"/>
      <Row label="Economic footprint" value="~1.5M Texas jobs / $439B state activity" flag="green"/>
    </Section>
    <Section title="🟢 Tailwind #2 — Houston Metro Job Growth" color="#166634">
      <Row label="2026 job forecast" value="30,900 new jobs (Greater Houston Partnership)" flag="green"/>
      <Row label="Total metro jobs by end of 2026" value="Record 3.5 million projected" flag="green"/>
      <Row label="Population growth (2024)" value="+200,000 new residents" flag="green"/>
    </Section>
    <Section title="🟢 Tailwind #3 — Pasadena Industrial Anchors" color="#166634">
      <Row label="Chevron Pasadena Refinery" value="Operational" flag="green"/>
      <Row label="Pemex Deer Park Refinery" value="Operational — 275,000 bbl/day" flag="green"/>
      <Row label="Shell Deer Park Manufacturing" value="Active 1,500-acre complex" flag="green"/>
      <Row label="Bayport Terminal" value="Container volume growing with Project 11" flag="green"/>
      <Row label="San Jacinto College" value="2025 Aspen Prize Finalist — trains Ship Channel workforce" flag="green"/>
    </Section>
    <Section title="🔴 Headwind — LyondellBasell Refinery Closure" color="#dc2626">
      <Alrt type="red"><strong>Primary driver of the vacancy spike from 15.7% → 21.6% submarket vacancy.</strong></Alrt>
      <Row label="Facility" value="LyondellBasell Houston Refinery — closed Q1 2025" flag="red"/>
      <Row label="Direct layoffs" value="345–400+ (Texas Workforce Commission)" flag="red"/>
      <Row label="Site future" value="Plastic recycling hub — equipment after 2027" flag="yellow" sub="Not near-term demand driver"/>
    </Section>
    <Section title="Economic Verdict" color="#1e3a5f">
      <Alrt type="green"><strong>Long-term foundation is solid.</strong> Port expansion + Chevron, Pemex, Shell, and San Jacinto anchor blue-collar employment for both properties throughout any reasonable hold period.</Alrt>
      <Alrt type="red"><strong>Near-term drag is real.</strong> LyondellBasell explains the vacancy spike. Oak Shadows at 80.77% proves local demand still exists — the problem is concentrated in distressed assets.</Alrt>
      <Alrt type="yellow"><strong>Watch for further closures.</strong> A second major Ship Channel operator exit during hold could delay stabilization.</Alrt>
    </Section>
  </>;

  const CompCard = ({c}) => (
    <Section title={`${c.name} · ${c.addr} · ${c.dist}`}
      color={c.primary?"#b45309":c.asp?"#6d28d9":c.noteF==="green"?"#166534":c.noteF==="red"?"#dc2626":"#1e3a5f"}>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
        {c.primary&&<Badge text="⭐ PRIMARY DIRECT COMP — ACROSS THE STREET" color="yellow"/>}
        {c.asp&&<Badge text="⭐ ASPIRATIONAL" color="blue"/>}
        <Badge text={`Built ${c.built}`} color="blue"/>
        <Badge text={`${c.units} units`} color="blue"/>
        {c.primary&&<Badge text="90%+ Occupied" color="green"/>}
        {c.primary&&<Badge text="<5% Delinquency" color="green"/>}
        {c.primary&&<Badge text="$13K/door Reno" color="yellow"/>}
        {c.primary&&<Badge text="2BR+ Waiting List" color="green"/>}
        {c.primary&&<Badge text="⚠️ 1BR Slow to Fill" color="red"/>}
      </div>
      <Row label="Occupancy" value={c.occ} flag={c.occF}/>
      <Row label="Rents" value={c.rents} flag={c.noteF==="green"?"green":undefined}/>
      <Row label="Effective Rents" value={c.eff} flag={c.occF}/>
      {c.ph&&<Row label="Phone" value={c.ph}/>}
      {c.floorplans&&<>
        <div style={{fontSize:11,fontWeight:700,color:"#92400e",margin:"12px 0 6px"}}>Floor Plans — Confirmed from Property Visit</div>
        <div style={{overflowX:"auto",marginBottom:10}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead>
              <tr style={{background:"#b45309",color:"#fff"}}>
                {["Plan","Type","Sq Ft","Rent/Mo","$/Sqft","Demand Signal"].map(h=>(
                  <th key={h} style={{padding:"6px 10px",textAlign:h==="Plan"||h==="Demand Signal"?"left":"right",fontSize:10,fontWeight:600}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.floorplans.map((fp,i)=>{
                const ppsf=(fp.rent/fp.sqft).toFixed(2);
                const is1br=fp.bed.startsWith("1");
                return (
                  <tr key={fp.name} style={{background:i%2===0?"#fffbeb":"#fff",borderLeft:`4px solid ${is1br?"#ef4444":"#16a34a"}`}}>
                    <td style={{padding:"7px 10px",fontWeight:800}}>{fp.name}</td>
                    <td style={{padding:"7px 10px",textAlign:"right"}}>{fp.bed}</td>
                    <td style={{padding:"7px 10px",textAlign:"right"}}>{fp.sqft} sf</td>
                    <td style={{padding:"7px 10px",textAlign:"right",fontWeight:800,color:"#92400e"}}>${fp.rent.toLocaleString()}</td>
                    <td style={{padding:"7px 10px",textAlign:"right",color:"#64748b"}}>${ppsf}/sf</td>
                    <td style={{padding:"7px 10px"}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,
                        background:is1br?"#fee2e2":"#dcfce7",
                        color:is1br?"#dc2626":"#15803d"}}>
                        {is1br?"⚠️ Slow to fill":"✅ Waiting list"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:8,padding:"10px 12px",fontSize:11,color:"#92400e"}}>
          <strong>🔑 Key Takeaway for The Pointe:</strong> Las Plazas confirms $949–$999 on 2BR and $1,299 on 3BR with a <em>waiting list</em> at $13K/door renovation — directly across the street. The 1BR weakness ($809–$829) is the only soft spot and mirrors submarket trends. <strong>Prioritize 2BR and 3BR renovation units first at The Pointe to hit cash flow fastest.</strong>
        </div>
      </>}
      <div style={{marginTop:8,background:c.primary?"#fffbeb":c.asp?"#f5f3ff":c.noteF==="green"?"#f0fdf4":c.noteF==="red"?"#fef2f2":"#fffbeb",borderRadius:8,padding:"8px 11px",fontSize:11,color:c.primary?"#92400e":c.asp?"#4c1d95":c.noteF==="green"?"#166534":c.noteF==="red"?"#991b1b":"#92400e"}}>
        {c.note}
      </div>
    </Section>
  );

  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#f1f5f9",minHeight:"100vh",padding:16}}>
      <div style={{maxWidth:980,margin:"0 auto"}}>

        {/* ── GLOBAL HEADER ── */}
        <div style={{background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)",borderRadius:14,padding:"18px 22px",marginBottom:14,color:"#fff"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>Internal Due Diligence Report · March 2026</div>
              <h1 style={{margin:0,fontSize:20,fontWeight:800}}>The Pointe & Oak Shadows</h1>
              <p style={{margin:"3px 0 0",fontSize:12,color:"#94a3b8"}}>Pasadena, TX · <strong style={{color:"#60a5fa"}}>{TOTAL_DOORS} Doors</strong> · <strong style={{color:"#4ade80"}}>${fmt(CONTRACT_TOTAL)} Contract</strong> · <strong style={{color:"#fbbf24"}}>${fmt(PRICE_PER_DOOR)}/door</strong></p>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[
                {label:"The Pointe",  val:`${POINTE_UNITS} units · ~65% occ`, color:"#60a5fa"},
                {label:"Oak Shadows", val:`${OAK_UNITS} units · 80.77% occ`,  color:"#4ade80"},
                {label:"Contract",    val:`$${(CONTRACT_TOTAL/1e6).toFixed(1)}M`,       color:"#fbbf24"},
              ].map(({label,val,color})=>(
                <div key={label} style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"8px 14px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:"#94a3b8",marginBottom:2}}>{label}</div>
                  <div style={{fontSize:13,fontWeight:900,color}}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginTop:10,display:"flex",gap:5,flexWrap:"wrap"}}>
            <Badge text="Direct Contract — Seeds InvestCo" color="green"/>
            <Badge text="Active Federal Litigation on Title" color="red"/>
            <Badge text="HOPA — Age Data Required" color="red"/>
            <Badge text="🚨 PW Employee in Unit 808 @ $600/mo" color="red"/>
            <Badge text="$99.8K Delinquency" color="red"/>
          </div>
        </div>

        {/* ── PROPERTY SELECTOR ── */}
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {PROPS.map(p=>(
            <button key={p.id} onClick={()=>switchProp(p.id)}
              style={{flex:"1 1 180px",padding:"12px 16px",borderRadius:10,border:prop===p.id?"none":"2px solid #e2e8f0",cursor:"pointer",fontWeight:800,fontSize:13,
                background:prop===p.id?p.color:"#fff",color:prop===p.id?"#fff":"#475569",
                boxShadow:prop===p.id?"0 4px 14px rgba(0,0,0,0.18)":"0 1px 3px rgba(0,0,0,0.06)",
                transition:"all 0.15s"}}>
              {p.label}
              {p.id==="combined" && <div style={{fontSize:10,fontWeight:400,marginTop:2,color:prop===p.id?"#94a3b8":"#94a3b8"}}>Summary · Risks · Next Steps</div>}
              {p.id==="pointe"   && <div style={{fontSize:10,fontWeight:400,marginTop:2,color:prop===p.id?"#93c5fd":"#94a3b8"}}>518 units · Est. $17M · ~65% occ</div>}
              {p.id==="oak"      && <div style={{fontSize:10,fontWeight:400,marginTop:2,color:prop===p.id?"#86efac":"#94a3b8"}}>182 units · Est. $6M · 80.77% occ</div>}
            </button>
          ))}
        </div>

        {/* ── TAB BAR ── */}
        <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
          {tabSets[prop].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"7px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,
                background:tab===t.id?activeProp.color:"#fff",
                color:tab===t.id?"#fff":"#475569",
                boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════
            COMBINED — SUMMARY
        ════════════════════════════════════════ */}
        {prop==="combined" && tab==="summary" && (()=>{
          const oakAllocPct   = 100 - pointeAllocPct;
          const pointeAlloc   = CONTRACT_TOTAL * pointeAllocPct / 100;
          const oakAlloc      = CONTRACT_TOTAL * oakAllocPct   / 100;
          const pointePPD     = pointeAlloc / POINTE_UNITS;
          const oakPPD        = oakAlloc    / OAK_UNITS;
          const blendedPPD    = CONTRACT_TOTAL / TOTAL_DOORS;
          const pointePremium = ((pointePPD / blendedPPD) - 1) * 100;
          const oakPremium    = ((oakPPD    / blendedPPD) - 1) * 100;
          return <>
          <KpiGrid items={[
            {label:"Contract Price",     value:`${(CONTRACT_TOTAL/1e6).toFixed(1)}M`,    color:"#16a34a"},
            {label:"Blended Price/Door", value:`${fmt(blendedPPD)}`,                     color:"#16a34a"},
            {label:"Total Doors",        value:`${TOTAL_DOORS}`,                          color:"#0f172a"},
            {label:"The Pointe Occ.",    value:"~65%",                                    color:"#dc2626"},
            {label:"Oak Shadows Occ.",   value:"80.77%",                                  color:"#166534"},
            {label:"Oak Monthly Billing",value:`${fmt(OAK.totalBillingMonthly)}`,        color:"#b45309"},
            {label:"Oak Delinquency",    value:`${fmt(DEL.total)}`,                      color:"#dc2626"},
            {label:"Oak Rev. Gap/Yr",    value:`${fmt((OAK.totalMarketMonthly-OAK.totalBillingMonthly)*12)}`, color:"#d97706"},
          ]}/>

          {/* ── ALLOCATION SLIDER ── */}
          <div style={{background:"#fff",borderRadius:12,padding:"18px 20px",marginBottom:18,boxShadow:"0 1px 6px rgba(0,0,0,0.08)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:13,fontWeight:800,color:"#0f172a"}}>📐 Purchase Price Allocation</span>
              <span style={{fontSize:11,color:"#94a3b8"}}>Drag to model independent sale scenarios</span>
            </div>
            <div style={{fontSize:11,color:"#64748b",marginBottom:14}}>
              The $23M contract is a single transaction. Adjust the allocation below to model how price is attributed to each property — relevant for separate financing, future individual sales, or tax basis allocation.
            </div>

            {/* Property cards */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              {[
                {label:"🏢 The Pointe",  units:POINTE_UNITS, alloc:pointeAlloc, ppd:pointePPD, pct:pointeAllocPct,  premium:pointePremium, color:"#1e3a5f", bg:"#eff6ff"},
                {label:"🏠 Oak Shadows", units:OAK_UNITS,    alloc:oakAlloc,    ppd:oakPPD,    pct:oakAllocPct,    premium:oakPremium,    color:"#14532d", bg:"#f0fdf4"},
              ].map(({label,units,alloc,ppd,pct,premium,color,bg})=>(
                <div key={label} style={{background:bg,borderRadius:10,padding:"14px 16px",border:`2px solid ${color}22`}}>
                  <div style={{fontSize:13,fontWeight:800,color,marginBottom:8}}>{label}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[
                      {k:"Allocation %",  v:`${pct.toFixed(1)}%`},
                      {k:"Total $",       v:`${(alloc/1e6).toFixed(2)}M`},
                      {k:"Price / Door",  v:`${fmt(ppd)}`},
                      {k:"vs Blended",    v:`${premium>=0?"+":""}${premium.toFixed(1)}%`},
                    ].map(({k,v})=>(
                      <div key={k} style={{background:"#fff",borderRadius:7,padding:"7px 10px"}}>
                        <div style={{fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase"}}>{k}</div>
                        <div style={{fontSize:14,fontWeight:900,color}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:8,fontSize:10,color:"#64748b"}}>
                    {units} doors · ${fmt(ppd)}/door · {pct.toFixed(1)}% of contract
                  </div>
                </div>
              ))}
            </div>

            {/* Slider */}
            <div style={{position:"relative",padding:"0 0 6px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:11,fontWeight:700,color:"#1e3a5f"}}>← More to The Pointe</span>
                <span style={{fontSize:11,fontWeight:700,color:"#14532d"}}>More to Oak Shadows →</span>
              </div>
              {/* Visual bar */}
              <div style={{position:"relative",height:28,borderRadius:14,overflow:"hidden",background:"#e2e8f0",marginBottom:8}}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pointeAllocPct}%`,background:"linear-gradient(90deg,#1e3a5f,#3b82f6)",transition:"width 0.1s",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8}}>
                  {pointeAllocPct>15&&<span style={{fontSize:10,fontWeight:800,color:"#fff"}}>{pointeAllocPct.toFixed(0)}%</span>}
                </div>
                <div style={{position:"absolute",right:0,top:0,height:"100%",width:`${oakAllocPct}%`,background:"linear-gradient(90deg,#16a34a,#4ade80)",transition:"width 0.1s",display:"flex",alignItems:"center",paddingLeft:8}}>
                  {oakAllocPct>15&&<span style={{fontSize:10,fontWeight:800,color:"#fff"}}>{oakAllocPct.toFixed(0)}%</span>}
                </div>
              </div>
              <input type="range" min={30} max={85} step={0.5} value={pointeAllocPct}
                onChange={e=>setPointeAllocPct(parseFloat(e.target.value))}
                style={{width:"100%",accentColor:"#1e3a5f"}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#94a3b8",marginTop:2}}>
                <span>30% Pointe / 70% Oak</span>
                <span style={{color:"#64748b",fontWeight:700}}>◆ {pointeAllocPct.toFixed(0)}% / {oakAllocPct.toFixed(0)}%</span>
                <span>85% Pointe / 15% Oak</span>
              </div>
            </div>

            {/* Insight callouts */}
            <div style={{marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{background:"#eff6ff",borderRadius:8,padding:"10px 12px",fontSize:11,color:"#1e3a5f",borderLeft:"3px solid #3b82f6"}}>
                <strong>The Pointe breakeven:</strong> At ${fmt(pointePPD)}/door, you need to exit at {((pointePPD/1000)*1.0).toFixed(0)}K+ per door to recover basis. Stabilized comps at ~$90K/door give {((90000-pointePPD)/1000).toFixed(0)}K/door of margin.
              </div>
              <div style={{background:"#f0fdf4",borderRadius:8,padding:"10px 12px",fontSize:11,color:"#14532d",borderLeft:"3px solid #16a34a"}}>
                <strong>Oak Shadows implied equity:</strong> At ${fmt(oakPPD)}/door entry, current billing at a 7.5% cap and 50% expense ratio implies ~${fmt(Math.round(OAK.annualBilling*0.5/0.075/OAK_UNITS))}K/door in value — <strong>${fmt(Math.round(OAK.annualBilling*0.5/0.075/OAK_UNITS - oakPPD))} of Day-1 equity per door.</strong>
              </div>
            </div>
          </div>

          <Section title="Transaction Summary" color="#0f172a">
            <Row label="Seller" value="VRK 38 Apartments LLC / Thistle Creek"/>
            <Row label="Buyer" value="Seeds InvestCo (Direct Contract)" flag="green"/>
            <Row label="Contract Price" value="$23,000,000" flag="green" sub="Renegotiated post-walkthrough — down from $44K/door"/>
            <Row label="Blended Price Per Door" value={`${fmt(blendedPPD)}/door`} flag="green"/>
            <Row label="The Pointe — allocated" value={`${(pointeAlloc/1e6).toFixed(2)}M · ${fmt(pointePPD)}/door`} sub={`${pointeAllocPct.toFixed(1)}% of contract`} flag={pointePPD<35000?"green":"yellow"}/>
            <Row label="Oak Shadows — allocated" value={`${(oakAlloc/1e6).toFixed(2)}M · ${fmt(oakPPD)}/door`} sub={`${oakAllocPct.toFixed(1)}% of contract`} flag={oakPPD<35000?"green":"yellow"}/>
            <Row label="Stabilized comp benchmark" value="~$90K/door" sub="For 90%+ occupied assets — significant discount to stabilized value"/>
          </Section>
          <Section title="The Pointe — Snapshot" color="#1e3a5f">
            <Row label="Units / Vintage" value="518 units · Early 1970s · Class C"/>
            <Row label="Current Occupancy" value="~65%" flag="red" sub="~181 vacant units"/>
            <Row label="Current Avg Rent" value="$912/unit" sub="vs $1,097 submarket asking avg"/>
            <Row label="Current NOI" value="Effectively zero — distressed" flag="red"/>
            <Row label="Renovation required for rent growth" value="$12–18K/unit full gut renovation" flag="yellow"/>
            <Row label="All-in basis (mid-reno $14K)" value="~$46.9K/door" sub="$32.9K entry + $14K reno" flag="yellow"/>
            <Row label="Rent ceiling post-reno" value="$899–$929/1BR · $1,099–$1,175/2BR" flag="green" sub="Red Pines model — same submarket"/>
          </Section>
          <Section title="Oak Shadows — Snapshot" color="#166534">
            <Row label="Units / Vintage" value="182 units · Workforce housing"/>
            <Row label="Current Occupancy" value="80.77% — 147 occupied" flag="green"/>
            <Row label="Monthly Billing (confirmed)" value={`$${fmt(OAK.totalBillingMonthly)}`} flag="yellow" sub="Rent $104,237 + Parking $2,225"/>
            <Row label="Annual Billing Run-Rate" value={`$${fmt(OAK.annualBilling)}`} flag="yellow"/>
            <Row label="Est. Annual NOI @ 45% expense" value={`$${fmt(OAK.annualBilling*0.55)}`} flag="green" sub="Before collections haircut — T-12 required"/>
            <Row label="Delinquency" value={`$${fmt(DEL.total)}`} flag="red" sub="93.7% of one month billing · $41K in 90+ day bucket"/>
            <Row label="Key vacancy issue" value="18 of 50 two-bed/750sf units vacant (64% occ)" flag="red"/>
            <Row label="🚨 Management conflict" value="Parawest employee in Unit 808 @ $600 vs $1,200 market" flag="red"/>
          </Section>
          <Section title="Title, Litigation & Legal" color="#7c3aed">
            <Alrt type="red"><strong>Active Federal Litigation:</strong> Computershare v. Thistle Creek. $500K escrow contradiction between LOIs. Full title report required before closing.</Alrt>
            <Alrt type="red"><strong>HOPA / 55+ Compliance:</strong> Oak Shadows rent roll shows working-age workforce profile. No age data in OneSite export. Legal liability transfers to buyer at closing if designation is active and unenforced.</Alrt>
          </Section>
        </>; })()}

        {/* ════════════════════════════════════════
            COMBINED — RISKS
        ════════════════════════════════════════ */}
        {prop==="combined" && tab==="risks" && <>
          <Section title="🔴 Critical Risks — Must Resolve Before Closing" color="#dc2626">
            {[
              ["Federal Litigation on Title (Both)","Computershare v. Thistle Creek is active. $500K escrow contradicted between the two LOIs. Full title report required immediately."],
              ["🚨 Parawest Employee in Unit 808 — Oak Shadows","DEL report confirms 'PW EMPLOYEE' in 2x1-1167sf at $600 vs $1,200 market. Management self-dealing. Pull lease, identify employee, assess disclosure. Assume Day-1 management transition to Greenline."],
              ["HOPA/55+ Compliance — Oak Shadows","Rent roll shows general-occupancy workforce profile. No age data in export. Active violation = FHA liability transfers to buyer at closing. Age survey required before closing."],
              ["$99.8K Delinquency — Oak Shadows","93.7% delinquency-to-billing ratio. $41K in 90+ day bucket — largely uncollectable PRIORMGMT carryover. Apply 5–8% collections haircut to NOI until T-12 confirmed."],
              ["2x1-750 Vacancy — Oak Shadows","18 of 50 units vacant (64% occ). Near-market in-place rents confirm this is NOT a pricing problem. Inspect all 18 before closing."],
              ["T-12 Financials — Both Properties","No verified trailing 12-month cash receipts for either property. All NOI projections are theoretical."],
            ].map(([t,b],i)=><Alrt key={i} type="red"><strong>{t}:</strong> {b}</Alrt>)}
          </Section>
          <Section title="🟡 Significant Risks" color="#b45309">
            {[
              ["The Pointe Stabilization Timeline","21.6% submarket vacancy + negative 10-yr absorption. 130 units to absorb. Jeff's 24-month timeline is aggressive — underwrite 36–48 months."],
              ["Partial Renovation Won't Move Rents (The Pointe)","Willow Tree and Las Plazas prove partial capex doesn't push rents above current Pointe avg. Full gut renovation required to access Red Pines rent levels."],
              ["$9K+ PRIORMGMT Write-offs — Oak Shadows","Inherited bad debt will hit NOI in Year 1. Quantify in T-12 request."],
              ["Bulk Lockout Activity Jan 2026 — Oak Shadows","16 units received simultaneous lockout notices 01/07–01/08. Some will convert to additional vacancies — monitor near-term pipeline."],
              ["2x1-850 Vacancy — Oak Shadows","6 of 13 units vacant (53.85%). Inspect all 6."],
            ].map(([t,b],i)=><Alrt key={i} type="yellow"><strong>{t}:</strong> {b}</Alrt>)}
          </Section>
          <Section title="🟢 Genuine Upside Factors" color="#166634">
            {[
              ["Entry Price Creates Massive Margin","$32.9K/door vs ~$90K stabilized comp benchmark. Even a partial stabilization generates significant equity."],
              ["Oak Shadows Cash-Flowing from Day 1","$106,462/mo confirmed billing. ~$638K–$702K NOI/yr at 45–50% expense ratio. Positive carry while The Pointe is renovated."],
              ["Oak Shadows: Fill 18 Vacants = $193K/yr","18 vacant 2BR/750sf at $895 market = $16,110/mo = $193K/yr incremental. No renovation needed."],
              ["Oak Shadows: Unit 808 Fix = $7,200/yr Instant","Terminate PW employee lease, re-lease at $1,200 market = $600/mo = $7,200/yr instant NOI."],
              ["Red Pines Proves The Pointe's Ceiling","$899–$929/1BR and $1,099–$1,175/2BR with full gut reno in the same Pasadena submarket."],
            ].map(([t,b],i)=><Alrt key={i} type="green"><strong>{t}:</strong> {b}</Alrt>)}
          </Section>
        </>}

        {/* ════════════════════════════════════════
            COMBINED — NEXT STEPS
        ════════════════════════════════════════ */}
        {prop==="combined" && tab==="nextsteps" && <>
          <Section title="Immediate — Before Any Further Commitments" color="#dc2626">
            {[
              ["Attorney Review — Title & Litigation (Both)","Full title report. Resolve $500K escrow contradiction between LOIs. Quantify Computershare v. Thistle Creek exposure."],
              ["Pull Unit 808 Complete Lease — Oak Shadows","PW EMPLOYEE confirmed in DEL report. Get lease, term, employee identity, assess disclosure. This triggers assumed Day-1 management transition."],
              ["HOPA Age Survey — Oak Shadows","Request full tenant DOB records from Parawest. #1 unresolved legal item for Oak Shadows."],
              ["Greenline Management Proposal (Both Properties)","The PW employee disclosure accelerates this. Get a Day-1 transition proposal from Greenline for both The Pointe and Oak Shadows."],
              ["Inspect 18 Vacant 2x1-750 Units — Oak Shadows","Walk every vacant 2BR/750. Condition or management/marketing problem?"],
            ].map(([t,b],i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid #fee2e2",alignItems:"flex-start"}}>
                <span style={{fontWeight:900,color:"#dc2626",minWidth:20}}>!</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"#475569"}}>{b}</div></div>
              </div>
            ))}
          </Section>
          <Section title="Due Diligence — Within 2 Weeks" color="#b45309">
            {[
              ["T-12 Financials — Both Properties","Actual cash receipts, eviction cost history, write-off history. Oak Shadows: cross-reference $99.8K delinquency against cash received."],
              ["Physical Inspection — The Pointe","20–30% unit sample + third-party PCA. Quantify deferred maintenance and renovation scope."],
              ["Inspect 6 Vacant 2x1-850 Units — Oak Shadows","Condition survey on all 6 vacant 850sf units."],
              ["Tour Red Pines in Person","(832) 219-6757 — 3823 Red Bluff Rd. Walk renovated units. This is The Pointe's renovation spec sheet and Oak Shadows' aspirational ceiling."],
              ["PSA Full Review — Both Properties","Closing timeline, earnest money, inspection period, seller representations."],
            ].map(([t,b],i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid #fed7aa",alignItems:"flex-start"}}>
                <span style={{fontWeight:900,color:"#d97706",minWidth:20}}>{i+1}</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"#475569"}}>{b}</div></div>
              </div>
            ))}
          </Section>
          <Section title="Pre-Close — Underwriting" color="#1e3a5f">
            {[
              ["The Pointe Final Proforma","T-12 verified + capex from PCA + Red Pines as bull case rent ceiling."],
              ["Oak Shadows Final Proforma","T-12 + collections-adjusted effective revenue + 2BR/750 absorption timeline + PRIORMGMT write-off budget."],
              ["Capital Stack Confirmation","The Pointe: $12–18K/unit full renovation. Oak Shadows: targeted capex on vacant 2BRs + deferred maintenance only."],
            ].map(([t,b],i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid #dbeafe",alignItems:"flex-start"}}>
                <span style={{fontWeight:900,color:"#2563eb",minWidth:20}}>→</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"#475569"}}>{b}</div></div>
              </div>
            ))}
          </Section>
        </>}

        {/* ════════════════════════════════════════
            THE POINTE — OVERVIEW
        ════════════════════════════════════════ */}
        {prop==="pointe" && tab==="overview" && <>
          <KpiGrid items={[
            {label:"Units",         value:"518",           color:"#0f172a"},
            {label:"Occupancy",     value:"~65%",          color:"#dc2626"},
            {label:"Vacant Units",  value:"~181",          color:"#dc2626"},
            {label:"Avg Rent",      value:"$912",          color:"#b45309"},
            {label:"Submarket Avg", value:"$1,097",        color:"#475569", sub:"asking — effective lower"},
            {label:"Entry Price",   value:`$${fmt(POINTE_PRICE)}`, color:"#16a34a"},
            {label:"Per Door",      value:`$${fmt(PRICE_PER_DOOR)}`, color:"#16a34a"},
            {label:"Current NOI",   value:"~$0",           color:"#dc2626", sub:"effectively distressed"},
          ]}/>
          <Section title="Asset Snapshot" color="#1e3a5f">
            <Row label="Location" value="Pasadena, TX (Harris County)"/>
            <Row label="Vintage" value="Early 1970s — Class C workforce housing"/>
            <Row label="Current Occupancy" value="~65%" flag="red" sub="~181 vacant units"/>
            <Row label="Current Avg Rent" value="$912/unit" sub="vs $1,097 submarket asking avg"/>
            <Row label="Current NOI" value="Effectively zero — distressed" flag="red"/>
            <Row label="All-in basis (mid-reno $14K)" value="~$46.9K/door" flag="yellow" sub="$32.9K entry + $14K reno"/>
            <Row label="Stabilized comp benchmark" value="~$90K/door" flag="green" sub="For 90%+ occupied — significant upside margin"/>
          </Section>
          <Section title="Renovation Strategy — Las Plazas Sets the Target" color="#1e3a5f">
            <Alrt type="green"><strong>Las Plazas (directly across the street) is the proof of concept.</strong> $13K/door renovation, 90%+ occupied, &lt;5% delinquency, waiting list on all 2BR+. This is the renovation spec and the rent target for The Pointe.</Alrt>
            <Alrt type="yellow"><strong>⚠️ 1BR units are the weak spot at Las Plazas — and across the submarket.</strong> Willow Tree ($830) and Las Plazas ($809–$829) both struggle to fill 1BRs. Prioritize 2BR and 3BR renovation first at The Pointe to maximize early cash flow.</Alrt>
            <Row label="Target renovation spec" value="$13,000/unit — Las Plazas standard" flag="yellow" sub="Confirmed achievable: 90%+ occ directly across the street"/>
            <Row label="Post-reno 1BR target" value="$809–$829/unit" flag="yellow" sub="Las Plazas confirmed — but 1BRs slow to fill submarket-wide"/>
            <Row label="Post-reno 2BR target" value="$949–$999/unit" flag="green" sub="Las Plazas confirmed — waiting list at this price point"/>
            <Row label="Post-reno 3BR target" value="$1,299/unit" flag="green" sub="Las Plazas confirmed — waiting list"/>
            <Row label="Total capex (518 units · $13K)" value={`${fmt(518*13000)}`} flag="yellow"/>
            <Row label="All-in basis post reno" value="~$45.9K/door" flag="green" sub="$32.9K entry + $13K reno vs ~$90K stabilized benchmark"/>
            <Row label="Renovation priority order" value="2BR first → 3BR → 1BR last" flag="yellow" sub="Maximize waiting-list demand; defer slow-moving 1BRs"/>
          </Section>
          <Section title="Stabilization Challenge" color="#dc2626">
            <Alrt type="red"><strong>The Pointe is the turnaround play. Oak Shadows is the cash engine.</strong> This property requires capital, time, and operational execution.</Alrt>
            <Row label="Units to absorb (65% → 90%)" value="~130 additional units" flag="red"/>
            <Row label="Submarket vacancy" value="21.6% — up from 15.7% in 12 months" flag="red"/>
            <Row label="Absorption trend" value="Negative for 10 consecutive years (since 2016)" flag="red"/>
            <Row label="Jeff's claimed timeline" value="24 months" flag="red" sub="Not supported by submarket data"/>
            <Row label="Realistic stabilization timeline" value="36–48 months" flag="yellow"/>
          </Section>
        </>}

        {/* THE POINTE — MARKET */}
        {prop==="pointe" && tab==="market" && <>
          <Alrt type="red"><strong>The submarket is moving against The Pointe specifically.</strong> Numbers from Jeff's CoStar report (3/2/2026).</Alrt>
          <Section title="Submarket Fundamentals — CoStar Report #85664871" color="#dc2626">
            <Row label="Current submarket vacancy" value="21.6%" flag="red" sub="Up from 15.7% in 12 months — accelerating"/>
            <Row label="Absorption trend" value="Negative for 10 consecutive years (since 2016)" flag="red"/>
            <Row label="Market cap rate" value="6.71%" sub="For stabilized assets only"/>
            <Row label="Stabilized sale comps" value="~$90K/door" sub="90%+ occupied"/>
            <Row label="Concessions widespread" value="1–4 weeks free across submarket" flag="red"/>
          </Section>
          <Section title="Rent Reality Check" color="#1e3a5f">
            <Row label="The Pointe current avg rent" value="$912/unit"/>
            <Row label="Submarket asking avg" value="$1,097" sub="Effective rents $50–$150 lower"/>
            <Row label="Willow Tree 1BR (partial reno, 1974)" value="$830" flag="red" sub="Below The Pointe avg despite renovation"/>
            <Row label="Las Plazas 1BR (post-$1.35M reno, 2025)" value="$809–$829" flag="red" sub="$17K/unit reno didn't move the needle"/>
            <Row label="Quarters on Red Bluff (95% occ, 1971)" value="$840–$975 / 1BR" flag="green" sub="Same vintage, same submarket — proof of concept"/>
            <Row label="Red Pines 1BR (full gut renovation)" value="$899–$929" flag="green" sub="Aspirational ceiling — full reno required"/>
            <Row label="Red Pines 2BR (full gut renovation)" value="$1,099–$1,175" flag="green"/>
            <Row label="Realistic post-reno target" value="$975–$1,050 blended" flag="yellow" sub="Full Red Pines-quality renovation required"/>
          </Section>
          <Section title="Key Risk: 24-Month Exit Timeline" color="#b45309">
            <Row label="Starting vacancy" value="~181 units (35%)" flag="red"/>
            <Row label="Target occupancy" value="90% (requires ~130 new leases)" flag="yellow"/>
            <Row label="Net absorption in submarket" value="Negative 10-year trend" flag="red"/>
            <Row label="Jeff's claim" value="24 months to stabilization" flag="red"/>
            <Row label="Underwrite at" value="36–48 months" flag="yellow"/>
          </Section>
        </>}

        {/* THE POINTE — COMPS */}
        {prop==="pointe" && tab==="comps" && <>
          <Alrt type="yellow">All comps are renovated. <strong>The Pointe has not been renovated.</strong> Effective rents are the correct comparison benchmark.</Alrt>
          {pointeComps.map((c,i)=><CompCard key={i} c={c}/>)}
        </>}

        {/* THE POINTE — EXIT MODEL */}
        {prop==="pointe" && tab==="exit" && <>
          <Alrt type="purple">Exit model for <strong>The Pointe — 518 units.</strong> Entry price based on pro-rata share of $23M contract.</Alrt>
          <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
            {[
              {label:`Exit Cap Rate: ${pCapR.toFixed(1)}%`,min:5.5,max:9.0,step:0.1,val:pCapR,set:setPCapR},
              {label:`Expense Ratio: ${pExpR}%`,           min:45, max:65, step:1,  val:pExpR,set:setPExpR},
              {label:`Renovation: $${pRenoK}K/unit`,       min:5,  max:20, step:1,  val:pRenoK,set:setPRenoK},
            ].map(({label,min,max,step,val,set})=>(
              <div key={label} style={{background:"#fff",borderRadius:10,padding:"11px 13px",boxShadow:"0 1px 4px rgba(0,0,0,0.08)",flex:"1 1 160px"}}>
                <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:5}}>{label}</label>
                <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(step<1?parseFloat(e.target.value):parseInt(e.target.value))} style={{width:"100%"}}/>
              </div>
            ))}
          </div>
          <div style={{background:"#0f172a",borderRadius:10,padding:"11px 16px",marginBottom:12,display:"flex",gap:20,flexWrap:"wrap"}}>
            {[
              {label:"Entry (pro-rata)",val:`$${fmt(POINTE_PRICE)}`},
              {label:"Per Door",        val:`$${fmt(PRICE_PER_DOOR)}`},
              {label:"Renovation",      val:`$${pRenoK}K/unit`},
              {label:"All-In / Door",   val:`$${Math.round(PRICE_PER_DOOR/1000+pRenoK)}K`,hi:true},
              {label:"Total Capex",     val:`$${fmt(POINTE_UNITS*pRenoK*1000)}`},
            ].map(({label,val,hi})=>(
              <div key={label} style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:"#94a3b8",marginBottom:2}}>{label}</div>
                <div style={{fontSize:hi?18:13,fontWeight:900,color:hi?"#4ade80":"#fff"}}>{val}</div>
              </div>
            ))}
          </div>
          <ExitTable rows={pRows} numUnits={POINTE_UNITS} entryPrice={PRICE_PER_DOOR} renoK={pRenoK} hold={pHold} color="#1e3a5f"/>
          <div style={{background:"#fff",borderRadius:10,padding:"11px 13px",marginBottom:10}}>
            <label style={{fontSize:11,fontWeight:700,color:"#475569"}}>Hold Period: {pHold} yr{pHold!==1?"s":""}</label>
            <input type="range" min={1} max={10} step={1} value={pHold} onChange={e=>setPHold(parseInt(e.target.value))} style={{width:"100%",marginTop:4}}/>
          </div>
        </>}

        {/* THE POINTE — RISKS */}
        {prop==="pointe" && tab==="risks" && <>
          <Section title="🔴 Critical Risks" color="#dc2626">
            {[
              ["Federal Litigation on Title","Computershare v. Thistle Creek is active. $500K escrow contradicted between LOIs. Full title report required."],
              ["Stabilization Timeline Risk","21.6% submarket vacancy + 10-year negative absorption. 130 units to absorb. Underwrite 36–48 months, not 24."],
              ["T-12 Financials","No verified trailing 12-month financials. Distressed NOI must be confirmed — currently effectively zero."],
            ].map(([t,b],i)=><Alrt key={i} type="red"><strong>{t}:</strong> {b}</Alrt>)}
          </Section>
          <Section title="🟡 Significant Risks" color="#b45309">
            {[
              ["Partial Renovation Won't Move Rents","Two comps prove this — Willow Tree and Las Plazas both below Pointe avg after recent capex. Full gut reno required."],
              ["Renovation Cost Overrun","$12–18K/unit budget is wide. Third-party PCA required to pin down actual scope before closing."],
              ["Concessions Required to Fill","Submarket concessions of 1–4 weeks free are widespread. Budget for 4–6 weeks of concessions per unit during lease-up."],
              ["Management Execution","Vista Azul proves even a fully renovated asset fails with bad management (106 vacancies). Greenline is the right operator."],
            ].map(([t,b],i)=><Alrt key={i} type="yellow"><strong>{t}:</strong> {b}</Alrt>)}
          </Section>
          <Section title="🟢 Upside Factors" color="#166634">
            {[
              ["Entry Price Provides Massive Buffer","$32.9K/door vs ~$90K stabilized benchmark. Downside protection is exceptional."],
              ["Red Pines Proves the Ceiling","$899–$929/1BR, $1,099–$1,175/2BR — full gut reno, same submarket, no concessions."],
              ["Oak Shadows Carries the Carry","Oak Shadows cash flow covers operating costs while The Pointe stabilizes."],
            ].map(([t,b],i)=><Alrt key={i} type="green"><strong>{t}:</strong> {b}</Alrt>)}
          </Section>
        </>}

        {/* THE POINTE — NEXT STEPS */}
        {prop==="pointe" && tab==="nextsteps" && <>
          <Section title="Immediate" color="#dc2626">
            {[
              ["Attorney Review — Title & Litigation","Full title report. Resolve $500K escrow contradiction. Quantify Computershare v. Thistle Creek."],
              ["Third-Party PCA — Physical Condition Assessment","20–30% unit sample walk + independent condition report. Pin down renovation scope and true capex budget."],
              ["Greenline Management Proposal","Get a Day-1 management transition proposal from Greenline (Red Pines operator) for The Pointe specifically."],
            ].map(([t,b],i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid #fee2e2",alignItems:"flex-start"}}>
                <span style={{fontWeight:900,color:"#dc2626",minWidth:20}}>!</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"#475569"}}>{b}</div></div>
              </div>
            ))}
          </Section>
          <Section title="Due Diligence — Within 2 Weeks" color="#b45309">
            {[
              ["T-12 Financials","Confirm The Pointe's actual revenue, expense breakdown, and vacancy trend over last 12 months."],
              ["Tour Red Pines in Person","(832) 219-6757. Walk renovated units. Photograph finishes. This is the renovation spec sheet."],
              ["Renovation Contractor Bids","Get 2–3 bids on a per-unit full-gut renovation scope based on PCA findings."],
              ["PSA Full Review","Closing timeline, earnest money, inspection period, seller representations for The Pointe."],
            ].map(([t,b],i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid #fed7aa",alignItems:"flex-start"}}>
                <span style={{fontWeight:900,color:"#d97706",minWidth:20}}>{i+1}</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"#475569"}}>{b}</div></div>
              </div>
            ))}
          </Section>
        </>}

        {/* THE POINTE — ECONOMIC INTEL */}
        {prop==="pointe" && tab==="econ" && <EconContent/>}

        {/* ════════════════════════════════════════
            OAK SHADOWS — OVERVIEW
        ════════════════════════════════════════ */}
        {prop==="oak" && tab==="overview" && <>
          <Alrt type="red"><strong>🚨 Unit 808 DEL comment confirms "PW EMPLOYEE."</strong> Parawest staff member in largest unit at $600 vs $1,200 market. Day-1 management transition should be assumed.</Alrt>
          <KpiGrid items={[
            {label:"Total Units",      value:"182",                               color:"#0f172a"},
            {label:"Occupied",         value:"147",                               color:"#166534"},
            {label:"Vacant",           value:"36",                                color:"#dc2626"},
            {label:"Occupancy",        value:"80.77%",                            color:"#166534"},
            {label:"Avg Mkt Rent",     value:"$762.80",                           color:"#1e3a5f"},
            {label:"Avg In-Place",     value:"$709.10",                           color:"#b45309"},
            {label:"Monthly Billing",  value:`$${fmt(OAK.totalBillingMonthly)}`,  color:"#b45309"},
            {label:"Delinquency",      value:`$${fmt(DEL.total)}`,                color:"#dc2626"},
          ]}/>
          <Section title="Confirmed Financials — OneSite 01/08/2026" color="#166534">
            <Row label="Total Units" value="182" flag="green" sub="Confirmed — OneSite Page 12 summary"/>
            <Row label="Occupied (no NTV)" value="143 units" flag="green"/>
            <Row label="Occupied (NTV)" value="4 units" flag="yellow" sub="Notice to vacate — will add to vacancy"/>
            <Row label="Vacant (not leased)" value="32 units" flag="red"/>
            <Row label="Avg Market Rent" value="$762.80/unit" sub="Note: 1x1-520 market rate is outdated"/>
            <Row label="Avg In-Place Rent" value="$709.10/unit" flag="yellow" sub="$53.70 below own market avg"/>
            <Row label="Total Monthly Billing" value={`$${fmt(OAK.totalBillingMonthly)}`} sub="Rent $104,237 + Parking $2,225" flag="yellow"/>
            <Row label="Annual Billing Run-Rate" value={`$${fmt(OAK.annualBilling)}`}/>
            <Row label="Annual Revenue Gap to Market" value={`$${fmt((OAK.totalMarketMonthly-OAK.totalBillingMonthly)*12)}`} flag="red" sub="Market potential minus actual billing"/>
            <Row label="Est. NOI @ 45% expense" value={`$${fmt(OAK.annualBilling*0.55)}/yr`} flag="green" sub="Before 5–8% collections haircut"/>
          </Section>
          <Section title="Unit Mix — Key Issues" color="#1e3a5f">
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr style={{background:"#0f172a",color:"#fff"}}>
                    {["Plan","Sqft","Mkt","Total","Occ","Avail","Occ%","Leased","Gap","Note"].map(h=>(
                      <th key={h} style={{padding:"7px 8px",textAlign:h==="Plan"||h==="Note"?"left":"right",fontSize:10,fontWeight:600}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {oakMix.map((r,i)=>{
                    const gC=r.rentGap<=-200?"#dc2626":r.rentGap<-50?"#d97706":r.rentGap>=0?"#15803d":"#475569";
                    const oC=r.occPct<60?"#dc2626":r.occPct<80?"#d97706":"#15803d";
                    return (
                      <tr key={r.type} style={{background:r.occPct<65?"#fff5f5":i%2===0?"#fff":"#f8fafc",borderLeft:`4px solid ${r.occPct<65?"#dc2626":r.avail>5?"#d97706":"#16a34a"}`}}>
                        <td style={{padding:"7px 8px",fontWeight:700}}>{r.type}</td>
                        <td style={{padding:"7px 8px",textAlign:"right"}}>{r.sqft}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",fontWeight:700}}>${r.mkt}</td>
                        <td style={{padding:"7px 8px",textAlign:"right"}}>{r.total}</td>
                        <td style={{padding:"7px 8px",textAlign:"right"}}>{r.occ}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:r.avail>3?"#dc2626":"#d97706",fontWeight:700}}>{r.avail}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",fontWeight:800,color:oC}}>{r.occPct.toFixed(0)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right"}}>${r.avgLeased}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",fontWeight:800,color:gC}}>{r.rentGap>=0?"+":""}{r.rentGap}</td>
                        <td style={{padding:"7px 8px",fontSize:10,color:"#475569",maxWidth:160}}>{r.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>
          <Section title="Management — Parawest Community Development" color="#dc2626">
            <Alrt type="red"><strong>🚨 Self-dealing confirmed.</strong> Parawest placed a staff member in Unit 808 (2x1-1167sf) at $600/mo vs $1,200 market. Day-1 management transition to Greenline should be assumed at closing, not evaluated post-close.</Alrt>
            <Row label="Unit 808 conflict" value="PW Employee @ $600 vs $1,200 market" flag="red" sub="Confirmed via DEL report comment 01/07/2026"/>
            <Row label="Delinquency rate" value="93.7% of one month billing outstanding" flag="red"/>
            <Row label="2x1-750 vacancy" value="18 of 50 units vacant despite near-market rents" flag="red" sub="Suggests leasing inactivity"/>
            <Row label="Recommendation" value="Day-1 transition to Greenline — bilingual, same submarket" flag="red"/>
          </Section>
        </>}

        {/* OAK SHADOWS — DELINQUENCY */}
        {prop==="oak" && tab==="delinquency" && <>
          <Alrt type="red"><strong>Delinquency Report — OneSite, Fiscal Period 01/2026, as of 01/08/2026.</strong> 85 accounts · $99,797.93 net delinquent · Zero prepaid.</Alrt>
          <KpiGrid items={[
            {label:"Total Delinquent",     value:fmtD(DEL.total),   color:"#dc2626"},
            {label:"Current (0–30 days)",  value:fmtD(DEL.current), color:"#d97706", sub:"Collectible now"},
            {label:"30-Day Bucket",        value:fmtD(DEL.d30),     color:"#d97706"},
            {label:"60-Day Bucket",        value:fmtD(DEL.d60),     color:"#dc2626"},
            {label:"90+ Day Bucket",       value:fmtD(DEL.d90),     color:"#991b1b", sub:"Largely uncollectable"},
            {label:"% of Monthly Billing", value:`${(DEL.total/OAK.totalBillingMonthly*100).toFixed(1)}%`, color:"#dc2626"},
          ]}/>
          <div style={{background:"#fff",borderRadius:12,padding:"14px 16px",marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,0.08)"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#1e293b",marginBottom:8}}>Aging Breakdown</div>
            {[
              {label:"Current",  val:DEL.current, color:"#f59e0b"},
              {label:"30-Day",   val:DEL.d30,     color:"#f97316"},
              {label:"60-Day",   val:DEL.d60,     color:"#ef4444"},
              {label:"90+ Day",  val:DEL.d90,     color:"#991b1b"},
            ].map(({label,val,color})=>{
              const pct=(val/DEL.total*100).toFixed(1);
              return (
                <div key={label} style={{marginBottom:7}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontSize:11,color:"#475569",fontWeight:600}}>{label}</span>
                    <span style={{fontSize:11,fontWeight:800,color}}>{fmtD(val)} <span style={{color:"#94a3b8",fontWeight:400}}>({pct}%)</span></span>
                  </div>
                  <div style={{background:"#f1f5f9",borderRadius:6,height:9}}>
                    <div style={{width:`${pct}%`,background:color,borderRadius:6,height:9}}/>
                  </div>
                </div>
              );
            })}
            <Alrt type="red">⚠️ <strong>$41,066 (41.1%) is 90+ day</strong> — largely written-off bad debt. Effective collectible delinquency is ~$58,731.</Alrt>
          </div>
          <Section title="🚨 Unit 808 — PW Employee (Highest Priority)" color="#dc2626">
            <Row label="Unit" value="808 — 2x1-1167sf (largest unit on property)"/>
            <Row label="Resident" value="Mariela, Perla · (832)728-4318" />
            <Row label="Balance" value="$600.00 current" flag="yellow" sub="Monthly rent — currently 'current' on payments"/>
            <Row label="Market rent for this unit" value="$1,200/mo" flag="red"/>
            <Row label="Monthly discount" value="$600/mo — 50% below market" flag="red"/>
            <Row label="Annual cost of this discount" value="$7,200/yr lost NOI" flag="red"/>
            <Row label="DEL comment (01/07/2026)" value='"PW EMPLOYEE"' flag="red"/>
            <Row label="Action required" value="Pull complete lease · Identify employee · Terminate at expiry · Re-lease at $1,200" flag="red"/>
          </Section>
          <Section title="PRIORMGMT Inherited Bad Debt" color="#7c3aed">
            <Alrt type="purple"><strong>Multiple units carry PRIORMGMT charge codes</strong> — unpaid balances from the prior management company. Almost entirely uncollectable. Will need to be written off at or after closing.</Alrt>
            <Row label="Unit 812 PRIORMGMT" value="$3,990.00" flag="red" sub="Largest — re-filing eviction in progress"/>
            <Row label="Unit 930 PRIORMGMT" value="$3,785.68" flag="red" sub="Former resident — entirely 90+ day"/>
            <Row label="Unit 923 PRIORMGMT" value="$765.00" flag="yellow" sub="Former resident"/>
            <Row label="Unit 724 PRIORMGMT" value="$439.00" flag="yellow"/>
            <Row label="Unit 965 PRIORMGMT" value="$50.00" flag="yellow"/>
            <Row label="Est. total PRIORMGMT exposure" value="~$9,030+" flag="red" sub="Confirm full amount in T-12"/>
          </Section>
          <Section title="Notable Delinquent Accounts" color="#dc2626">
            {[
              {unit:"812",name:"Romero, Monica",      status:"Current", bal:9310.00, note:"Re-filing eviction 01/07. $3,990 PRIORMGMT. NSF on file."},
              {unit:"930",name:"Gonzalez Salazar, R.",status:"Former",  bal:5186.68, note:"$3,785.68 PRIORMGMT. Former resident — largely uncollectable."},
              {unit:"709",name:"Rathburn, Wendy",     status:"Current", bal:2180.00, note:"24-hr lockout 01/07 — performed 01/08."},
              {unit:"732",name:"Calix Galeano, L.",   status:"Former",  bal:2054.00, note:"$1,514 rent + $540 late fee. 90+ days entirely."},
              {unit:"724",name:"Bustillos Cruz, M.",  status:"Former",  bal:2461.00, note:"$439 PRIORMGMT + $550 late + $1,472 rent."},
              {unit:"730",name:"Goff, Jason",         status:"Current", bal:1720.00, note:"Long-term (since 04/2020). 24-hr lockout 01/08."},
              {unit:"945",name:"Reyes, Morena",       status:"Current", bal:1720.00, note:"24-hr lockout 01/08."},
              {unit:"965",name:"VENTURA ZAMORA, M.",  status:"Former",  bal:1721.00, note:"$1,334 rent + PRIORMGMT + parking. 90+ entirely."},
            ].map((a,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 0",borderBottom:"1px solid #f1f5f9",gap:10}}>
                <span style={{fontWeight:800,color:"#0f172a",minWidth:32}}>#{a.unit}</span>
                <span style={{flex:1,fontSize:12,fontWeight:600,color:"#1e293b"}}>{a.name}</span>
                <span style={{fontSize:10,padding:"2px 7px",borderRadius:10,fontWeight:700,background:a.status==="Current"?"#dcfce7":"#fee2e2",color:a.status==="Current"?"#15803d":"#dc2626",whiteSpace:"nowrap"}}>{a.status}</span>
                <span style={{fontWeight:800,color:"#dc2626",minWidth:70,textAlign:"right"}}>{fmtD(a.bal)}</span>
                <span style={{fontSize:10,color:"#94a3b8",flex:2,textAlign:"right"}}>{a.note}</span>
              </div>
            ))}
          </Section>
          <Section title="Underwriting Impact" color="#0f172a">
            <Alrt type="yellow"><strong>The $106,462/mo billing is GROSS.</strong> Apply a 5–8% collections haircut until T-12 cash receipts are confirmed.</Alrt>
            <Row label="Stated monthly billing" value={`$${fmt(OAK.totalBillingMonthly)}`}/>
            <Row label="Collections adjustment (5–8%)" value="-$5,323 to -$8,517/mo" flag="yellow"/>
            <Row label="Adjusted effective collections" value="~$99,000–$101,000/mo" flag="yellow"/>
            <Row label="Annual NOI impact" value="~-$35K to -$56K/yr vs stated billing" flag="red"/>
            <Row label="PRIORMGMT write-off (Year 1)" value="~$9,030 one-time hit" flag="red"/>
          </Section>
        </>}

        {/* OAK SHADOWS — MARKET */}
        {prop==="oak" && tab==="market" && <>
          <Alrt type="green"><strong>Oak Shadows at 80.77% is outperforming its submarket.</strong> The 21.6% submarket vacancy is concentrated in distressed assets. Oak Shadows proves local demand exists at this price point.</Alrt>
          <Section title="Submarket Context" color="#1e3a5f">
            <Row label="Submarket vacancy" value="21.6%" flag="red" sub="Up from 15.7% — driven by LyondellBasell closure"/>
            <Row label="Oak Shadows occupancy" value="80.77%" flag="green" sub="Outperforming submarket"/>
            <Row label="Silver Club (0.15 mi away)" value="Active at $950–$1,050" flag="yellow" sub="Closest direct comp — sets neighborhood floor"/>
            <Row label="Oak Shadows avg in-place" value="$709.10/unit" flag="yellow" sub="$53.70 below own market rate — upside without reno"/>
            <Row label="Oak Shadows market rate (system)" value="$762.80/unit" sub="Note: 1x1-520 field is outdated — true potential $670–$720"/>
          </Section>
          <Section title="Rent Upside — No Renovation Required" color="#166534">
            <Alrt type="green">Oak Shadows has meaningful rent upside at lease renewal with zero capital deployed.</Alrt>
            <Row label="Occupied units × rent gap" value="147 × $53.70 = $7,894/mo" flag="green" sub="$94.7K/yr incremental at lease renewal"/>
            <Row label="Fill 18 vacant 2x1-750 at market" value="18 × $895 = $16,110/mo" flag="green" sub="$193.3K/yr incremental — no renovation"/>
            <Row label="Fix Unit 808 (PW Employee)" value="+$600/mo = $7,200/yr" flag="green" sub="Terminate employee lease, re-lease at market"/>
            <Row label="Total near-term upside" value="~$295K/yr" flag="green" sub="Without any renovation capex"/>
          </Section>
          <Section title="Where Oak Shadows Can Go With Renovation" color="#1e3a5f">
            <Row label="Silver Club benchmark (0.15 mi)" value="$950–$1,050/unit" flag="yellow" sub="Updated but not fully renovated"/>
            <Row label="Red Pines ceiling (full gut reno)" value="Studio $749 | 1BR $899–$929 | 2BR $1,099–$1,175" flag="green"/>
            <Row label="Terracita (fully reno, 91.5% occ)" value="~$815–$1,050 ex-utilities" flag="green" sub="All bills paid — normalize for utilities"/>
            <Row label="Realistic stabilized target" value="$830–$900 blended" flag="yellow" sub="Light targeted improvements · bilingual management"/>
          </Section>
        </>}

        {/* OAK SHADOWS — COMPS */}
        {prop==="oak" && tab==="comps" && <>
          <Alrt type="yellow">Oak Shadows comps focus on the immediate neighborhood and workforce housing profile. Silver Club is the direct neighbor (0.15 mi). Red Pines is the aspirational ceiling.</Alrt>
          {oakComps.map((c,i)=><CompCard key={i} c={c}/>)}
        </>}

        {/* OAK SHADOWS — EXIT MODEL */}
        {prop==="oak" && tab==="exit" && <>
          <Alrt type="purple">Exit model for <strong>Oak Shadows — 182 units.</strong> Entry price based on pro-rata share of $23M contract. T-12 required to confirm expense ratio.</Alrt>
          <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
            {[
              {label:`Exit Cap Rate: ${oCapR.toFixed(1)}%`,min:5.5,max:9.0,step:0.1,val:oCapR,set:setOCapR},
              {label:`Expense Ratio: ${oExpR}%`,           min:40, max:60, step:1,  val:oExpR,set:setOExpR},
              {label:`Reno: $${oRenoK}K/unit (targeted)`,  min:0,  max:15, step:1,  val:oRenoK,set:setORenoK},
            ].map(({label,min,max,step,val,set})=>(
              <div key={label} style={{background:"#fff",borderRadius:10,padding:"11px 13px",boxShadow:"0 1px 4px rgba(0,0,0,0.08)",flex:"1 1 160px"}}>
                <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:5}}>{label}</label>
                <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(step<1?parseFloat(e.target.value):parseInt(e.target.value))} style={{width:"100%"}}/>
              </div>
            ))}
          </div>
          <div style={{background:"#14532d",borderRadius:10,padding:"11px 16px",marginBottom:12,display:"flex",gap:20,flexWrap:"wrap"}}>
            {[
              {label:"Entry (pro-rata)",       val:`$${fmt(OAK_PRICE)}`},
              {label:"Per Door",               val:`$${fmt(PRICE_PER_DOOR)}`},
              {label:"Targeted Reno",          val:`$${oRenoK}K/unit`},
              {label:"All-In / Door",          val:`$${Math.round(PRICE_PER_DOOR/1000+oRenoK)}K`, hi:true},
              {label:"Current Annual Billing", val:`$${fmt(OAK.annualBilling)}`},
              {label:`NOI @ ${oExpR}% expense`,val:`$${fmt(OAK.annualBilling*(1-oExpR/100))}`},
            ].map(({label,val,hi})=>(
              <div key={label} style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:"#86efac",marginBottom:2}}>{label}</div>
                <div style={{fontSize:hi?18:13,fontWeight:900,color:hi?"#4ade80":"#fff"}}>{val}</div>
              </div>
            ))}
          </div>
          <ExitTable rows={oRows} numUnits={OAK_UNITS} entryPrice={PRICE_PER_DOOR} renoK={oRenoK} hold={oHold} color="#166534"/>
          <div style={{background:"#fff",borderRadius:10,padding:"11px 13px",marginBottom:10}}>
            <label style={{fontSize:11,fontWeight:700,color:"#475569"}}>Hold Period: {oHold} yr{oHold!==1?"s":""}</label>
            <input type="range" min={1} max={10} step={1} value={oHold} onChange={e=>setOHold(parseInt(e.target.value))} style={{width:"100%",marginTop:4}}/>
          </div>
          <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#166534"}}>
            💡 <strong>Key Oak Shadows insight:</strong> At current billing ($106,462/mo) and a 7.5% exit cap, Oak Shadows alone at 50% expense ratio generates ~<strong>$8.5M in exit value</strong> — vs the ~$6M pro-rata acquisition cost. That's meaningful Day-1 equity before any improvement.
          </div>
        </>}

        {/* OAK SHADOWS — RISKS */}
        {prop==="oak" && tab==="risks" && <>
          <Section title="🔴 Critical Risks" color="#dc2626">
            {[
              ["🚨 Parawest Employee in Unit 808","DEL report confirms 'PW EMPLOYEE' in 2x1-1167sf at $600 vs $1,200 market. Pull lease, identify employee, assess disclosure. Day-1 management transition required."],
              ["HOPA/55+ Compliance","Rent roll shows general-occupancy workforce profile. No age data in OneSite export. If designation is active and unenforced, FHA liability transfers to buyer at closing."],
              ["$99.8K Delinquency","93.7% of monthly billing outstanding. $41K in 90+ day bucket — largely uncollectable PRIORMGMT carryover. Apply 5–8% collections haircut to NOI."],
              ["2x1-750 Vacancy (18 of 50 units)","64% occupancy on largest unit type. Near-market rents confirm this is NOT a pricing problem. Inspect all 18 before closing."],
              ["T-12 Financials","No verified trailing 12-month cash receipts. Actual collections rate unknown."],
            ].map(([t,b],i)=><Alrt key={i} type="red"><strong>{t}:</strong> {b}</Alrt>)}
          </Section>
          <Section title="🟡 Significant Risks" color="#b45309">
            {[
              ["$9K+ PRIORMGMT Write-offs","Inherited bad debt from prior management. Will hit NOI in Year 1."],
              ["Bulk Lockout Pipeline","16 units locked out 01/07–01/08. Some will vacate rather than pay — watch near-term vacancy pipeline."],
              ["2x1-850 Vacancy (6 of 13 units)","53.85% occupancy. Inspect all 6 before closing."],
              ["1x1-520 Market Rate Outdated","System shows $595 market; tenants paying $625–$890. True market ~$670–$720. Underwriting must use realistic rates."],
            ].map(([t,b],i)=><Alrt key={i} type="yellow"><strong>{t}:</strong> {b}</Alrt>)}
          </Section>
          <Section title="🟢 Upside Factors" color="#166634">
            {[
              ["Cash-Flowing from Day 1","$106,462/mo confirmed billing. ~$638K–$702K NOI/yr at 45–50% expense ratio."],
              ["Fill 18 Vacants = $193K/yr","No renovation required — pure management/leasing execution."],
              ["Rent-to-Market Upside = $94.7K/yr","147 occupied units × $53.70 gap — achievable at lease renewal without capex."],
              ["Unit 808 Fix = $7,200/yr Instant","Terminate PW employee lease, re-lease at $1,200 market."],
              ["Entry Creates Day-1 Equity","~$6M acquisition cost vs ~$8.5M implied value at current billing and 7.5% cap."],
            ].map(([t,b],i)=><Alrt key={i} type="green"><strong>{t}:</strong> {b}</Alrt>)}
          </Section>
        </>}

        {/* OAK SHADOWS — NEXT STEPS */}
        {prop==="oak" && tab==="nextsteps" && <>
          <Section title="Immediate" color="#dc2626">
            {[
              ["Pull Unit 808 Complete Lease","PW EMPLOYEE confirmed. Get full lease, term, employee identity, determine disclosure status. This is both a legal and management-conduct issue."],
              ["HOPA Age Verification Survey","Request full tenant DOB records from Parawest. If records don't exist, that itself is an active violation. #1 legal priority."],
              ["Inspect 18 Vacant 2x1-750 Units","Walk every vacant 2BR/750. Determine condition vs. management/marketing problem. Condition issue = capex. Marketing = Day-1 management change."],
              ["Day-1 Greenline Management Proposal","Unit 808 disclosure makes this non-negotiable. Get a transition proposal with Day-1 leasing plan for the 18 vacant 2BRs."],
            ].map(([t,b],i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid #fee2e2",alignItems:"flex-start"}}>
                <span style={{fontWeight:900,color:"#dc2626",minWidth:20}}>!</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"#475569"}}>{b}</div></div>
              </div>
            ))}
          </Section>
          <Section title="Due Diligence — Within 2 Weeks" color="#b45309">
            {[
              ["T-12 Financials","Actual cash receipts, write-off history, eviction costs, PRIORMGMT balance detail. Cross-ref $99.8K delinquency against cash collected."],
              ["Inspect 6 Vacant 2x1-850 Units","Condition survey on all 6 vacant 850sf units."],
              ["Update Market Rents in OneSite","1x1-520 market rate ($595) is materially outdated — tenants paying $625–$890. Request Parawest run a market survey."],
              ["Parawest Background Check","Research other Parawest-managed properties. Understand systemic management issues."],
            ].map(([t,b],i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid #fed7aa",alignItems:"flex-start"}}>
                <span style={{fontWeight:900,color:"#d97706",minWidth:20}}>{i+1}</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"#475569"}}>{b}</div></div>
              </div>
            ))}
          </Section>
          <Section title="Pre-Close" color="#1e3a5f">
            {[
              ["Oak Shadows Final Proforma","T-12 + collections-adjusted effective revenue + 2BR vacancy absorption + PRIORMGMT write-off budget."],
              ["Capital Stack — Oak Shadows Only","Targeted capex on vacant 2BR units + deferred maintenance. No full renovation required for near-term upside."],
            ].map(([t,b],i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid #dbeafe",alignItems:"flex-start"}}>
                <span style={{fontWeight:900,color:"#2563eb",minWidth:20}}>→</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"#475569"}}>{b}</div></div>
              </div>
            ))}
          </Section>
        </>}

        {/* OAK SHADOWS — ECONOMIC INTEL */}
        {prop==="oak" && tab==="econ" && <EconContent/>}

        <div style={{textAlign:"center",fontSize:10,color:"#94a3b8",marginTop:12,paddingBottom:8}}>
          Seeds InvestCo Due Diligence · March 2026 · Confidential — Internal Use Only<br/>
          $23M Contract · 700 Doors · $32,857/door · Oak Shadows OneSite confirmed 01/08/2026
        </div>
      </div>
    </div>
  );
}
