"use client";

import { useState } from "react";
import { 
  ShoppingCart, 
  Layers, 
  ShieldCheck, 
  Box, 
  Truck, 
  HeartHandshake, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  RotateCcw,
  Check,
  BadgeCheck,
  GitBranch
} from "lucide-react";

export function ProcessFlowchart() {
  const [activeTab, setActiveTab] = useState<"fulfillment" | "quality">("fulfillment");
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const fulfillmentSteps = [
    {
      step: "01",
      title: "Smart Order & Verification",
      phase: "Phase 1: Ingestion",
      icon: ShoppingCart,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      accent: "#BC8477",
      shortDesc: "Order placed securely with instant automated validation and inventory lock.",
      details: [
        "Bank-grade 256-bit encrypted checkout",
        "Instant SMS & email order confirmation",
        "Automated fraud & address verification"
      ],
      metric: "Processed in < 30 seconds"
    },
    {
      step: "02",
      title: "Smart Hub Allocation",
      phase: "Phase 2: Fulfillment Hub",
      icon: Layers,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      accent: "#3B82F6",
      shortDesc: "Allocated to the closest climate-controlled regional fulfillment center.",
      details: [
        "Proximity-based smart warehouse routing",
        "Barcode inventory extraction",
        "Dust-free, temperature-controlled storage"
      ],
      metric: "Dispatched to QA within 45 mins"
    },
    {
      step: "03",
      title: "Multi-Point QA Gate",
      phase: "Phase 3: Decision Gate",
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "#10B981",
      shortDesc: "10-point physical inspection for stitch, finish, specs, and flawless quality.",
      details: [
        "Physical inspection by certified QA specialists",
        "Zero-compromise tolerance for defects",
        "Automated re-routing for flagged units"
      ],
      metric: "99.8% first-pass perfection",
      isDecisionGate: true
    },
    {
      step: "04",
      title: "Eco-Armored Packaging",
      phase: "Phase 4: Protection",
      icon: Box,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      accent: "#8B5CF6",
      shortDesc: "Cushioned with biodegradable materials and tamper-evident security seals.",
      details: [
        "100% recyclable, shock-absorbing materials",
        "Tamper-proof holographic security seal",
        "Personalized invoice & care guide included"
      ],
      metric: "100% plastic-neutral boxing"
    },
    {
      step: "05",
      title: "Express Logistics Dispatch",
      phase: "Phase 5: Transit",
      icon: Truck,
      color: "bg-orange-50 text-orange-700 border-orange-200",
      accent: "#F97316",
      shortDesc: "Fast-tracked courier dispatch with live GPS tracking notifications.",
      details: [
        "Same-day dispatch for prime hours",
        "Real-time SMS tracking updates",
        "Optimized urban & national delivery routes"
      ],
      metric: "99.4% on-time delivery rate"
    },
    {
      step: "06",
      title: "Doorstep Delight & Care",
      phase: "Phase 6: Delivery & Aftercare",
      icon: HeartHandshake,
      color: "bg-rose-50 text-rose-700 border-rose-200",
      accent: "#BC8477",
      shortDesc: "Open-box check supported, backed by our 7-day hassle-free return policy.",
      details: [
        "Courteous handover with contactless option",
        "Instant delivery confirmation notification",
        "7-day easy returns & 24/7 dedicated support"
      ],
      metric: "4.9/5 customer satisfaction score"
    }
  ];

  const qualityStages = [
    {
      stage: "Stage 01",
      title: "Vetted Sourcing",
      desc: "Direct partnerships with verified artisans and ethical manufacturers.",
      status: "Inbound Verification"
    },
    {
      stage: "Stage 02",
      title: "Batch Testing",
      desc: "Random sample lab & stress testing before inventory acceptance.",
      status: "Pre-Storage Check"
    },
    {
      stage: "Stage 03",
      title: "Order Pick QA",
      desc: "Individual unit unboxing & 10-point visual/hardware check.",
      status: "Active Gate"
    }
  ];

  return (
    <section className="py-20 px-6 lg:px-12 max-w-[1600px] mx-auto">
      {/* ── Section Header ── */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BC8477]/10 text-[#BC8477] font-bold text-xs uppercase tracking-wider mb-4 border border-[#BC8477]/20">
          <Sparkles size={14} />
          <span>Transparent Operations</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
          How Velora Works: <br />
          <span className="text-[#BC8477]">Our Seamless Process Flowchart</span>
        </h2>
        <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed">
          From the moment you browse to the second your package arrives at your doorstep, here is a transparent look at our strict fulfillment and quality pipeline.
        </p>

        {/* ── View Switcher Tabs ── */}
        <div className="mt-8 inline-flex p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTab("fulfillment")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "fulfillment"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Truck size={16} className={activeTab === "fulfillment" ? "text-[#BC8477]" : ""} />
            <span>Order Fulfillment Pipeline</span>
          </button>
          <button
            onClick={() => setActiveTab("quality")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "quality"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <GitBranch size={16} className={activeTab === "quality" ? "text-[#BC8477]" : ""} />
            <span>Quality Gate Decision Flowchart</span>
          </button>
        </div>
      </div>

      {/* ── Tab 1: Order Fulfillment Pipeline ── */}
      {activeTab === "fulfillment" && (
        <div className="space-y-12">
          {/* Visual Step Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {fulfillmentSteps.map((item, index) => {
              const Icon = item.icon;
              const isSelected = selectedStep === index;

              return (
                <div
                  key={item.step}
                  onClick={() => setSelectedStep(index)}
                  className={`relative p-8 rounded-[32px] border transition-all duration-300 cursor-pointer bg-white group hover:shadow-xl ${
                    isSelected
                      ? "border-[#BC8477] shadow-lg ring-2 ring-[#BC8477]/20"
                      : "border-gray-100 hover:border-gray-200 shadow-sm"
                  }`}
                >
                  {/* Top Badge & Step */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
                      {item.phase}
                    </span>
                    <span className="text-2xl font-black text-gray-200 group-hover:text-[#BC8477] transition-colors">
                      {item.step}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110 ${item.color}`}>
                      <Icon size={26} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 leading-snug group-hover:text-[#BC8477] transition-colors">
                        {item.title}
                      </h3>
                      {item.isDecisionGate && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                          <CheckCircle2 size={12} />
                          Zero Defect Gate
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                    {item.shortDesc}
                  </p>

                  {/* Bullet Points */}
                  <ul className="space-y-2.5 pt-4 border-t border-gray-100">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-gray-600">
                        <Check size={14} className="text-[#BC8477] shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer Metric */}
                  <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">Standard</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Clock size={13} className="text-[#BC8477]" />
                      {item.metric}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Flow Indicator Strip */}
          <div className="bg-[#F7F5EE] rounded-3xl p-6 md:p-8 border border-[#E8E1DE] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#BC8477] shadow-sm shrink-0">
                <BadgeCheck size={26} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">The Velora 100% Transparency Promise</h4>
                <p className="text-xs text-gray-600 font-medium">Every stage is logged and tracked to ensure uncompromised quality and customer satisfaction.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-[#BC8477] bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All 6 Fulfillment Hubs Operating at 99.8% SLA</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Quality Gate Decision Flowchart ── */}
      {activeTab === "quality" && (
        <div className="bg-white rounded-[40px] border border-gray-200 p-6 md:p-12 shadow-sm">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#BC8477] bg-[#BC8477]/10 px-3 py-1 rounded-full">
              Inspection Architecture
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-3 mb-2">
              Decision Gate & Quality Assurance Flow
            </h3>
            <p className="text-gray-500 font-medium text-sm">
              Our dual-layer decision gate filters out imperfections before items ever reach packaging.
            </p>
          </div>

          {/* Flowchart Diagram Structure */}
          <div className="flex flex-col items-center max-w-4xl mx-auto space-y-6">
            {/* Node 1: Sourcing */}
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center shadow-sm hover:border-[#BC8477] transition-colors">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Step 1: Input</span>
              <h4 className="font-bold text-gray-900 text-base mt-1">Verified Supplier / Artisan Inbound</h4>
              <p className="text-xs text-gray-500 mt-1">Direct batch procurement with batch origin certificate.</p>
            </div>

            {/* Down Arrow */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-gray-300"></div>
              <ArrowDown size={18} className="text-gray-400" />
            </div>

            {/* Node 2: Inbound Scan */}
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center shadow-sm hover:border-[#BC8477] transition-colors">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Step 2: Intake</span>
              <h4 className="font-bold text-gray-900 text-base mt-1">Warehouse Intake & Barcode Encoding</h4>
              <p className="text-xs text-gray-500 mt-1">Logged into central inventory with unique tracking IDs.</p>
            </div>

            {/* Down Arrow */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-gray-300"></div>
              <ArrowDown size={18} className="text-gray-400" />
            </div>

            {/* Node 3: DECISION GATE (Diamond Styled Card) */}
            <div className="w-full max-w-lg bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 text-center shadow-md relative overflow-hidden">
              <div className="absolute top-2 right-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900">
                  Decision Gate
                </span>
              </div>
              <ShieldCheck size={36} className="text-amber-600 mx-auto mb-2" />
              <h4 className="font-extrabold text-gray-900 text-lg">
                10-Point Multi-Stage Inspection
              </h4>
              <p className="text-xs text-gray-600 font-medium max-w-sm mx-auto mt-1">
                Visual inspection, stitching/finish check, functional testing, and authenticity verification.
              </p>
            </div>

            {/* Branching Connector */}
            <div className="w-full max-w-2xl relative pt-2">
              <div className="hidden md:flex justify-between items-center px-16 relative">
                {/* Horizontal branch line */}
                <div className="absolute left-[20%] right-[20%] top-0 h-0.5 bg-gray-300"></div>
              </div>

              {/* Two Branches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Branch 1: PASSED */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                      <CheckCircle2 size={13} />
                      PASSED (98.4%)
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800">Direct Route</span>
                  </div>
                  <h5 className="font-bold text-gray-900 text-sm mt-3">Proceed to Eco-Armored Boxing</h5>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Product certified with Velora Quality Stamp, sealed in protective custom boxing, and moved to priority outbound dispatch.
                  </p>
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-semibold text-emerald-900">
                    <span>Outcome: Flawless Delivery</span>
                    <span>Doorstep in 24-48h</span>
                  </div>
                </div>

                {/* Branch 2: FLAGGED */}
                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white">
                      <AlertCircle size={13} />
                      FLAGGED (1.6%)
                    </span>
                    <span className="text-[11px] font-bold text-rose-800">Buffer Route</span>
                  </div>
                  <h5 className="font-bold text-gray-900 text-sm mt-3">Quarantine & Auto-Replace</h5>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Item immediately quarantined. A pre-verified unit from our certified reserve pool is seamlessly swapped with zero dispatch delay.
                  </p>
                  <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-[11px] font-semibold text-rose-900">
                    <span>Defect Never Reaches Customer</span>
                    <span>Supplier Penalty Logged</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Down to Final Delivery Node */}
            <div className="flex flex-col items-center pt-4">
              <div className="w-0.5 h-6 bg-gray-300"></div>
              <ArrowDown size={18} className="text-gray-400" />
            </div>

            {/* Node 4: Final Handover */}
            <div className="w-full max-w-md bg-[#F7F5EE] border border-[#E8E1DE] rounded-2xl p-5 text-center shadow-sm">
              <span className="text-[11px] font-bold text-[#BC8477] uppercase tracking-wider">Final Step: Customer Delight</span>
              <h4 className="font-bold text-gray-900 text-base mt-1">Insured Delivery & 7-Day Hassle-Free Care</h4>
              <p className="text-xs text-gray-600 mt-1">Open-box inspection available upon handover, backed by 24/7 dedicated support.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
