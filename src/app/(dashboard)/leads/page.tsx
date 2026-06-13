"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  Search,
  SlidersHorizontal,
  KanbanSquare,
  List,
  Plus,
  Phone,
  Mail,
  MapPin,
  UserCheck,
  X,
  Trash2,
  AlertTriangle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../layout";
import {
  getStoredData,
  setStoredData,
  initialLeads,
  activeAgents,
  initialDeals,
  initialProperties,
} from "../../../lib/mock-data";

const pipelineStages = [
  { id: "NEW", title: "New", color: "border-t-blue-500 bg-blue-500/5 text-blue-400" },
  { id: "CONTACTED", title: "Contacted", color: "border-t-indigo-500 bg-indigo-500/5 text-indigo-400" },
  { id: "FOLLOW_UP", title: "Follow Up", color: "border-t-purple-500 bg-purple-500/5 text-purple-400" },
  { id: "SITE_VISIT", title: "Site Visit", color: "border-t-amber-500 bg-amber-500/5 text-amber-400" },
  { id: "NEGOTIATION", title: "Negotiation", color: "border-t-orange-500 bg-orange-500/5 text-orange-400" },
  { id: "BOOKED", title: "Booked", color: "border-t-emerald-500 bg-emerald-500/5 text-emerald-400" },
  { id: "LOST", title: "Lost", color: "border-t-gray-500 bg-gray-500/5 text-gray-500" },
];

const formatBudget = (value: number) => {
  if (!value) return "TBD";
  if (value >= 10000000) return `₹ ${(value / 10000000).toFixed(2)} Cr`;
  return `₹ ${(value / 100000).toFixed(0)} Lakhs`;
};

const statusBadgeColor = (status: string) => {
  const map: Record<string, string> = {
    NEW: "bg-blue-950/20 text-blue-400 border-blue-500/20",
    CONTACTED: "bg-indigo-950/20 text-indigo-400 border-indigo-500/20",
    FOLLOW_UP: "bg-purple-950/20 text-purple-400 border-purple-500/20",
    SITE_VISIT: "bg-amber-950/20 text-amber-400 border-amber-500/20",
    NEGOTIATION: "bg-orange-950/20 text-orange-400 border-orange-500/20",
    BOOKED: "bg-emerald-950/20 text-emerald-400 border-emerald-500/20",
    LOST: "bg-gray-950/20 text-gray-500 border-gray-500/20",
  };
  return map[status] || "bg-[#14161a] text-gray-400 border-gray-700";
};

function LeadsCRMContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load state from local storage or mock-data
  const [leads, setLeads] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [newLeadModal, setNewLeadModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [remarkText, setRemarkText] = useState("");

  // Create Deal Booking Form State
  const [bookingModal, setBookingModal] = useState<any | null>(null);
  const [bookingAmount, setBookingAmount] = useState("200000");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [unitsList, setUnitsList] = useState<any[]>([]);

  // New Lead Form State
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadBudget, setNewLeadBudget] = useState("");
  const [newLeadSource, setNewLeadSource] = useState("GOOGLE_ADS");
  const [newLeadLocation, setNewLeadLocation] = useState("");
  const [newLeadAgent, setNewLeadAgent] = useState("");
  const [newLeadProject, setNewLeadProject] = useState("Direct Inquiry");

  useEffect(() => {
    const data = getStoredData("crm_leads", initialLeads);
    setLeads(data);

    const inventory = getStoredData("crm_properties", initialProperties);
    setUnitsList(inventory.filter((p: any) => p.status === "AVAILABLE"));

    // Check search params for pre-selected lead
    const querySearch = searchParams.get("search");
    if (querySearch) {
      const match = data.find((l: any) => l.id === querySearch || l.name.toLowerCase().includes(querySearch.toLowerCase()));
      if (match) {
        setSelectedLead(match);
      }
    }
  }, [searchParams]);

  const saveLeadsToStorage = (updatedLeads: any[]) => {
    setLeads(updatedLeads);
    setStoredData("crm_leads", updatedLeads);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    const assignedAgent = newLeadAgent || activeAgents[Math.floor(Math.random() * activeAgents.length)].name;
    const budgetVal = parseFloat(newLeadBudget) || 7500000;

    const newLead = {
      id: `LD-${100 + leads.length + 1}`,
      name: newLeadName,
      phone: newLeadPhone,
      email: newLeadEmail || "",
      source: newLeadSource,
      status: "NEW",
      budget: budgetVal,
      project: newLeadProject,
      agent: assignedAgent,
      prefLocation: newLeadLocation || "Hinjewadi",
      createdAt: new Date().toISOString().split("T")[0],
      notes: [
        { staff: "System", text: `Lead generated and assigned to ${assignedAgent}. Budget: ${formatBudget(budgetVal)}.`, date: new Date().toLocaleString("en-IN") }
      ]
    };

    saveLeadsToStorage([newLead, ...leads]);
    showToast(`Lead "${newLeadName}" created successfully`, "success");
    setNewLeadModal(false);
    
    // Clear form
    setNewLeadName(""); setNewLeadPhone(""); setNewLeadEmail(""); setNewLeadBudget("");
    setNewLeadLocation(""); setNewLeadAgent(""); setNewLeadProject("Direct Inquiry");
  };

  const updateLeadStatus = (leadId: string, nextStatus: string) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l));
    saveLeadsToStorage(updated);
    if (selectedLead?.id === leadId) {
      const current = updated.find(l => l.id === leadId);
      setSelectedLead(current);
    }
    showToast(`Lead moved to ${nextStatus.replace("_", " ")}`, "info");
  };

  const handleDelete = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    const updated = leads.filter((l) => l.id !== id);
    saveLeadsToStorage(updated);
    showToast(`Lead "${lead?.name}" removed`, "warning");
    setDeleteConfirm(null);
    setSelectedLead(null);
  };

  const addRemark = (leadId: string) => {
    if (!remarkText.trim()) return;

    const updated = leads.map((l) => {
      if (l.id === leadId) {
        const currentNotes = l.notes || [];
        const newNote = {
          staff: "You (Super Admin)",
          text: remarkText,
          date: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
        };
        return { ...l, notes: [...currentNotes, newNote] };
      }
      return l;
    });

    saveLeadsToStorage(updated);
    setRemarkText("");
    showToast("Remark added", "success");
    
    // Refresh currently selected lead preview
    const cur = updated.find((l) => l.id === leadId);
    if (cur) setSelectedLead(cur);
  };

  // Pre-fill site visit and redirect
  const handleScheduleVisit = (lead: any) => {
    setSelectedLead(null);
    router.push(`/site-visits?prefill=${encodeURIComponent(lead.name)}&agent=${encodeURIComponent(lead.agent)}&location=${encodeURIComponent(lead.prefLocation)}`);
  };

  // Handle Booking Deal transaction
  const handleBookDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit || !bookingModal) return;

    const inventory = getStoredData("crm_properties", initialProperties);
    const flat = inventory.find((p: any) => p.id === selectedUnit);
    if (!flat) return;

    // 1. Create a deal in Deals Pipeline
    const deals = getStoredData("crm_deals", initialDeals);
    const newDeal = {
      id: `DL-00${deals.length + 21}`,
      leadName: bookingModal.name,
      propertyUnit: `${flat.project} ${flat.unitNumber}`,
      project: flat.project,
      builder: flat.builder,
      agent: bookingModal.agent,
      bookingAmount: parseFloat(bookingAmount) || 200000,
      totalValue: flat.price,
      status: "BOOKING",
      milestones: [
        { id: 1, name: "Booking Token", amount: parseFloat(bookingAmount), status: "PAID", date: new Date().toISOString().split("T")[0] },
        { id: 2, name: "Slab Wise Downpayment", amount: flat.price * 0.1, status: "PENDING", date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split("T")[0] },
        { id: 3, name: "Possession Handover", amount: flat.price * 0.9 - parseFloat(bookingAmount), status: "PENDING", date: new Date(Date.now() + 180*24*60*60*1000).toISOString().split("T")[0] },
      ]
    };

    setStoredData("crm_deals", [newDeal, ...deals]);

    // 2. Mark flat as Sold/Booked in Property Inventory
    const updatedProperties = inventory.map((p: any) => p.id === flat.id ? { ...p, status: "SOLD" } : p);
    setStoredData("crm_properties", updatedProperties);

    // 3. Mark Lead as Booked
    updateLeadStatus(bookingModal.id, "BOOKED");

    showToast(`Deal locked for flat ${flat.unitNumber}! Booking ledger updated.`, "success");
    setBookingModal(null);
    setSelectedLead(null);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.phone.includes(searchQuery) || lead.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Leads Manager</h2>
          <p className="text-xs text-gray-500 mt-1">Track inquiries from Hinjewadi, Wakad, and Maan Gaon IT corridor.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#0c0e14] border border-[#151a26] rounded-xl p-0.5 flex">
            <button onClick={() => setViewMode("kanban")} className={`p-1.5 rounded-lg transition-all ${viewMode === "kanban" ? "bg-brand-500 text-black" : "text-gray-500 hover:text-white"}`}>
              <KanbanSquare className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-brand-500 text-black" : "text-gray-500 hover:text-white"}`}>
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
          <button onClick={() => setNewLeadModal(true)} className="bg-brand-600 hover:bg-brand-500 text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-500/10">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-3 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, ID, or phone..."
            className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 pl-9 pr-4 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/40" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0c0e14] border border-[#151a26] rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none">
          <option value="ALL">All Stages</option>
          {pipelineStages.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <div className="flex items-center gap-2 text-[10px] text-gray-600 justify-end">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{filteredLeads.length} leads</span>
        </div>
      </div>

      {/* Views */}
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-panel rounded-2xl overflow-x-auto border border-[#111520]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#111520] bg-[#08090c] text-[10px] font-semibold text-gray-600 uppercase">
                  <th className="p-3">ID</th><th className="p-3">Contact</th><th className="p-3">Source</th>
                  <th className="p-3">Budget</th><th className="p-3">Project</th><th className="p-3">Status</th>
                  <th className="p-3">Agent</th><th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs text-gray-400 divide-y divide-[#111520]/40">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="hover:bg-[#0c0e14]/50 cursor-pointer transition-colors">
                    <td className="p-3 font-mono font-bold text-gray-600 text-[10px]">{lead.id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-white text-[11px]">{lead.name}</div>
                      <div className="text-[9px] text-gray-600 mt-0.5 flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{lead.phone}</div>
                    </td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#0f1117] border border-[#151a26] text-[9px] font-semibold text-gray-500">{lead.source.replace(/_/g, " ")}</span></td>
                    <td className="p-3 font-bold text-white text-[11px]">{formatBudget(lead.budget)}</td>
                    <td className="p-3">
                      <div className="text-[11px]">{lead.project}</div>
                      <div className="text-[9px] text-gray-600 mt-0.5 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{lead.prefLocation}</div>
                    </td>
                    <td className="p-3"><span className={`status-badge border px-2 py-0.5 ${statusBadgeColor(lead.status)}`}>{lead.status.replace("_", " ")}</span></td>
                    <td className="p-3"><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-400" /><span className="text-[11px]">{lead.agent}</span></div></td>
                    <td className="p-3">
                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(lead.id); }} className="text-gray-700 hover:text-rose-400 p-1 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex gap-3 overflow-x-auto pb-4">
            {pipelineStages.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
              return (
                <div key={stage.id} className="bg-[#08090c] border border-[#111520] rounded-2xl p-3 flex flex-col min-h-[450px] shrink-0 w-56">
                  <div className={`border-t-2 ${stage.color} p-2 rounded pb-2 mb-2 flex items-center justify-between`}>
                    <h3 className="font-bold text-[10px] uppercase tracking-wider text-gray-400">{stage.title}</h3>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#0f1117] text-gray-500 font-bold text-[9px]">{stageLeads.length}</span>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px] pr-1">
                    {stageLeads.map((lead) => (
                      <motion.div key={lead.id} layoutId={lead.id} onClick={() => setSelectedLead(lead)}
                        className="bg-[#0a0c10] p-3 rounded-xl border border-[#111520] hover:border-brand-500/15 cursor-pointer transition-all active:scale-[0.97]">
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[9px] font-mono text-gray-600 font-bold">{lead.id}</span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-[#0f1117] border border-[#151a26] text-gray-500 rounded">{lead.source.replace(/_/g, " ").substring(0, 10)}</span>
                        </div>
                        <h4 className="font-semibold text-white text-[11px] mt-1.5 truncate">{lead.name}</h4>
                        <div className="text-[10px] text-brand-400/80 mt-1 font-bold">{formatBudget(lead.budget)}</div>
                        <div className="text-[9px] text-gray-600 mt-0.5 truncate">{lead.project}</div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#111520]/60 text-[8px] text-gray-600">
                          <span className="flex items-center gap-0.5"><UserCheck className="w-2.5 h-2.5 text-brand-400/60" />{lead.agent.split(" ")[0]}</span>
                          <span>{lead.createdAt.slice(5)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Detail Slide-Over */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)} className="fixed inset-0 z-40 bg-black/60" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              className="fixed top-0 bottom-0 right-0 w-full sm:w-[440px] bg-[#0a0b0f] border-l border-[#151a26] z-50 p-5 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#111520] pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-600">{selectedLead.id}</span>
                  <h3 className="font-bold text-base text-white mt-0.5">{selectedLead.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setDeleteConfirm(selectedLead.id); }} className="text-gray-600 hover:text-rose-400 p-1"><Trash2 className="w-4 h-4" /></button>
                  <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-white p-1"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                {/* Status buttons */}
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest font-semibold block mb-1.5">Pipeline Stage</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {pipelineStages.map((st) => (
                      <button key={st.id} onClick={() => updateLeadStatus(selectedLead.id, st.id)}
                        className={`text-[9px] py-1.5 rounded-lg border font-semibold transition-all ${
                          selectedLead.status === st.id ? "bg-brand-500 text-black border-brand-500 shadow" : "bg-[#0c0e14] text-gray-500 border-[#151a26] hover:text-white"
                        }`}>{st.title}</button>
                    ))}
                  </div>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#151a26]">
                    <span className="text-[9px] text-gray-600 block">BUDGET</span>
                    <span className="text-sm font-extrabold text-white mt-0.5">{formatBudget(selectedLead.budget)}</span>
                  </div>
                  <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#151a26]">
                    <span className="text-[9px] text-gray-600 block">SOURCE</span>
                    <span className="text-xs font-bold text-brand-400 mt-0.5">{selectedLead.source.replace(/_/g, " ")}</span>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-2 text-xs">
                  <h4 className="text-[10px] font-semibold text-gray-400 border-b border-[#111520] pb-1.5">Contact Details</h4>
                  {[
                    { label: "Phone", value: selectedLead.phone, icon: Phone },
                    { label: "Email", value: selectedLead.email, icon: Mail },
                    { label: "Assigned Agent", value: selectedLead.agent, icon: UserCheck },
                    { label: "Preferred Location", value: selectedLead.prefLocation, icon: MapPin },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-1 border-b border-[#111520]/30">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-white font-medium flex items-center gap-1"><item.icon className="w-3 h-3 text-gray-600" />{item.value || "—"}</span>
                    </div>
                  ))}
                </div>

                {/* Remarks & Notes Timeline */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-semibold text-gray-400 border-b border-[#111520] pb-1.5">Remarks / Interaction History</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {/* Render notes array dynamically if present */}
                    {selectedLead.notes && selectedLead.notes.length > 0 ? (
                      selectedLead.notes.map((note: any, i: number) => (
                        <div key={i} className="bg-[#0c0e14] p-2.5 rounded-xl border border-[#151a26] text-[11px]">
                          <div className="flex justify-between text-[9px] text-gray-600">
                            <span className="font-bold text-gray-500">{note.staff}</span>
                            <span>{note.date}</span>
                          </div>
                          <p className="text-gray-400 mt-1">{note.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-[10px] text-gray-600 italic">No notes captured for this lead. Add a remark below.</div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <input type="text" value={remarkText} onChange={(e) => setRemarkText(e.target.value)}
                      placeholder="Add conversation summary..." onKeyDown={(e) => e.key === "Enter" && addRemark(selectedLead.id)}
                      className="flex-1 bg-[#0c0e14] border border-[#151a26] rounded-xl px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/40" />
                    <button onClick={() => addRemark(selectedLead.id)} className="bg-brand-600 hover:bg-brand-500 text-black px-4 py-2 rounded-xl text-xs font-semibold">Add Note</button>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-[#111520] pt-3 mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => handleScheduleVisit(selectedLead)}
                  className="bg-transparent border border-[#151a26] text-gray-400 hover:text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Schedule Visit
                </button>
                <button onClick={() => setBookingModal(selectedLead)}
                  className="bg-brand-600 hover:bg-brand-500 text-black py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Book Flat Deal
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0b0f] border border-[#151a26] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-rose-400" /></div>
                <div><h3 className="font-bold text-white text-sm">Delete Lead?</h3><p className="text-[10px] text-gray-600 mt-0.5">This cannot be undone.</p></div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded-xl text-xs font-semibold">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Lead Modal */}
      <AnimatePresence>
        {newLeadModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setNewLeadModal(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-16 max-w-lg mx-auto bg-[#0a0b0f] border border-[#151a26] z-50 p-6 rounded-2xl shadow-2xl animate-in">
              <div className="flex items-center justify-between border-b border-[#111520] pb-3 mb-4">
                <h3 className="font-bold text-sm text-white">Create New Lead</h3>
                <button onClick={() => setNewLeadModal(false)} className="text-gray-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleCreateLead} className="space-y-3">
                <div><label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Name *</label>
                  <input type="text" required value={newLeadName} onChange={(e) => setNewLeadName(e.target.value)} placeholder="e.g. Ramesh Nair"
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" /></div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Phone *</label>
                    <input type="text" required value={newLeadPhone} onChange={(e) => setNewLeadPhone(e.target.value)} placeholder="+91 98220..."
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" /></div>
                  <div><label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Email</label>
                    <input type="email" value={newLeadEmail} onChange={(e) => setNewLeadEmail(e.target.value)} placeholder="email@company.com"
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" /></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Budget (₹) *</label>
                    <input type="number" required value={newLeadBudget} onChange={(e) => setNewLeadBudget(e.target.value)} placeholder="e.g. 7500000"
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" /></div>
                  <div><label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Source</label>
                    <select value={newLeadSource} onChange={(e) => setNewLeadSource(e.target.value)}
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                      <option value="GOOGLE_ADS">Google Ads</option><option value="FACEBOOK_ADS">Facebook Ads</option><option value="INSTAGRAM">Instagram</option>
                      <option value="PROPERTY_FINDER">Housing.com</option><option value="BAYUT">99acres</option><option value="ORGANIC_SEO">Organic SEO</option><option value="REFERRALS">Referrals</option>
                    </select></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Assigned Agent</label>
                    <select value={newLeadAgent} onChange={(e) => setNewLeadAgent(e.target.value)}
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                      <option value="">Select Agent...</option>
                      {activeAgents.map(a => <option key={a.name} value={a.name}>{a.name} ({a.role.replace(/_/g, " ")})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Target Project</label>
                    <input type="text" value={newLeadProject} onChange={(e) => setNewLeadProject(e.target.value)} placeholder="e.g. Godrej 24"
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" />
                  </div>
                </div>

                <div><label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Location Preference</label>
                  <input type="text" value={newLeadLocation} onChange={(e) => setNewLeadLocation(e.target.value)} placeholder="e.g. Hinjewadi Phase 1, Wakad"
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" /></div>
                
                <div className="flex justify-end gap-3 pt-3 border-t border-[#111520]">
                  <button type="button" onClick={() => setNewLeadModal(false)} className="border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold">Create Lead</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Book Flat Deal Modal */}
      <AnimatePresence>
        {bookingModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setBookingModal(null)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-20 max-w-md mx-auto bg-[#0a0b0f] border border-[#151a26] z-50 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#111520] pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Create Flat Booking Deal</h3>
                  <p className="text-[9px] text-gray-600">Client: {bookingModal.name} · Agent: {bookingModal.agent}</p>
                </div>
                <button onClick={() => setBookingModal(null)} className="text-gray-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleBookDealSubmit} className="space-y-4">
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Select Available Property Unit *</label>
                  <select required value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                    <option value="">Choose a flat...</option>
                    {unitsList.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.project} · {unit.unitNumber} ({unit.beds} BHK - ₹ {(unit.price / 100000).toFixed(0)}L)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Token Booking Amount (₹) *</label>
                  <input type="number" required value={bookingAmount} onChange={(e) => setBookingAmount(e.target.value)}
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none" />
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-[#111520]">
                  <button type="button" onClick={() => setBookingModal(null)} className="border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold">Confirm Deal</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LeadsCRM() {
  return (
    <Suspense fallback={<div className="text-center text-xs py-16 text-gray-600">Loading Leads...</div>}>
      <LeadsCRMContent />
    </Suspense>
  );
}
