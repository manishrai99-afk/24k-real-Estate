"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, MapPin, User, CheckCircle, Plus, Compass, AlertCircle, X, Clock, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../layout";
import {
  getStoredData,
  setStoredData,
  initialVisits,
  initialProperties,
  activeAgents,
} from "../../../lib/mock-data";

const statusStyles: Record<string, { bg: string; text: string }> = {
  SCHEDULED: { bg: "bg-amber-950/20 border-amber-500/20", text: "text-amber-400" },
  CONFIRMED: { bg: "bg-blue-950/20 border-blue-500/20", text: "text-blue-400" },
  COMPLETED: { bg: "bg-emerald-950/20 border-emerald-500/20", text: "text-emerald-400" },
  CANCELLED: { bg: "bg-gray-950/20 border-gray-500/20", text: "text-gray-500" },
};

function SiteVisitsContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  // Storage states
  const [visits, setVisits] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);

  // Page States
  const [newVisitModal, setNewVisitModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Form State
  const [leadName, setLeadName] = useState(""); 
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState(""); 
  const [scheduledAt, setScheduledAt] = useState(""); 
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Load lists from storage
    const loadedVisits = getStoredData("crm_visits", initialVisits);
    setVisits(loadedVisits);

    const loadedProperties = getStoredData("crm_properties", initialProperties);
    setProperties(loadedProperties);

    setAgents(activeAgents);

    // Process query prefill parameters
    const prefillLead = searchParams.get("prefill");
    const prefillAgent = searchParams.get("agent");
    const prefillUnit = searchParams.get("unit");

    if (prefillLead) {
      setLeadName(prefillLead);
      if (prefillAgent) setSelectedAgent(prefillAgent);
      
      // Auto match property unit if passed
      if (prefillUnit) {
        const match = loadedProperties.find((p: any) => `${p.project} ${p.unitNumber}`.toLowerCase().includes(prefillUnit.toLowerCase()));
        if (match) setSelectedPropertyId(match.id);
      }
      setNewVisitModal(true);
    }
  }, [searchParams]);

  const saveVisitsToStorage = (updated: any[]) => {
    setVisits(updated);
    setStoredData("crm_visits", updated);
  };

  // Helper to dynamically resolve locations from property metadata
  const resolveLocationFromProperty = (propertyId: string) => {
    const flat = properties.find(p => p.id === propertyId);
    if (!flat) return "Hinjewadi";
    return flat.location;
  };

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !selectedAgent || !selectedPropertyId || !scheduledAt) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const flat = properties.find((p) => p.id === selectedPropertyId);
    const unitText = flat ? `${flat.project} ${flat.unitNumber}` : "Direct Booking";
    const resolvedLoc = resolveLocationFromProperty(selectedPropertyId);

    const newVisit = {
      id: `SV-${400 + visits.length + 1}`,
      leadName,
      agentName: selectedAgent,
      propertyUnit: unitText,
      location: resolvedLoc,
      scheduledAt,
      status: "SCHEDULED",
      gpsCheckIn: null,
      notes,
      outcome: "",
    };

    saveVisitsToStorage([newVisit, ...visits]);
    showToast(`Visit scheduled successfully for ${leadName}`, "success");
    setNewVisitModal(false);

    // Reset Form
    setLeadName(""); setSelectedAgent(""); setSelectedPropertyId(""); setScheduledAt(""); setNotes("");
  };

  const checkInAgent = (id: string) => {
    const updated = visits.map((v) =>
      v.id === id
        ? {
            ...v,
            gpsCheckIn: {
              lat: 18.5912 + (Math.random() - 0.5) * 0.001,
              lng: 73.7402 + (Math.random() - 0.5) * 0.001,
              checkInTime: new Date().toISOString().replace("T", " ").slice(0, 16),
              distanceMeters: Math.floor(Math.random() * 15) + 2,
            },
            status: "CONFIRMED",
          }
        : v
    );
    saveVisitsToStorage(updated);
    showToast("GPS verification matches property boundary (Agent checked in)", "success");
  };

  const markCompleted = (id: string) => {
    const updated = visits.map((v) =>
      v.id === id ? { ...v, status: "COMPLETED", outcome: "Completed successfully. Lead ready for booking." } : v
    );
    saveVisitsToStorage(updated);
    showToast("Site visit outcome logged as COMPLETED", "success");
  };

  const cancelVisit = (id: string) => {
    const updated = visits.map((v) =>
      v.id === id ? { ...v, status: "CANCELLED", outcome: "Cancelled — rescheduling required" } : v
    );
    saveVisitsToStorage(updated);
    showToast("Showing cancelled", "warning");
  };

  const filtered = visits.filter((v) => {
    const matchesFilter = statusFilter === "ALL" || v.status === statusFilter;
    const matchesSearch = v.leadName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.propertyUnit.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Visits & Showings</h2>
          <p className="text-xs text-gray-500 mt-1">Schedule property tours, verify GPS check-in, and track outcomes.</p>
        </div>
        <button onClick={() => setNewVisitModal(true)} className="bg-brand-600 hover:bg-brand-500 text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-500/10">
          <Plus className="w-4 h-4" /> Schedule Visit
        </button>
      </div>

      {/* Filter and Search Row */}
      <div className="glass-panel p-3.5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {["ALL", "SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-[10px] px-3.5 py-1.5 rounded-lg border font-semibold transition-all shrink-0 ${statusFilter === s ? "bg-brand-500 text-black border-brand-500" : "bg-[#0c0e14] text-gray-500 border-[#151a26] hover:text-white"}`}>
              {s === "ALL" ? "All Showings" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by prospect name or flat..."
            className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-1.5 px-3.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/40"
          />
        </div>
      </div>

      {/* Visits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((visit) => {
          const st = statusStyles[visit.status] || statusStyles.SCHEDULED;
          return (
            <motion.div key={visit.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-4 rounded-2xl border border-[#111520] space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono text-gray-600 font-bold">{visit.id}</span>
                    <h3 className="font-bold text-white text-sm mt-0.5">{visit.leadName}</h3>
                    <div className="text-[10px] text-brand-400/80 mt-0.5">{visit.propertyUnit}</div>
                  </div>
                  <span className={`status-badge border px-2 py-0.5 ${st.bg} ${st.text}`}>{visit.status}</span>
                </div>

                <div className="space-y-1.5 text-[11px] border-y border-[#111520]/40 py-2.5 mt-2 text-gray-500">
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-gray-700" />{visit.scheduledAt.replace("T", " at ")}</div>
                  <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-gray-700" />Agent: {visit.agentName}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-700" />{visit.location}</div>
                  {visit.notes && <p className="text-gray-600 italic text-[10px] mt-1">"{visit.notes}"</p>}
                  {visit.outcome && <p className="text-[10px] text-emerald-400/80 font-medium">Outcome: {visit.outcome}</p>}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs gap-2 mt-2">
                {visit.gpsCheckIn ? (
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/15 border border-emerald-500/15 p-2 rounded-xl w-full">
                    <Compass className="w-3.5 h-3.5" />
                    <div><span className="font-bold block text-[10px]">GPS Verified</span><span className="text-[8px] text-gray-600">Within {visit.gpsCheckIn.distanceMeters}m · {visit.gpsCheckIn.checkInTime}</span></div>
                  </div>
                ) : visit.status === "CANCELLED" ? (
                  <div className="flex items-center gap-2 text-gray-500 bg-gray-950/15 border border-gray-500/15 p-2 rounded-xl w-full">
                    <XCircle className="w-3.5 h-3.5" /><span className="text-[10px]">Visit cancelled</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full gap-2 pt-1">
                    <span className="text-[9px] text-gray-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 animate-pulse" />Check-in Pending</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => checkInAgent(visit.id)} className="bg-brand-950/30 hover:bg-brand-900 border border-brand-500/20 text-brand-400 px-3 py-1 rounded-lg text-[10px] font-semibold">GPS Check-In</button>
                      <button onClick={() => markCompleted(visit.id)} className="bg-emerald-950/30 hover:bg-emerald-900 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-semibold">Complete</button>
                      <button onClick={() => cancelVisit(visit.id)} className="bg-gray-950/30 hover:bg-gray-800 border border-gray-500/20 text-gray-400 px-3 py-1 rounded-lg text-[10px] font-semibold">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-600 py-16 text-xs">
          <Calendar className="w-8 h-8 mx-auto mb-3 text-gray-700" />
          No site visits found matching your filter criteria.
        </div>
      )}

      {/* Schedule Modal */}
      <AnimatePresence>
        {newVisitModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setNewVisitModal(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-20 max-w-md mx-auto bg-[#0a0b0f] border border-[#151a26] z-50 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#111520] pb-3 mb-4">
                <h3 className="font-bold text-sm text-white">Schedule Showing</h3>
                <button onClick={() => setNewVisitModal(false)} className="text-gray-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleCreateVisit} className="space-y-3">
                <div><label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Prospect Name *</label>
                  <input type="text" required value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="e.g. Ramesh Nair"
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" /></div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Assigned Agent *</label>
                    <select required value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                      <option value="">Select Agent...</option>
                      {agents.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Target Inventory flat *</label>
                    <select required value={selectedPropertyId} onChange={(e) => setSelectedPropertyId(e.target.value)}
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                      <option value="">Select unit...</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.project} · {p.unitNumber} ({p.location})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div><label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Date & Time *</label>
                  <input type="datetime-local" required value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" /></div>
                <div><label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="balcony view comparison, etc..." rows={2}
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" /></div>
                <div className="flex justify-end gap-3 pt-3 border-t border-[#111520]">
                  <button type="button" onClick={() => setNewVisitModal(false)} className="border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold">Schedule Showing</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SiteVisits() {
  return (
    <Suspense fallback={<div className="text-center text-xs py-16 text-gray-600">Loading Site Visits...</div>}>
      <SiteVisitsContent />
    </Suspense>
  );
}
