"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  TrendingUp,
  DollarSign,
  UserPlus,
  Percent,
  Plus,
  X,
  Pause,
  Play,
  IndianRupee,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useToast } from "../layout";
import {
  getStoredData,
  setStoredData,
  initialCampaigns,
} from "../../../lib/mock-data";

const statusStyles: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "bg-emerald-950/20 border-emerald-500/20", text: "text-emerald-400" },
  PAUSED: { bg: "bg-amber-950/20 border-amber-500/20", text: "text-amber-400" },
  ENDED: { bg: "bg-gray-950/20 border-gray-500/20", text: "text-gray-500" },
};

const formatINR = (val: number) => {
  if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹ ${(val / 100000).toFixed(1)} L`;
  return `₹ ${val.toLocaleString("en-IN")}`;
};

export default function MarketingCRM() {
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSource, setNewSource] = useState("GOOGLE_ADS");
  const [newBudget, setNewBudget] = useState("");

  useEffect(() => {
    setCampaigns(getStoredData("crm_campaigns", initialCampaigns));
  }, []);

  const saveCampaignsToStorage = (updated: any[]) => {
    setCampaigns(updated);
    setStoredData("crm_campaigns", updated);
  };

  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0);
  const totalSales = campaigns.reduce((acc, c) => acc + c.sales, 0);
  const totalRevenue = totalSales * 0.025; // 2.5% average broker payout
  const totalROI = totalSpent > 0 ? (totalRevenue / totalSpent) * 100 : 0;
  const avgCPL = totalLeads > 0 ? totalSpent / totalLeads : 0;

  const chartData = campaigns.filter((c) => c.status !== "ENDED").map((c) => ({
    name: c.name.length > 20 ? c.name.substring(0, 18) + "..." : c.name,
    spent: c.spent,
    leads: c.leads,
  }));

  const toggleStatus = (id: string) => {
    const updated = campaigns.map((c) => {
      if (c.id === id) {
        const newStatus = c.status === "ACTIVE" ? "PAUSED" : c.status === "PAUSED" ? "ACTIVE" : c.status;
        if (newStatus !== c.status) showToast(`Campaign "${c.name}" ${newStatus === "ACTIVE" ? "resumed" : "paused"}`, "info");
        return { ...c, status: newStatus };
      }
      return c;
    });
    saveCampaignsToStorage(updated);
  };

  const simulateTraffic = (id: string) => {
    const updated = campaigns.map((c) => {
      if (c.id === id) {
        // Random increases
        const spendIncr = Math.floor(Math.random() * 8000) + 4000;
        const leadsIncr = Math.floor(Math.random() * 15) + 5;
        const bookingsIncr = Math.random() > 0.75 ? 1 : 0;
        const salesIncr = bookingsIncr > 0 ? (Math.floor(Math.random() * 6000000) + 7000000) : 0;

        showToast(`Simulated traffic for "${c.name}": +${leadsIncr} leads, +₹ ${spendIncr.toLocaleString("en-IN")} spend`, "success");
        return {
          ...c,
          spent: c.spent + spendIncr,
          leads: c.leads + leadsIncr,
          bookings: c.bookings + bookingsIncr,
          sales: c.sales + salesIncr,
        };
      }
      return c;
    });
    saveCampaignsToStorage(updated);
  };

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const budgetVal = parseFloat(newBudget) || 100000;

    const newCamp = {
      id: `MKT-${String(campaigns.length + 1).padStart(2, "0")}`,
      name: newName,
      source: newSource,
      spent: 0,
      leads: 0,
      bookings: 0,
      sales: 0,
      status: "ACTIVE",
      startDate: new Date().toISOString().split("T")[0],
    };
    
    saveCampaignsToStorage([newCamp, ...campaigns]);
    showToast(`Campaign "${newName}" created successfully`, "success");
    setAddModal(false);
    setNewName(""); setNewBudget("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Marketing Analytics</h2>
          <p className="text-xs text-gray-500 mt-1">
            Campaign spend, CPL, ROI, and lead conversion across Pune corridors.
          </p>
        </div>
        <button onClick={() => setAddModal(true)}
          className="bg-brand-600 hover:bg-brand-500 text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-500/10">
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Spend", value: formatINR(totalSpent), color: "text-white" },
          { label: "Leads Acquired", value: `${totalLeads} prospects`, color: "text-white" },
          { label: "Avg. Cost Per Lead (CPL)", value: formatINR(avgCPL), color: "text-brand-400" },
          { label: "Campaign ROI", value: `${totalROI.toFixed(0)}%`, color: "text-emerald-400" },
        ].map((item) => (
          <div key={item.label} className="glass-panel p-4 rounded-2xl border border-[#111520]">
            <span className="text-[9px] text-gray-600 block uppercase font-bold tracking-wider">{item.label}</span>
            <span className={`text-lg font-extrabold ${item.color} mt-1 inline-block`}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#111520]">
            <div>
              <h3 className="font-bold text-white text-sm">Campaign Performance Chart</h3>
              <p className="text-[10px] text-gray-600 mt-0.5">Active campaigns spent comparison</p>
            </div>
            <Activity className="w-4 h-4 text-brand-400" />
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111520" vertical={false} />
                <XAxis dataKey="name" stroke="#374151" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#374151" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0a0b0f", borderColor: "#151a26", borderRadius: "12px", fontSize: "11px" }} />
                <Bar dataKey="spent" fill="#df9420" name="Spend (₹)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leads" fill="#3b82f6" name="Leads" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="glass-panel p-5 rounded-2xl space-y-3 overflow-y-auto max-h-[500px]">
          <div className="pb-2 border-b border-[#111520]">
            <h3 className="font-bold text-white text-sm">Active Marketing Campaigns</h3>
            <p className="text-[10px] text-gray-600 mt-0.5">{campaigns.length} total trackers</p>
          </div>
          {campaigns.map((camp) => {
            const rev = camp.sales * 0.025;
            const roi = camp.spent > 0 ? (rev / camp.spent) * 100 : 0;
            const st = statusStyles[camp.status];
            return (
              <div key={camp.id} className="bg-[#0c0e14]/50 p-3.5 rounded-xl border border-[#111520] text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-[11px] truncate flex-1">{camp.name}</h4>
                  <span className={`status-badge border px-2 py-0.5 ${st.bg} ${st.text}`}>{camp.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#111520]/40 text-[9px] text-gray-600">
                  <div>
                    <span>Spend</span>
                    <span className="text-white block mt-0.5 font-semibold">{formatINR(camp.spent)}</span>
                  </div>
                  <div>
                    <span>Leads</span>
                    <span className="text-brand-400 block mt-0.5 font-semibold">{camp.leads}</span>
                  </div>
                  <div>
                    <span>Est. ROI</span>
                    <span className={`block mt-0.5 font-semibold ${roi > 150 ? "text-emerald-400" : "text-gray-400"}`}>{roi.toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex gap-1.5 pt-1">
                  {camp.status !== "ENDED" && (
                    <button onClick={() => toggleStatus(camp.id)}
                      className="bg-[#0c0e14] hover:bg-[#151a26] border border-[#151a26] text-gray-400 p-1.5 rounded-lg flex items-center justify-center gap-1 flex-1 text-[9px]">
                      {camp.status === "ACTIVE" ? <Pause className="w-3 h-3 text-amber-500" /> : <Play className="w-3 h-3 text-emerald-500" />}
                      {camp.status === "ACTIVE" ? "Pause" : "Resume"}
                    </button>
                  )}
                  {camp.status === "ACTIVE" && (
                    <button onClick={() => simulateTraffic(camp.id)}
                      className="bg-brand-950/40 border border-brand-500/25 hover:bg-brand-950/70 text-brand-400 p-1.5 rounded-lg flex items-center justify-center gap-1 flex-1 text-[9px] font-bold">
                      <Activity className="w-3 h-3" />
                      Simulate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Campaign Modal */}
      <AnimatePresence>
        {addModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setAddModal(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-24 max-w-md mx-auto bg-[#0a0b0f] border border-[#151a26] z-50 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#111520] pb-3 mb-4">
                <h3 className="font-bold text-sm text-white">Create Campaign</h3>
                <button onClick={() => setAddModal(false)} className="text-gray-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddCampaign} className="space-y-3">
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Campaign Name *</label>
                  <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Google Hinjewadi 3BHK Q3"
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Channel</label>
                    <select value={newSource} onChange={(e) => setNewSource(e.target.value)}
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                      <option value="GOOGLE_ADS">Google Ads</option>
                      <option value="FACEBOOK_ADS">Facebook Ads</option>
                      <option value="INSTAGRAM">Instagram</option>
                      <option value="ORGANIC_SEO">SEO / Portals</option>
                      <option value="REFERRALS">Referrals</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Budget (₹)</label>
                    <input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)}
                      placeholder="e.g. 150000"
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-[#111520]">
                  <button type="button" onClick={() => setAddModal(false)} className="border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold">Launch Campaign</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
