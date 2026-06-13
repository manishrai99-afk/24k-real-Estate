"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TrendingUp, Building, CheckCircle, Clock, ArrowRight, Plus, X, ArrowLeft, Users, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../layout";
import {
  getStoredData,
  setStoredData,
  initialDeals,
  initialLeads,
  initialProperties,
  initialLedger,
} from "../../../lib/mock-data";

const formatPrice = (v: number) => v >= 10000000 ? `₹ ${(v / 10000000).toFixed(2)} Cr` : `₹ ${(v / 100000).toFixed(0)} Lakhs`;

const dealStages = [
  { id: "LEAD", label: "Lead", leadStatus: "NEW" },
  { id: "SITE_VISIT", label: "Site Visit", leadStatus: "SITE_VISIT" },
  { id: "NEGOTIATION", label: "Negotiation", leadStatus: "NEGOTIATION" },
  { id: "BOOKING", label: "Booking", leadStatus: "NEGOTIATION" },
  { id: "AGREEMENT", label: "Agreement", leadStatus: "BOOKED" },
  { id: "CLOSURE", label: "Closed", leadStatus: "BOOKED" },
];

function DealsTrackerContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  // Storage states
  const [deals, setDeals] = useState<any[]>([]);
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [propertiesList, setPropertiesList] = useState<any[]>([]);
  
  // Page states
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Form State
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [bookingToken, setBookingToken] = useState("200000");

  useEffect(() => {
    const loadedDeals = getStoredData("crm_deals", initialDeals);
    setDeals(loadedDeals);

    const loadedLeads = getStoredData("crm_leads", initialLeads);
    setLeadsList(loadedLeads);

    const loadedProps = getStoredData("crm_properties", initialProperties);
    setPropertiesList(loadedProps);

    // Process search/pre-select query parameter
    const querySearch = searchParams.get("search");
    if (querySearch) {
      const match = loadedDeals.find((d: any) => d.id === querySearch || d.leadName.toLowerCase().includes(querySearch.toLowerCase()));
      if (match) {
        setSelectedDeal(match);
      }
    }
  }, [searchParams]);

  const saveDealsToStorage = (updated: any[]) => {
    setDeals(updated);
    setStoredData("crm_deals", updated);
  };

  // Sync stage changes back to Lead Status in storage
  const syncLeadStatus = (leadName: string, dealStatus: string) => {
    const matchingStage = dealStages.find(s => s.id === dealStatus);
    if (!matchingStage) return;

    const leads = getStoredData("crm_leads", initialLeads);
    const updatedLeads = leads.map((l: any) => {
      if (l.name === leadName) {
        return { ...l, status: matchingStage.leadStatus };
      }
      return l;
    });
    setStoredData("crm_leads", updatedLeads);
  };

  const advanceStage = (dealId: string) => {
    const updated = deals.map((d) => {
      if (d.id === dealId) {
        const idx = dealStages.findIndex((s) => s.id === d.status);
        if (idx < dealStages.length - 1) {
          const next = dealStages[idx + 1].id;
          showToast(`Deal ${d.id} moved to ${dealStages[idx + 1].label}`, "success");
          
          // Sync with Leads CRM
          syncLeadStatus(d.leadName, next);

          const updatedDeal = { ...d, status: next };
          if (selectedDeal?.id === dealId) setSelectedDeal(updatedDeal);
          return updatedDeal;
        }
      }
      return d;
    });
    saveDealsToStorage(updated);
  };

  const revertStage = (dealId: string) => {
    const updated = deals.map((d) => {
      if (d.id === dealId) {
        const idx = dealStages.findIndex((s) => s.id === d.status);
        if (idx > 0) {
          const prev = dealStages[idx - 1].id;
          showToast(`Deal ${d.id} reverted to ${dealStages[idx - 1].label}`, "warning");
          
          // Sync with Leads CRM
          syncLeadStatus(d.leadName, prev);

          const updatedDeal = { ...d, status: prev };
          if (selectedDeal?.id === dealId) setSelectedDeal(updatedDeal);
          return updatedDeal;
        }
      }
      return d;
    });
    saveDealsToStorage(updated);
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !selectedPropertyId) {
      showToast("Please select both a lead and a property unit", "error");
      return;
    }

    const leadObj = leadsList.find((l) => l.id === selectedLeadId);
    const propObj = propertiesList.find((p) => p.id === selectedPropertyId);
    if (!leadObj || !propObj) return;

    const tokenAmount = parseFloat(bookingToken) || 200000;
    const dealId = `DL-00${deals.length + 21}`;

    const newDeal = {
      id: dealId,
      leadName: leadObj.name,
      propertyUnit: `${propObj.project} ${propObj.unitNumber}`,
      project: propObj.project,
      builder: propObj.builder,
      agent: leadObj.agent,
      bookingAmount: tokenAmount,
      totalValue: propObj.price,
      status: "BOOKING",
      milestones: [
        { id: 1, name: "Booking Token", amount: tokenAmount, status: "PAID", date: new Date().toISOString().split("T")[0] },
        { id: 2, name: "Down Payment Agreement", amount: propObj.price * 0.1 - tokenAmount, status: "PENDING", date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split("T")[0] },
        { id: 3, name: "Slab wise payment schedule", amount: propObj.price * 0.9, status: "PENDING", date: new Date(Date.now() + 120*24*60*60*1000).toISOString().split("T")[0] },
      ]
    };

    // 1. Add deal
    saveDealsToStorage([newDeal, ...deals]);

    // 2. Push automatic commission voucher
    const commissionLedger = getStoredData("crm_commissions", initialLedger);
    const newComm = {
      id: `COM-${700 + commissionLedger.length + 1}`,
      dealId: dealId,
      unit: `${propObj.project} ${propObj.unitNumber}`,
      builder: propObj.builder,
      agent: leadObj.agent,
      totalContract: propObj.price,
      agentComm: propObj.price * 0.0125, // 1.25%
      teamComm: propObj.price * 0.00125, // 0.125% override
      builderComm: propObj.price * 0.025, // 2.5% developer pay
      status: "PENDING_APPROVAL",
      approvals: [
        { name: "Sarah Fernandes", role: "Sales Manager", status: "PENDING", date: null },
        { name: "Rohan Deshmukh", role: "Admin", status: "PENDING", date: null }
      ]
    };
    setStoredData("crm_commissions", [newComm, ...commissionLedger]);

    // 3. Mark property as reserved/sold
    const updatedProps = propertiesList.map((p) => p.id === propObj.id ? { ...p, status: "SOLD" } : p);
    setPropertiesList(updatedProps);
    setStoredData("crm_properties", updatedProps);

    // 4. Update lead status
    syncLeadStatus(leadObj.name, "BOOKING");

    showToast(`Deal ${dealId} created and commission voucher generated!`, "success");
    setCreateModal(false);
    setSelectedLeadId("");
    setSelectedPropertyId("");
  };

  const filtered = deals.filter((deal) => {
    const query = searchQuery.toLowerCase();
    return deal.leadName.toLowerCase().includes(query) || 
           deal.propertyUnit.toLowerCase().includes(query) || 
           deal.id.toLowerCase().includes(query);
  });

  const totalPipeline = filtered.reduce((a, d) => a + d.totalValue, 0);
  const closedValue = filtered.filter((d) => d.status === "CLOSURE").reduce((a, d) => a + d.totalValue, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Deals Pipeline</h2>
          <p className="text-xs text-gray-500 mt-1">Flat bookings, agreements, and slab-wise milestone tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs">
            <div className="glass-panel px-4 py-2 rounded-xl border border-[#111520]">
              <span className="text-[9px] text-gray-600 block">PIPELINE VALUE</span>
              <span className="text-white font-bold">{formatPrice(totalPipeline)}</span>
            </div>
            <div className="glass-panel px-4 py-2 rounded-xl border border-[#111520]">
              <span className="text-[9px] text-gray-600 block">CLOSED SALES</span>
              <span className="text-emerald-400 font-bold">{formatPrice(closedValue)}</span>
            </div>
          </div>
          <button onClick={() => setCreateModal(true)}
            className="bg-brand-600 hover:bg-brand-500 text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-500/10">
            <Plus className="w-4 h-4" /> Book Deal
          </button>
        </div>
      </div>

      {/* Filter and search */}
      <div className="glass-panel p-3.5 rounded-xl flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals by lead name, ID, or property unit..."
            className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-1.5 px-3.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/40"
          />
        </div>
        <span className="text-[10px] text-gray-500">{filtered.length} active pipelines</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((deal) => {
            const stageIdx = dealStages.findIndex((s) => s.id === deal.status);
            return (
              <motion.div key={deal.id} onClick={() => setSelectedDeal(deal)}
                className={`glass-panel p-4 rounded-2xl border cursor-pointer hover:border-brand-500/15 transition-all ${selectedDeal?.id === deal.id ? "border-brand-500/25" : "border-[#111520]"}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-mono text-gray-600 font-bold">{deal.id}</span>
                    <h3 className="font-bold text-white text-sm mt-0.5">{deal.leadName}</h3>
                    <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1"><Building className="w-3 h-3 text-gray-700" />{deal.propertyUnit} · {deal.builder}</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] text-gray-600 block">VALUE</span>
                    <span className="text-sm font-extrabold text-white">{formatPrice(deal.totalValue)}</span>
                    <span className="text-[9px] text-brand-400/80 block mt-0.5">Token: ₹ {deal.bookingAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#111520]/40 flex items-center gap-1.5 overflow-x-auto text-[10px] pb-1">
                  {dealStages.map((stage, idx) => (
                    <React.Fragment key={stage.id}>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${idx <= stageIdx ? "bg-brand-500 text-black" : "bg-[#0c0e14] text-gray-600 border border-[#151a26]"}`}>{idx + 1}</span>
                        <span className={`${idx <= stageIdx ? "text-white font-semibold" : "text-gray-600"}`}>{stage.label}</span>
                      </div>
                      {idx < dealStages.length - 1 && <ArrowRight className="w-3 h-3 text-gray-700 shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          {selectedDeal ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-5 rounded-2xl border border-[#111520] space-y-5">
              <div className="pb-3 border-b border-[#111520]">
                <span className="text-[9px] font-mono text-gray-600 font-bold">{selectedDeal.id}</span>
                <h3 className="font-bold text-white text-sm mt-0.5">{selectedDeal.propertyUnit}</h3>
                <p className="text-[10px] text-brand-400/80 mt-0.5">{selectedDeal.project} · {selectedDeal.agent}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Milestones</h4>
                <div className="space-y-2">
                  {selectedDeal.milestones.map((m: any) => (
                    <div key={m.id} className="p-2.5 bg-[#0c0e14] border border-[#151a26] rounded-xl flex items-center justify-between text-[11px]">
                      <div><p className="font-semibold text-white">{m.name}</p><span className="text-[9px] text-gray-600">Due: {m.date}</span></div>
                      <div className="text-right">
                        <span className="text-white font-bold block">₹ {(m.amount / 100000).toFixed(1)} L</span>
                        <span className={`inline-flex items-center gap-0.5 text-[8px] font-semibold mt-0.5 ${m.status === "PAID" ? "text-emerald-400" : "text-amber-400"}`}>
                          {m.status === "PAID" ? <CheckCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}{m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-[#111520]">
                <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Commission Breakdown</h4>
                <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#151a26] text-xs space-y-1">
                  <div className="flex justify-between"><span className="text-gray-500">Agent Commission (1.25%)</span><span className="text-white font-bold">₹ {(selectedDeal.totalValue * 0.0125 / 100000).toFixed(1)} L</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Developer Payout (2.5%)</span><span className="text-brand-400 font-bold">₹ {(selectedDeal.totalValue * 0.025 / 100000).toFixed(1)} L</span></div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => revertStage(selectedDeal.id)} className="flex-1 bg-[#0c0e14] hover:bg-[#151a26] text-gray-400 py-2 rounded-xl text-[10px] font-semibold border border-[#151a26] flex items-center justify-center gap-1"><ArrowLeft className="w-3 h-3" />Back</button>
                <button onClick={() => advanceStage(selectedDeal.id)} className="flex-1 bg-brand-600 hover:bg-brand-500 text-black py-2 rounded-xl text-[10px] font-semibold flex items-center justify-center gap-1">Advance<ArrowRight className="w-3 h-3" /></button>
              </div>
            </motion.div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-[#111520] text-center text-gray-600 py-16 text-xs">
              <TrendingUp className="w-7 h-7 text-gray-700 mx-auto mb-3" />
              Select a deal pipeline to trace payment milestones and broker commissions.
            </div>
          )}
        </div>
      </div>

      {/* Book Deal Modal */}
      <AnimatePresence>
        {createModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setCreateModal(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-20 max-w-md mx-auto bg-[#0a0b0f] border border-[#151a26] z-50 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#111520] pb-3 mb-4">
                <h3 className="font-bold text-sm text-white">Create Direct Booking Deal</h3>
                <button onClick={() => setCreateModal(false)} className="text-gray-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleCreateDeal} className="space-y-4">
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Select Client Lead *</label>
                  <select required value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                    <option value="">Choose a prospect...</option>
                    {leadsList.filter(l => l.status !== "BOOKED").map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.prefLocation})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Select Property Unit *</label>
                  <select required value={selectedPropertyId} onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                    <option value="">Choose a flat...</option>
                    {propertiesList.filter(p => p.status === "AVAILABLE").map(p => (
                      <option key={p.id} value={p.id}>{p.project} · {p.unitNumber} (₹ {(p.price / 100000).toFixed(0)}L)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Token Booking Amount (₹) *</label>
                  <input type="number" required value={bookingToken} onChange={(e) => setBookingToken(e.target.value)}
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none" />
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-[#111520]">
                  <button type="button" onClick={() => setCreateModal(false)} className="border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold">Book Deal</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DealsTracker() {
  return (
    <Suspense fallback={<div className="text-center text-xs py-16 text-gray-600">Loading Deals...</div>}>
      <DealsTrackerContent />
    </Suspense>
  );
}
