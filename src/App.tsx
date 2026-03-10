import { useState } from "react";

const Section = ({ title, color, children }) => (
  <div style={{ marginBottom: 20, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
    <div style={{ background: color, padding: "10px 18px" }}>
      <h3 style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: 0.3 }}>{title}</h3>
    </div>
    <div style={{ background: "#fff", padding: "16px 18px" }}>{children}</div>
  </div>
);

const Row = ({ label, value, sub, flag }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
    <span style={{ fontSize: 13, color: "#475569", flex: 1, paddingRight: 12 }}>{label}</span>
    <div style={{ textAlign: "right", minWidth: 160 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: flag === "red" ? "#dc2626" : flag === "green" ? "#16a34a" : flag === "yellow" ? "#d97706" : "#1e293b" }}>{value}</span>
      {sub && <div style={{ fontSize: 11, color: "#94a3b8" }}>{sub}</div>}
    </div>
  </div>
);

const Badge = ({ text, color }) => (
  <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, marginRight: 6, marginBottom: 4,
    background: color === "red" ? "#fee2e2" : color === "yellow" ? "#fef3c7" : color === "green" ? "#dcfce7" : "#e0e7ff",
    color: color === "red" ? "#dc2626" : color === "yellow" ? "#b45309" : color === "green" ? "#15803d" : "#4338ca" }}>
    {text}
  </span>
);

const Alert = ({ type, children }) => (
  <div style={{ background: type === "red" ? "#fef2f2" : type === "yellow" ? "#fffbeb" : type === "purple" ? "#f5f3ff" : "#f0fdf4",
    border: `1px solid ${type === "red" ? "#fca5a5" : type === "yellow" ? "#fcd34d" : type === "purple" ? "#c4b5fd" : "#86efac"}`,
    borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13,
    color: type === "red" ? "#991b1b" : type === "yellow" ? "#92400e" : type === "purple" ? "#4c1d95" : "#166534" }}>
    {children}
  </div>
);

const units = 518;
function calcRow(occ, rent, expR, capR) {
  const egi = units * rent * occ * 12;
  const noi = egi * (1 - expR);
  const value = noi / capR;
  return { egi, noi, value, perDoor: value / units };
}

const exitScenarios = [
  { label: "Today (65% / $912 flat)", occ: 0.65, rent: 912 },
  { label: "75% / $912 flat", occ: 0.75, rent: 912 },
  { label: "80% / $950 post-reno", occ: 0.80, rent: 950 },
  { label: "85% / $975 post-reno", occ: 0.85, rent: 975 },
  { label: "90% / $1,000 post-reno", occ: 0.90, rent: 1000 },
  { label: "95% / $1,025 (bull case)", occ: 0.95, rent: 1025 },
];

const comps = [
  {
    name: "Veranda Village",
    address: "3635 Shaver St, Pasadena TX 77504",
    distance: "~3 mi",
    built: "1971", units: "329–422",
    manager: "Self-managed (formerly West Point Village)",
    renovated: "Partially renovated",
    occ: "Low — no availability on major sites; reviews cite deferred maintenance, AC failures, pest issues",
    occFlag: "red",
    rents: "Starting $549 (studio) — up to ~$1,050",
    rentFlag: "yellow",
    note: "⚠️ Significant negative reviews: AC failures, rodents, sewage, security problems. Management recently changed. Weakest comp — sets the floor but not the ceiling.",
    noteFlag: "red",
    effective: "~$549–$800 effective",
    allBillsPaid: false, aspirational: false,
  },
  {
    name: "Quay Point Apartments",
    address: "3925 Arlington Square Dr, Houston TX 77034",
    distance: "~4 mi",
    built: "1963", units: "134",
    manager: "Private-Eighteen Capital",
    renovated: "Partially updated",
    occ: "~14% vacancy — 19 units listed, starting at $660",
    occFlag: "red",
    rents: "$660–$1,020 (studio to 2BR)",
    rentFlag: "yellow",
    note: "Smaller property. Active vacancy with 19 units listed. Price drop promotions visible. Managed by Private-Eighteen Capital.",
    noteFlag: "yellow",
    effective: "~$660–$900 effective",
    allBillsPaid: false, aspirational: false,
  },
  {
    name: "Willow Tree Apartments (SMI Realty)",
    address: "4910 Allendale Rd, Houston TX 77017",
    distance: "~4 mi",
    built: "1974", units: "206",
    manager: "SMI Realty Management — long-term owner/operator, bilingual staff",
    renovated: "Partially updated — hardwood floors, walk-in closets; older finishes overall",
    occ: "5 units listed — active leasing; CoStar 4.0 blended rating",
    occFlag: "yellow",
    rents: "1BR $830 | 2BR $855–call | 3BR $1,195–$1,420",
    rentFlag: "yellow",
    note: "🔍 Direct operational comp for The Pointe. Similar 1970s vintage, 206 units, bilingual management, workforce tenant base. SMI offers Flex-Pay (split 1st/15th), money-back maintenance guarantee, free after-school kids club — all renter-retention tools that work in this demographic. Reviews are mixed: some praise management, others cite racial bias complaints vs. one manager (now documented/public). 1BR at $830 is BELOW The Pointe's current $912 avg — meaning Willow Tree is leasing at a rent discount to your property despite being partially renovated. 3BR units achieve $1,195–$1,420, which is notable ceiling data. No utilities bundled.",
    noteFlag: "yellow",
    effective: "~$830–$1,195 (no concessions/utilities noted)",
    allBillsPaid: false, aspirational: false,
    phone: "(832) 706-4314",
    extras: ["Flex-Pay (1st & 15th)", "Money-back maintenance guarantee", "Free after-school kids club", "Se habla español", "W/D hookups", "Pool + playground", "Controlled access", "Virtual 3D tours available"],
  },
  {
    name: "Las Plazas Apartments",
    address: "3940 S Shaver St, Houston TX 77034",
    distance: "~4 mi",
    built: "1964", units: "80",
    manager: "Private owner/operator — (346) 980-7106",
    renovated: "Partially renovated — $1.35M capex (2016–2019), new roof 2025, ceramic tile, granite counters, island kitchens, faux wood floors, high-efficiency HVAC",
    occ: "Multiple units listed — active availability; 'renovation special' currently promoted on Yelp",
    occFlag: "yellow",
    rents: "1BR $809–$829 | 2BR $949–$999 | 3BR $1,289–$1,299",
    rentFlag: "yellow",
    note: "📋 Investment sale comp (Crexi listing active). 80-unit garden-style, built 1964, partially renovated with $1.35M in capex. Assumable Fannie Mae loan at 3.35% — seller is actively marketing for investor acquisition. Currently listing a 'renovation special,' suggesting remaining vacancy pressure and ongoing lease-up. Key insight: even with $1.35M renovation (2016–2019, ~$17K/unit), rents are only $809–$999 — 1BR rents are BELOW The Pointe's current $912 avg. This confirms that partial renovation in this submarket does NOT automatically justify significant rent premium vs. current unrenovated rates. Full Red Pines-quality renovation is required to push past $950+ reliably.",
    noteFlag: "yellow",
    effective: "~$809–$1,100 effective",
    allBillsPaid: false, aspirational: false,
    phone: "(346) 980-7106",
    extras: ["Assumable Fannie Mae loan @ 3.35%", "On Crexi — actively for sale", "$1.35M renovation (2016–2019)", "New roof 2025", "Granite counters + island kitchens", "Ceramic tile + faux wood floors", "High-efficiency HVAC", "Gated + controlled access", "Bark park", "On-site laundry", "Pasadena ISD zoned"],
  },
  {
    name: "Quarters on Red Bluff (formerly Chateau Creole)",
    address: "2300 Red Bluff Rd, Pasadena TX 77506",
    distance: "~1.5 mi",
    built: "1971", units: "170",
    manager: "JAW Equity LLC — (713) 473-5521",
    renovated: "Partially updated — non-carpeted floors, premium countertops, W/D hookups, fireplaces in select units",
    occ: "95% occupied — strongest occupancy of any partially-renovated comp in this set",
    occFlag: "green",
    rents: "1BR $840–$975 | 2BR $975–$1,250 | 3BR up to $1,600",
    rentFlag: "green",
    note: "✅ High-value operational comp — same 1971 vintage as The Pointe, same Pasadena submarket, 95% occupied and managed by JAW Equity LLC. This is the strongest proof that a 1971 vintage property in this exact submarket can be stabilized at high occupancy. Formerly known as Chateau Creole. Achieves $840–$975 on 1BRs at 95% occ — above The Pointe's current $912 avg. Price drops noted on ApartmentFinder ($160 off promotion), suggesting some lease-up pressure at the top of the range. No utilities bundled. W/D hookups are a meaningful amenity at this price point. HAR data shows rent range up to $1,600 on larger units.",
    noteFlag: "green",
    effective: "~$840–$1,100 effective (concession active on upper units)",
    allBillsPaid: false, aspirational: false,
    phone: "(713) 473-5521",
    extras: ["95% occupied", "W/D hookups", "Fireplaces (select units)", "Bay windows + courtyard views", "2 pools", "Playground + grill areas", "Pasadena ISD zoned", "Price drop promotion active on upper units"],
  },
  {
    name: "Vista Azul Apartments",
    address: "3500 Red Bluff Rd, Pasadena TX 77503",
    distance: "~1 mi",
    built: "1971", units: "308",
    manager: "iLoveLeasing / on-site — (281) 247-5289 | (346) 222-4228",
    renovated: "Fully renovated — 3cm granite counters, vessel sinks, framed mirrors, crown molding, tiled bathtub surrounds, pass-through kitchens with breakfast bars, resort pool",
    occ: "106 units listed as available — significant active vacancy; 'Half Off Dec & Half Off March' concession promotion running",
    occFlag: "red",
    rents: "1BR $849–$925 | 2BR $1,100–$1,199 | 3BR up to $1,699",
    rentFlag: "yellow",
    note: "⚠️ Critical comp — same 1971 vintage, same Red Bluff Rd corridor, fully renovated with Red Pines-identical finishes (3cm granite, vessel sinks, crown molding), yet running aggressive half-month-free concessions and showing 106 active vacancies. CoStar blended rating 3.2/5 — below average. Reviews in Spanish cite flooding, broken AC not treated as emergency. This is the cautionary tale: full renovation + good finishes does NOT guarantee occupancy if management quality is poor. Vista Azul proves the renovation ceiling (~$925–$1,100 effective) but also proves that management execution is the difference between 95% occ (Quarters) and significant vacancy. NOTE: Red Pines is only 0.53 miles from Vista Azul — they compete directly for the same tenant.",
    noteFlag: "yellow",
    effective: "~$749–$1,050 effective (half-month concessions active)",
    allBillsPaid: false, aspirational: false,
    phone: "(346) 222-4228",
    extras: ["3cm granite countertops", "Vessel sinks + framed mirrors", "Crown molding", "Tiled bathtub surrounds", "Pass-through kitchen + breakfast bar", "Resort-style pool", "Business center", "Clubhouse for rent", "Free Zumba classes", "Se habla español", "Half-off concessions currently active"],
  },
  {
    name: "Terracita Apartments",
    address: "801 S Allen-Genoa Rd, South Houston TX 77587",
    distance: "~3 mi",
    built: "1962", units: "177",
    manager: "Better World LLC (listed for sale via Colliers)",
    renovated: "Fully renovated — wood plank floors, new appliances, updated interiors",
    occ: "91.5% occupied — strongest occupancy in comp set",
    occFlag: "green",
    rents: "$939–$1,579/mo | All Bills Paid",
    rentFlag: "green",
    note: "✅ Best stabilized comp. Currently listed for sale via Colliers at 91.5% occupied. All bills paid (utilities included) — normalize by ~$100–125/mo for fair comparison to The Pointe.",
    noteFlag: "green",
    effective: "~$815–$1,050 effective (ex-utilities)",
    allBillsPaid: true, aspirational: false,
  },
  {
    name: "Silver Club Apartments",
    address: "5160 Silver Creek Dr, Houston TX 77017",
    distance: "~5 mi",
    built: "1960–1962", units: "45–46",
    manager: "Devonshire Real Estate & Asset Management",
    renovated: "Updated — tile/granite counters, modern lighting",
    occ: "Active — listings from $1,025; small property, limited data",
    occFlag: "yellow",
    rents: "$950–$1,050 (1–2 BR)",
    rentFlag: "yellow",
    note: "Very small property (45 units) managed by Devonshire. Achieves $950–$1,050 but at tiny scale — limited comparability. Closest property to Oak Shadows (0.15 mi).",
    noteFlag: "yellow",
    effective: "~$950–$1,050 (no concessions noted)",
    allBillsPaid: false, aspirational: false,
  },
  {
    name: "Red Pines Apartments ⭐ ASPIRATIONAL COMP",
    address: "3823 Red Bluff Rd, Pasadena TX 77503",
    distance: "~2 mi",
    built: "Vintage — fully gut-renovated",
    units: "N/A — mid-size community",
    manager: "Greenline Apartment Management (professional, bilingual)",
    renovated: "Full luxury renovation — 3cm granite counters, vinyl wood floors, vessel sinks, crown molding, backsplash, gooseneck faucets, drum chandeliers, framed mirrors, gas burning stoves, resort pool, 24-hr maintenance",
    occ: "Active — 5-star reviews, repeat tenants, stable leasing",
    occFlag: "green",
    rents: "Studio $749 | 1BR $899–$929 | 2BR $1,099–$1,175 | 3BR $1,499",
    rentFlag: "green",
    note: "🏆 Aspirational post-renovation comp — same Pasadena submarket, same vintage, fully repositioned. Managed by Greenline. Resident: 'most affordable luxury apartments in Pasadena area.' This is what The Pointe could achieve with a full unit renovation + strong management. No utilities bundled.",
    noteFlag: "green",
    effective: "$749–$1,499 asking — no utility bundling, no concessions noted",
    allBillsPaid: false, aspirational: true,
    phone: "(832) 219-6757",
    extras: ["3cm granite countertops", "Vinyl wood-look flooring", "Kitchen backsplash + gooseneck faucet", "Vessel sinks + framed mirrors", "Crown & decorative wall molding", "Island pendant + drum chandelier lighting", "Resort pool + fitness center", "Pet park + picnic/grill area", "Children's playground", "On-site laundry", "24-hr emergency maintenance", "Se habla español"],
  },
];

export default function App() {
  const [tab, setTab] = useState("overview");
  const [capR, setCapR] = useState(7.5);
  const [expR, setExpR] = useState(58);
  const [entryK, setEntryK] = useState(44);
  const [renoK, setRenoK] = useState(11);
  const [holdYrs, setHoldYrs] = useState(3);

  const tabs = [
    { id: "overview", label: "📋 Deal Overview" },
    { id: "market", label: "📊 Market Reality" },
    { id: "comps", label: "🏢 Comp Set" },
    { id: "exit", label: "💰 Exit Model" },
    { id: "risks", label: "⚠️ Risk Register" },
    { id: "nextsteps", label: "✅ Next Steps" },
    { id: "econ", label: "🏭 Economic Intel" },
  ];

  const rows = exitScenarios.map(s => calcRow(s.occ, s.rent, expR / 100, capR / 100));

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", borderRadius: 14, padding: "22px 24px", marginBottom: 20, color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Internal Due Diligence Report · March 2026</div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>The Pointe & Oak Shadows</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>Pasadena, TX · 518 + Oak Shadows Units · Seller: VRK 38 / Thistle Creek</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>Under Contract — Direct</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#4ade80" }}>$44K/door</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>+ buyer commissions</div>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Badge text="Direct Contract — Seeds InvestCo" color="green" />
            <Badge text="Active Federal Litigation on Title" color="red" />
            <Badge text="55+/HOPA — Oak Shadows" color="red" />
            <Badge text="21.6% Submarket Vacancy" color="yellow" />
            <Badge text="10-Year Negative Absorption" color="yellow" />
            <Badge text="Real Rent Upside ~$100–150/unit" color="green" />
            <Badge text="7 Comps Analyzed" color="blue" />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                background: tab === t.id ? "#0f172a" : "#fff",
                color: tab === t.id ? "#fff" : "#475569",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* DEAL OVERVIEW */}
        {tab === "overview" && (
          <>
            <Section title="Transaction Summary" color="#0f172a">
              <Row label="Seller" value="VRK 38 Apartments LLC / Thistle Creek" />
              <Row label="Buyer" value="Seeds InvestCo (Direct Contract)" flag="green" />
              <Row label="Contract Price" value="$44,000/door" flag="green" sub="Direct — wholesale assignment bypassed" />
              <Row label="Contract Structure" value="Direct PSA with seller" flag="green" />
              <Row label="Buyer Commissions" value="Additional — confirm total all-in cost/door" flag="yellow" />
              <Row label="The Pointe Units" value="518 units" />
              <Row label="Oak Shadows Units" value="TBD — pending rent roll upload" flag="yellow" />
              <Row label="Combined Portfolio" value="Two-property acquisition" />
            </Section>
            <Section title="The Pointe — Asset Snapshot" color="#1e3a5f">
              <Row label="Location" value="Pasadena, TX (Harris County)" />
              <Row label="Vintage" value="Early 1970s — Class C workforce housing" />
              <Row label="Current Occupancy" value="~65%" flag="red" />
              <Row label="Current Avg Rent" value="$912/unit" sub="vs. $1,097 submarket asking avg" />
              <Row label="Current NOI" value="Effectively zero — distressed" flag="red" />
              <Row label="Condition" value="Unrenovated — deferred maintenance present" flag="red" />
              <Row label="Rent Upside (realistic)" value="~$100–150/unit post-renovation" flag="green" sub="Based on effective comp rents, not asking rents" />
              <Row label="Rent Ceiling (Red Pines model)" value="$899–$929 / 1BR | $1,099–$1,175 / 2BR" flag="green" sub="Requires full gut renovation — not partial refresh" />
              <Row label="Estimated Renovation Capex" value="$8,000–$15,000/unit" flag="yellow" sub="~$4.1M–$7.8M total for 518 units" />
              <Row label="All-In Basis (mid-reno)" value="~$55–56K/door" flag="yellow" sub="$44K + $11K avg renovation" />
            </Section>
            <Section title="Oak Shadows — Key Concerns" color="#7c2d12">
              <Alert type="red">
                <strong>⚠️ Senior Housing Designation — Not Disclosed in Original Pitch.</strong> Oak Shadows is a 55+/HOPA-designated community. Cannot reposition without decertification. Fair Housing Act exposure is real.
              </Alert>
              <Row label="Designation" value="55+ / HOPA Senior Housing" flag="red" />
              <Row label="Fair Housing Act obligations" value="Yes — significant" flag="red" />
              <Row label="Repositioning restrictions" value="Severe — cannot convert to general occupancy without HOPA decertification" flag="red" />
              <Row label="Current rent roll" value="Not yet uploaded — Priority #1" flag="red" />
            </Section>
            <Section title="Title & Litigation" color="#7c3aed">
              <Alert type="red">
                <strong>Active Federal Litigation:</strong> Computershare v. Thistle Creek is on title. The $500K escrow is contradicted between the two LOIs. Must be resolved before closing.
              </Alert>
              <Row label="Active litigation" value="Computershare v. Thistle Creek" flag="red" />
              <Row label="Escrow — Pointe LOI" value="$500K for The Pointe only" />
              <Row label="Escrow — Oak Shadows LOI" value="$500K shared both properties" flag="red" sub="Direct contradiction — needs resolution" />
              <Row label="Title report status" value="Pending — obtain immediately" flag="red" />
            </Section>
          </>
        )}

        {/* MARKET */}
        {tab === "market" && (
          <>
            <Alert type="red">
              <strong>The market is moving against this deal.</strong> These numbers come from Jeff's own CoStar report (pulled 3/2/2026).
            </Alert>
            <Section title="Submarket Fundamentals — CoStar Report #85664871" color="#dc2626">
              <Row label="Current submarket vacancy" value="21.6%" flag="red" sub="Up from 15.7% just 12 months ago — accelerating" />
              <Row label="Absorption trend" value="Negative for 10 consecutive years (since 2016)" flag="red" />
              <Row label="Market occupancy" value="78.4% and declining" flag="red" />
              <Row label="Market cap rate" value="6.71%" sub="CoStar comp set — for stabilized assets" />
              <Row label="Stabilized sale comps" value="~$90K/door" sub="Stabilized, 90%+ occupied assets only" />
              <Row label="Concessions" value="Widespread — 1–4 weeks free common" flag="red" />
            </Section>
            <Section title="Rent Reality Check" color="#1e3a5f">
              <Alert type="yellow">
                The $1,097 submarket average is an <strong>asking rent</strong>. With widespread concessions, effective rents are $50–$150 lower. Critically, two of our new comps — Willow Tree (1BR $830) and Las Plazas (1BR $809–$829) — are achieving BELOW The Pointe's current $912 avg, even after partial renovation. This is a significant finding.
              </Alert>
              <Row label="The Pointe current avg rent" value="$912/unit" />
              <Row label="Willow Tree 1BR (partially renovated, 1974 vintage)" value="$830" flag="red" sub="Below The Pointe — confirms rent premium requires FULL renovation" />
              <Row label="Las Plazas 1BR (post-$1.35M partial reno, 1964 vintage)" value="$809–$829" flag="red" sub="Below The Pointe — $17K/unit partial reno didn't move the needle much" />
              <Row label="Red Pines 1BR (full gut renovation)" value="$899–$929" flag="green" sub="Aspirational ceiling — requires Red Pines-quality finishes" />
              <Row label="Submarket asking avg (CoStar)" value="$1,097/unit" sub="Asking only — inflated by concessions" />
              <Row label="Effective market rents (after concessions)" value="~$950–$1,000" flag="yellow" />
              <Row label="Realistic post-reno target for The Pointe" value="$975–$1,050" flag="yellow" sub="Achievable only with full Red Pines-quality renovation" />
            </Section>
            <Section title="Why the 24-Month Exit Is Aggressive" color="#b45309">
              <Row label="Starting occupancy" value="65% — roughly 181 vacant units" flag="red" />
              <Row label="Units to lease up (to 90%)" value="~130 additional units" flag="yellow" />
              <Row label="Submarket absorption trend" value="Negative — market losing units annually" flag="red" />
              <Row label="Competitor concessions" value="1–4 weeks free in same submarket" flag="red" />
              <Row label="Realistic stabilization timeline" value="36–48 months" flag="yellow" sub="Not Jeff's 24-month claim" />
              <Row label="NOI required for $100K/door exit" value="~$3.47M/year" flag="red" sub="From near-zero today at 6.71% cap" />
            </Section>
          </>
        )}

        {/* COMPS */}
        {tab === "comps" && (
          <>
            <Alert type="yellow">
              All comps have been renovated to varying degrees. <strong>The Pointe has not been renovated.</strong> Effective rents are the correct comparison — not asking rents.
            </Alert>
            <Alert type="purple">
              <strong>🆕 Two new comps added: Willow Tree Apartments (SMI Realty) and Las Plazas Apartments (Crexi for-sale listing).</strong> Both reveal a critical finding: partial renovation in this submarket does NOT push 1BR rents above The Pointe's current $912 avg. Full gut renovation is required to move rents meaningfully higher.
            </Alert>

            {comps.map((c, i) => (
              <Section key={i}
                title={`${c.name} · ${c.address} · ${c.distance} from The Pointe`}
                color={c.aspirational ? "#6d28d9" : c.noteFlag === "green" ? "#166534" : c.noteFlag === "red" ? "#dc2626" : "#1e3a5f"}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  {c.aspirational && <Badge text="⭐ ASPIRATIONAL POST-RENO COMP" color="blue" />}
                  {c.allBillsPaid && <Badge text="ALL BILLS PAID" color="yellow" />}
                  {(c.name.includes("Willow Tree") || c.name.includes("Las Plazas")) && <Badge text="🆕 NEW COMP" color="blue" />}
                  {c.name.includes("Las Plazas") && <Badge text="FOR SALE — Crexi" color="yellow" />}
                  <Badge text={`Built ${c.built}`} color="blue" />
                  <Badge text={`${c.units} units`} color="blue" />
                  {c.aspirational && <Badge text="Greenline Management" color="green" />}
                </div>
                <Row label="Manager" value={c.manager} />
                <Row label="Renovation Status" value={c.renovated} flag={c.aspirational ? "green" : "yellow"} />
                <Row label="Current Occupancy / Availability" value={c.occ} flag={c.occFlag} />
                <Row label="Asking Rents" value={c.rents} flag={c.rentFlag} />
                <Row label="Effective Rents (adjusted)" value={c.effective} flag={c.occFlag} />
                {c.phone && <Row label="Phone" value={c.phone} />}
                {c.extras && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: c.aspirational ? "#4c1d95" : "#334155", marginBottom: 6 }}>
                      {c.aspirational ? "Renovation Finishes — Blueprint for The Pointe" : "Notable Features"}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {c.extras.map((a, j) => (
                        <span key={j} style={{ background: c.aspirational ? "#f5f3ff" : "#f1f5f9", border: `1px solid ${c.aspirational ? "#c4b5fd" : "#e2e8f0"}`, borderRadius: 6, padding: "3px 9px", fontSize: 11, color: c.aspirational ? "#4c1d95" : "#475569", fontWeight: 600 }}>{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 10, background: c.aspirational ? "#f5f3ff" : c.noteFlag === "green" ? "#f0fdf4" : c.noteFlag === "red" ? "#fef2f2" : "#fffbeb",
                  borderRadius: 8, padding: "9px 12px", fontSize: 12,
                  color: c.aspirational ? "#4c1d95" : c.noteFlag === "green" ? "#166534" : c.noteFlag === "red" ? "#991b1b" : "#92400e" }}>
                  {c.note}
                </div>
              </Section>
            ))}

            <Section title="Comp Set Summary — Full 9-Comp Rent Range Analysis" color="#0f172a">
              <Alert type="red">
                <strong>Critical Finding #1 — Partial Reno Doesn't Move Rents:</strong> Willow Tree ($830/1BR) and Las Plazas ($809–$829/1BR) are BELOW The Pointe's current $912 avg despite renovation capex. Partial reno will not justify rent growth.
              </Alert>
              <Alert type="yellow">
                <strong>Critical Finding #2 — Full Reno Requires Strong Management:</strong> Vista Azul has Red Pines-identical finishes (3cm granite, vessel sinks, crown molding) yet is running half-month-free concessions with 106 active vacancies. Quarters on Red Bluff (same vintage, partial update) is at 95% occupancy. Management execution is the differentiator, not finishes alone.
              </Alert>
              <Row label="Las Plazas 1BR (1964, $1.35M partial reno)" value="$809–$829" flag="red" sub="Below The Pointe avg — active for-sale on Crexi" />
              <Row label="Willow Tree 1BR (1974, partially updated)" value="$830" flag="red" sub="Below The Pointe avg — SMI Realty" />
              <Row label="Veranda Village (floor)" value="~$549–$800" flag="red" sub="Distressed — management issues" />
              <Row label="Quay Point" value="~$660–$900" flag="yellow" sub="14% vacancy, price drops active" />
              <Row label="Vista Azul 1BR (1971, fully renovated — RED BLUFF RD)" value="$849–$925 w/ concessions" flag="yellow" sub="106 units vacant — management quality drag" />
              <Row label="Quarters on Red Bluff 1BR (1971, partial update — 95% occ)" value="$840–$975" flag="green" sub="Best occ in comp set — JAW Equity" />
              <Row label="Silver Club" value="~$950–$1,050" flag="green" sub="45 units, professionally managed" />
              <Row label="Terracita effective rent (ex-utilities)" value="~$815–$1,050" flag="green" sub="91.5% occ, fully renovated, all-bills-paid" />
              <Row label="Red Pines 1BR (full gut — Red Bluff Rd, 0.53 mi from Vista Azul)" value="$899–$929" flag="green" sub="⭐ Aspirational — no utility bundling, no concessions" />
              <Row label="Red Pines 2BR" value="$1,099–$1,175" flag="green" sub="⭐ 2BR ceiling for The Pointe" />
              <Row label="The Pointe current avg rent" value="$912" sub="Already above 3 partially-renovated peers" />
              <Row label="Realistic post-FULL-reno + strong mgmt target" value="$950–$1,050" flag="green" sub="Quarters + Red Pines prove it — Vista Azul proves mgmt matters" />
            </Section>
          </>
        )}

        {/* EXIT MODEL */}
        {tab === "exit" && (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              {[
                { label: `Exit Cap Rate: ${capR.toFixed(1)}%`, min: 5.5, max: 9.0, step: 0.1, val: capR, set: setCapR, lo: "5.5% (optimistic)", hi: "9% (distressed)" },
                { label: `Expense Ratio: ${expR}%`, min: 45, max: 65, step: 1, val: expR, set: setExpR, lo: "45% (well-run)", hi: "65% (distressed)" },
                { label: `Entry Price: ${entryK}K/door`, min: 35, max: 60, step: 1, val: entryK, set: setEntryK, lo: "$35K (below ask)", hi: "$60K (above ask)" },
                { label: `Renovation: ${renoK}K/unit`, min: 5, max: 20, step: 1, val: renoK, set: setRenoK, lo: "$5K (light)", hi: "$20K (full gut)" },
              ].map(({ label, min, max, step, val, set, lo, hi }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", flex: "1 1 180px", minWidth: 180 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>{label}</label>
                  <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))} style={{ width: "100%" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8" }}><span>{lo}</span><span>{hi}</span></div>
                </div>
              ))}
            </div>
            <div style={{ background: "#0f172a", borderRadius: 10, padding: "12px 18px", marginBottom: 14, display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { label: "Entry Price", val: `${entryK}K/door` },
                { label: "Renovation", val: `${renoK}K/unit` },
                { label: "All-In Basis", val: `${entryK + renoK}K/door`, highlight: true },
                { label: "Total Capex (518 units)", val: `${((entryK + renoK) * 518 / 1000).toFixed(1)}M` },
                { label: "Break-Even Exit $/Door", val: `${entryK + renoK}K` },
              ].map(({ label, val, highlight }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: highlight ? 20 : 15, fontWeight: 900, color: highlight ? "#4ade80" : "#fff" }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#f5f3ff", border: "1px solid #c4b5fd", borderRadius: 10, padding: "10px 16px", marginBottom: 14, fontSize: 13, color: "#4c1d95" }}>
              <strong>⭐ Red Pines Benchmark:</strong> Full gut renovation supports <strong>$899–$929 / 1BR</strong> and <strong>$1,099–$1,175 / 2BR</strong>. <strong>⚠️ Willow Tree / Las Plazas Warning:</strong> Partial renovation only achieves $809–$830 / 1BR — BELOW current Pointe rents. Budget for a full renovation or do not underwrite rent growth.
            </div>
            <div style={{ overflowX: "auto", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 14 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#0f172a", color: "#fff" }}>
                    {["Scenario", "NOI", "Exit Value", "$/Door", `vs ${entryK}K Entry`, `vs ${entryK+renoK}K All-In`].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: h === "Scenario" ? "left" : "right", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exitScenarios.map((s, i) => {
                    const r = rows[i];
                    const allIn = (entryK + renoK) * 1000;
                    const isProfit = r.perDoor >= allIn;
                    const annReturn = allIn > 0 && holdYrs > 0
                      ? (Math.pow(r.perDoor / allIn, 1 / holdYrs) - 1) * 100
                      : 0;
                    return (
                      <tr key={s.label} style={{ background: isProfit ? "#f0fdf4" : i % 2 === 0 ? "#fff" : "#f8fafc",
                        borderLeft: `4px solid ${r.perDoor >= (entryK+renoK)*1000 ? "#16a34a" : r.perDoor >= entryK*1000 ? "#d97706" : "#dc2626"}` }}>
                        <td style={{ padding: "9px 12px", fontWeight: 600, fontSize: 12 }}>{s.label}</td>
                        <td style={{ padding: "9px 12px", textAlign: "right" }}>${(r.noi / 1000000).toFixed(2)}M</td>
                        <td style={{ padding: "9px 12px", textAlign: "right" }}>${(r.value / 1000000).toFixed(1)}M</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800,
                          color: r.perDoor >= (entryK+renoK)*1000 ? "#15803d" : r.perDoor >= entryK*1000 ? "#d97706" : "#dc2626" }}>
                          ${Math.round(r.perDoor / 1000)}K
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", color: (r.perDoor - entryK*1000) >= 0 ? "#15803d" : "#dc2626", fontWeight: 600 }}>
                          {(r.perDoor - entryK*1000) >= 0 ? "+" : ""}{Math.round((r.perDoor - entryK*1000) / 1000)}K
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", color: (r.perDoor - (entryK+renoK)*1000) >= 0 ? "#15803d" : "#dc2626", fontWeight: 600 }}>
                          {(r.perDoor - (entryK+renoK)*1000) >= 0 ? "+" : ""}{Math.round((r.perDoor - (entryK+renoK)*1000) / 1000)}K
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700,
                          color: annReturn >= 15 ? "#15803d" : annReturn >= 8 ? "#d97706" : "#dc2626" }}>
                          {annReturn >= 0 ? annReturn.toFixed(1) : "—"}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#475569", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              518 units | Cap rate: {capR}% | Expense ratio: {expR}% | Entry: ${entryK}K/door | Renovation: ${renoK}K/unit | All-in: ${entryK+renoK}K/door | Hold: {holdYrs} yr{holdYrs !== 1 ? "s" : ""} | Ann. return = (Exit $/door ÷ All-in)^(1/yrs) − 1 | No interim cash flow or debt included
            </div>
          </>
        )}

        {/* RISKS */}
        {tab === "risks" && (
          <>
            <Section title="🔴 Critical Risks — Must Resolve Before Closing" color="#dc2626">
              {[
                ["Federal Litigation on Title", "Computershare v. Thistle Creek is active. $500K escrow is contradicted between the two LOIs. Get a full title report immediately."],
                ["Oak Shadows HOPA/55+ Designation", "Not disclosed in original pitch. Cannot reposition without decertification. Fair Housing Act exposure is real. Legal review required before pricing into business plan."],
                ["T-12 Financials Not Yet Reviewed", "Without verified trailing 12-month financials, all NOI projections are theoretical. Do not close without audited T-12."],
              ].map(([title, body], i) => (
                <Alert key={i} type="red"><strong>{title}:</strong> {body}</Alert>
              ))}
            </Section>
            <Section title="🟡 Significant Risks — Underwrite Carefully" color="#b45309">
              {[
                ["Partial Renovation Will Not Drive Rent Growth", "NEW FINDING: Willow Tree (1974, partially updated) achieves $830/1BR. Las Plazas (1964, $1.35M capex 2016–2019) achieves $809–$829/1BR. Both are BELOW The Pointe's current $912 avg. A partial renovation strategy will not generate the rent premium needed to justify the capex. Budget for a full Red Pines-quality gut renovation ($12–18K/unit) or do not underwrite rent growth."],
                ["Market Absorption", "Submarket has had negative absorption for 10 consecutive years and vacancy is accelerating (15.7% → 21.6% in 12 months)."],
                ["Renovation Capex Unknown", "Without a physical inspection, the $8–15K/unit estimate is a range. Properties with deferred maintenance can carry hidden infrastructure costs."],
                ["Comp Concessions Compress Effective Rents", "Every comp in this submarket is offering concessions. Model effective rents $50–100 below asking during the first 18 months."],
                ["Terracita 'All Bills Paid' Mirage", "Normalize Terracita by $100–125/month before using its rents as a benchmark. The Pointe will not include utilities."],
              ].map(([title, body], i) => (
                <Alert key={i} type="yellow"><strong>{title}:</strong> {body}</Alert>
              ))}
            </Section>
            <Section title="🟢 Genuine Upside Factors" color="#166534">
              {[
                ["Entry Price Protects Downside", "At $44K/door direct, you've bought at today's distressed value. Limited downside at entry."],
                ["Red Pines Proves the Ceiling", "Red Pines achieves $899–$929/1BR and $1,099–$1,175/2BR with a full renovation in the same submarket. No utilities included. That is the achievable target."],
                ["The Pointe's Rents Are Already Above Partially-Renovated Peers", "At $912 avg, The Pointe already outperforms two partially-renovated comps (Willow Tree at $830, Las Plazas at $809–$829). This confirms the property is not a rent turnaround story — it's an occupancy and renovation story."],
                ["Workforce Housing Demand Is Durable", "Port of Houston, Hobby Airport, and industrial corridors provide stable employment. Workforce demand has a floor Class A assets don't."],
                ["Greenline Management Blueprint", "Red Pines' operator is active in this exact submarket with demonstrated results. Worth contacting for a management proposal."],
              ].map(([title, body], i) => (
                <Alert key={i} type="green"><strong>{title}:</strong> {body}</Alert>
              ))}
            </Section>
          </>
        )}

        {/* NEXT STEPS */}
        {tab === "nextsteps" && (
          <>
            <Section title="Immediate — Before Any Further Commitments" color="#dc2626">
              {[
                ["Attorney Review — Title & Litigation", "Obtain full title report. Resolve the $500K escrow contradiction between LOIs. Quantify Computershare v. Thistle Creek exposure."],
                ["Oak Shadows Legal Review", "Confirm HOPA/55+ designation. Understand decertification requirements and timeline if conversion is contemplated."],
                ["Upload Oak Shadows Rent Roll", "Current occupancy, tenant age profile, in-place rents, and lease expiration schedule."],
              ].map(([title, body], i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #fee2e2", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 900, fontSize: 16, color: "#dc2626", minWidth: 24 }}>!</span>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{body}</div></div>
                </div>
              ))}
            </Section>
            <Section title="Due Diligence — Within 2 Weeks" color="#b45309">
              {[
                ["T-12 Financials — The Pointe", "Verified trailing 12-month income/expense statement. Cross-reference against CoStar vacancy data."],
                ["Physical Inspection — Both Properties", "Unit-by-unit walk on a representative sample (20–30%). Get a third-party property condition assessment (PCA)."],
                ["PSA Review — Full Contract Terms", "Confirm closing timeline, earnest money, inspection period, and seller representations."],
                ["Commission Confirmation", "Confirm total buyer commissions and calculate true all-in cost per door."],
                ["Tour Red Pines in Person", "Visit 3823 Red Bluff Rd, Pasadena TX. Walk renovated units, photograph finishes. This becomes your renovation spec sheet. Call (832) 219-6757."],
                ["Tour Las Plazas & Walk Units", "3940 S Shaver St — call (346) 980-7106. Understand what $1.35M in renovation (2016–2019) looks like on the ground and how their rents compare to The Pointe. Key data point for capex-to-rent relationship."],
                ["Contact Greenline Apartment Management", "Red Pines' operator (greenlinemanagement.com). Get a management proposal for The Pointe. Understand fee structure and bilingual leasing capabilities."],
                ["Evaluate Las Plazas Assumable Loan", "Las Plazas has an assumable Fannie Mae loan at 3.35% — worth understanding the structure even if you don't acquire the property, as it signals what institutional debt looks like in this submarket."],
              ].map(([title, body], i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #fed7aa", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 900, fontSize: 16, color: "#d97706", minWidth: 24 }}>{i + 1}</span>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{body}</div></div>
                </div>
              ))}
            </Section>
            <Section title="Pre-Close — Underwriting Refinement" color="#1e3a5f">
              {[
                ["Build Final Proforma", "Using verified T-12, confirmed capex from PCA, effective rents (not asking rents). Use Red Pines as the rent ceiling in the bull case. Do NOT model rent growth without a fully funded full-renovation budget."],
                ["Management Company Selection", "Red Pines (Greenline) and Terracita both prove strong management delivers in this submarket. Willow Tree's mixed reviews and Las Plazas' ongoing vacancy show that adequate-but-not-great management leaves value on the table."],
                ["Capital Stack Confirmation", "Ensure renovation capex is funded at close. Partial renovation will not move rents above current levels — only full Red Pines-quality renovation justifies the rent growth thesis. Budget $12–18K/unit minimum."],
              ].map(([title, body], i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #dbeafe", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 900, fontSize: 16, color: "#2563eb", minWidth: 24 }}>→</span>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{body}</div></div>
                </div>
              ))}
            </Section>
          </>
        )}

        {/* ECONOMIC INTEL */}
        {tab === "econ" && (
          <>
            <Section title="🟢 Tailwind #1 — Port Houston Ship Channel Expansion (Project 11)" color="#166534">
              <Alert type="green"><strong>The single most important economic development story for this submarket.</strong> A multi-decade federal infrastructure investment supporting thousands of blue-collar jobs that match your exact tenant profile.</Alert>
              <Row label="Scope" value="Widened Galveston Bay channel from 530 ft → 700 ft" flag="green" />
              <Row label="Port-led dredging status" value="Complete (Oct 2025)" flag="green" />
              <Row label="USACE remaining work" value="On track for full completion 2029" flag="green" />
              <Row label="FY2026 federal allocation" value="$161M for Project 11 + $53.6M O&M" flag="green" />
              <Row label="Economic footprint" value="~1.5M jobs in Texas / $439B state economic activity" flag="green" />
            </Section>
            <Section title="🟢 Tailwind #2 — Houston Metro Job Growth" color="#166534">
              <Row label="2026 job forecast (Greater Houston Partnership)" value="30,900 new jobs" flag="green" sub="Below 50K recent annual avg — moderating but positive" />
              <Row label="Total metro jobs by end of 2026" value="Record 3.5 million projected" flag="green" />
              <Row label="Population growth (2024)" value="+200,000 new residents" flag="green" />
              <Row label="Recession odds (WSJ survey, Oct 2025)" value="33% — not alarming, not benign" flag="yellow" />
            </Section>
            <Section title="🟢 Tailwind #3 — Pasadena's Industrial Anchor Employers" color="#166534">
              <Row label="Chevron Pasadena Refinery" value="Operational" flag="green" />
              <Row label="Pemex Deer Park Refinery" value="Operational — 275,000 bbl/day" flag="green" />
              <Row label="Shell Deer Park Manufacturing" value="Active 1,500-acre complex" flag="green" />
              <Row label="Bayport Terminal" value="Container volume growing with Project 11" flag="green" />
              <Row label="San Jacinto College" value="2025 Aspen Prize Finalist — trains Ship Channel workforce pipeline" flag="green" />
            </Section>
            <Section title="🔴 Headwind — LyondellBasell Refinery Closure (~400+ Jobs Lost)" color="#dc2626">
              <Alert type="red"><strong>Almost certainly a primary driver of the vacancy spike from 15.7% → 21.6%.</strong> This is not a management problem at The Pointe — it is a demand problem caused by a specific employer exit.</Alert>
              <Row label="Facility" value="LyondellBasell Houston Refinery — closed Q1 2025" flag="red" />
              <Row label="Direct layoffs" value="345–400+ confirmed via Texas Workforce Commission" flag="red" />
              <Row label="Site future" value="Plastic recycling hub planned — equipment install after 2027" flag="yellow" sub="Not near-term demand" />
            </Section>
            <Section title="🟡 Macro Caution — Petrochemical Sector Softening" color="#b45309">
              <Alert type="yellow">The LyondellBasell closure is not isolated. Monitor for additional closures among smaller Ship Channel operators.</Alert>
              <Row label="American Chemistry Council sentiment" value="'Rough patch' in Q3 2025" flag="yellow" />
              <Row label="Houston exposure" value="Diversified beyond refining — petrochems, logistics, health, tech" flag="green" />
            </Section>
            <Section title="📋 Site Visit Checklist — Economic Ground Truth" color="#0f172a">
              {[
                ["Drive the Ship Channel corridor", "Note active vs. idle plants. Flaring, truck traffic, contractor vehicles = employment health."],
                ["Tour Red Pines in person", "3823 Red Bluff Rd, Pasadena TX — (832) 219-6757. Walk renovated units. Ask where tenants work. Most important comp visit."],
                ["Tour Las Plazas in person", "3940 S Shaver St — (346) 980-7106. See what $1.35M in 2016–2019 renovation looks like. Ask management why they're selling and about tenant employment profile."],
                ["Ask Terracita's management where tenants work", "91.5% occupied. Their tenant employment profile tells you which employers are driving real demand right now."],
                ["Check Bayport Terminal activity", "Container volume growing post-Project 11. Logistics/port jobs are your most stable tenant source."],
                ["Talk to local property managers", "Ask: where are tenants coming from? What industries? Real-time submarket intelligence CoStar can't provide."],
              ].map(([title, body], i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #e2e8f0", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 900, fontSize: 15, color: "#0f172a", minWidth: 24 }}>→</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{body}</div>
                  </div>
                </div>
              ))}
            </Section>
            <Section title="Economic Verdict for Your Underwriting" color="#1e3a5f">
              <Alert type="green"><strong>Long-term foundation is solid.</strong> Port expansion, Chevron, Pemex, Shell, San Jacinto College anchor durable blue-collar employment — exactly your tenant profile.</Alert>
              <Alert type="red"><strong>Near-term drag is real.</strong> LyondellBasell explains the vacancy spike. Identify the replacement demand source before underwriting aggressive lease-up assumptions.</Alert>
              <Alert type="yellow"><strong>Watch the sector.</strong> If a second major Ship Channel employer announces closures during your hold, vacancy could deteriorate further before recovering.</Alert>
            </Section>
          </>
        )}

        <div style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 12, paddingBottom: 8 }}>
          Prepared by Seeds InvestCo Due Diligence Team · March 2026 · Confidential — Internal Use Only
        </div>
      </div>
    </div>
  );
}
