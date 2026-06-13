"use client";

import React, { useState } from "react";
import { FileText, Calendar, Download, TrendingUp, Users, Building, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../layout";

const reportsList = [
  { id: "REP-01", name: "Quarterly Revenue Summary", description: "Aggregates developer payouts and broker overrides across Pune West corridor projects.", type: "Financial", date: "Q2 2026", icon: DollarSign, color: "text-brand-400 bg-brand-950/20 border-brand-500/15" },
  { id: "REP-02", name: "Agent Sales Performance Board", description: "Compares deal closures, commission levels, and site visit statistics across all agents.", type: "Performance", date: "Monthly", icon: Users, color: "text-blue-400 bg-blue-950/20 border-blue-500/15" },
  { id: "REP-03", name: "Lead Channel CPL & ROI Report", description: "Analyzes Google, Facebook, Housing.com, and 99acres acquisition efficiency.", type: "Marketing", date: "Monthly", icon: TrendingUp, color: "text-emerald-400 bg-emerald-950/20 border-emerald-500/15" },
  { id: "REP-04", name: "Inventory Booking Rates Report", description: "Tracks sold-out metrics across Hinjewadi, Wakad, and Maan Gaon projects.", type: "Inventory", date: "Weekly", icon: Building, color: "text-purple-400 bg-purple-950/20 border-purple-500/15" },
  { id: "REP-05", name: "Agent Attendance & Activity Log", description: "GPS check-in records, daily active hours, and client interaction frequency.", type: "HR", date: "Weekly", icon: Users, color: "text-amber-400 bg-amber-950/20 border-amber-500/15" },
  { id: "REP-06", name: "Site Visit Success Rate Analysis", description: "Visit-to-booking conversion ratio per project, agent, and lead source.", type: "Performance", date: "Monthly", icon: TrendingUp, color: "text-rose-400 bg-rose-950/20 border-rose-500/15" },
];

// Mock data table for preview
const previewData = [
  { metric: "Total Closed Deals", value: "14", change: "+40%" },
  { metric: "Pipeline Value", value: "₹ 12.4 Cr", change: "+18%" },
  { metric: "Avg. Deal Closure Time", value: "28 days", change: "-5 days" },
  { metric: "Site Visit Conversion", value: "34%", change: "+6%" },
  { metric: "Top Performing Agent", value: "Priya Sharma", change: "8 deals" },
];

export default function ReportsEngine() {
  const { showToast } = useToast();
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [dateRange, setDateRange] = useState({ from: "2026-06-01", to: "2026-06-13" });

  const handleExport = (reportName: string, format: string) => {
    showToast(`Generating "${reportName}" as ${format}. Download starting...`, "info");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Reports Engine</h2>
        <p className="text-xs text-gray-500 mt-1">Export performance analytics, finance worksheets, and lead audits.</p>
      </div>

      {/* Date Range Picker */}
      <div className="glass-panel p-3 rounded-xl flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-gray-500 text-[10px]">Date Range:</span>
          <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="bg-[#0c0e14] border border-[#151a26] rounded-lg py-1.5 px-2 text-[11px] text-gray-300 focus:outline-none" />
          <span className="text-gray-600">→</span>
          <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="bg-[#0c0e14] border border-[#151a26] rounded-lg py-1.5 px-2 text-[11px] text-gray-300 focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Report Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportsList.map((rep) => {
            const Icon = rep.icon;
            return (
              <motion.div key={rep.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedReport(rep)}
                className={`glass-panel p-4 rounded-2xl border cursor-pointer hover:border-brand-500/15 transition-all ${selectedReport?.id === rep.id ? "border-brand-500/25" : "border-[#111520]"}`}>
                <div className="flex justify-between items-start">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${rep.color}`}><Icon className="w-4 h-4" /></div>
                  <span className="text-[9px] text-brand-400 font-bold uppercase tracking-wider bg-brand-950/15 px-2 py-0.5 rounded border border-brand-500/10">{rep.type}</span>
                </div>
                <h3 className="font-bold text-white text-[13px] mt-3">{rep.name}</h3>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{rep.description}</p>
                <div className="border-t border-[#111520] pt-3 mt-3 flex justify-between items-center text-xs">
                  <span className="text-gray-600 text-[10px] flex items-center gap-1"><Calendar className="w-3 h-3" />{rep.date}</span>
                  <div className="flex gap-1.5">
                    <button onClick={(e) => { e.stopPropagation(); handleExport(rep.name, "CSV"); }}
                      className="bg-[#0c0e14] hover:bg-[#151a26] border border-[#151a26] text-gray-400 px-2.5 py-1 rounded-lg text-[10px]">CSV</button>
                    <button onClick={(e) => { e.stopPropagation(); handleExport(rep.name, "PDF"); }}
                      className="bg-brand-600 hover:bg-brand-500 text-black font-semibold px-2.5 py-1 rounded-lg text-[10px]">PDF</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-5 rounded-2xl border border-[#111520] space-y-4 sticky top-24">
              <div className="pb-3 border-b border-[#111520]">
                <h3 className="font-bold text-white text-sm">{selectedReport.name}</h3>
                <p className="text-[10px] text-gray-600 mt-1">Preview data for {dateRange.from} — {dateRange.to}</p>
              </div>
              <div className="space-y-2">
                {previewData.map((row) => (
                  <div key={row.metric} className="flex justify-between items-center bg-[#0c0e14] p-2.5 rounded-xl border border-[#151a26] text-xs">
                    <span className="text-gray-500">{row.metric}</span>
                    <div className="text-right">
                      <span className="text-white font-bold block">{row.value}</span>
                      <span className="text-emerald-400 text-[9px] font-semibold">{row.change}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => handleExport(selectedReport.name, "PDF")}
                className="w-full bg-brand-600 hover:bg-brand-500 text-black py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5" /> Export Full Report
              </button>
            </motion.div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-[#111520] text-center text-gray-600 py-16 text-xs">
              <FileText className="w-7 h-7 text-gray-700 mx-auto mb-3" />
              Select a report to preview sample data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
