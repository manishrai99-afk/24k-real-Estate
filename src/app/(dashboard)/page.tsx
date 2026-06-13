"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Building,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getStoredData,
  initialLeads,
  initialDeals,
  initialVisits,
  initialProperties,
  initialLedger,
  activeAgents,
} from "../../lib/mock-data";

// Brokerage Revenue Data (Pune West Corridor — H1 2026)
const revenueData = [
  { month: "Jan", revenue: 450000 },
  { month: "Feb", revenue: 850000 },
  { month: "Mar", revenue: 620000 },
  { month: "Apr", revenue: 1150000 },
  { month: "May", revenue: 1450000 },
  { month: "Jun", revenue: 1850000 },
];

const formatPrice = (value: number) => {
  if (value >= 10000000) return `₹ ${(value / 10000000).toFixed(2)} Cr`;
  return `₹ ${(value / 100000).toFixed(0)} L`;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
};

export default function Dashboard() {
  const [clock, setClock] = useState("");

  // Live database counts
  const [leadsCount, setLeadsCount] = useState(430);
  const [dealsCount, setDealsCount] = useState(14);
  const [pipelineValue, setPipelineValue] = useState("₹ 12.4 Cr");
  const [revenueForecast, setRevenueForecast] = useState("₹ 14.5 L");
  const [visitsCount, setVisitsCount] = useState(8);

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);

  useEffect(() => {
    // Clock
    const updateClock = () => {
      setClock(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Dynamic stats compilation
    const leads = getStoredData("crm_leads", initialLeads);
    const deals = getStoredData("crm_deals", initialDeals);
    const visits = getStoredData("crm_visits", initialVisits);
    const ledger = getStoredData("crm_commissions", initialLedger);

    const activeLeads = leads.filter((l: any) => l.status !== "LOST" && l.status !== "BOOKED").length;
    const activeDeals = deals.filter((d: any) => d.status !== "CLOSURE").length;
    
    const pipeSum = deals.reduce((acc: number, d: any) => acc + d.totalValue, 0);
    const forecastSum = ledger.filter((l: any) => l.status !== "PAID").reduce((acc: number, l: any) => acc + l.agentComm + l.teamComm, 0);
    const todaysVisits = visits.filter((v: any) => v.status === "SCHEDULED" || v.status === "CONFIRMED").length;

    setLeadsCount(activeLeads);
    setDealsCount(activeDeals);
    setPipelineValue(pipeSum >= 10000000 ? `₹ ${(pipeSum / 10000000).toFixed(1)} Cr` : `₹ ${(pipeSum / 100000).toFixed(0)} L`);
    setRevenueForecast(forecastSum >= 100000 ? `₹ ${(forecastSum / 100000).toFixed(1)} L` : `₹ ${forecastSum.toLocaleString()}`);
    setVisitsCount(todaysVisits);

    // Leaderboard compilation dynamically from closed deals
    const agentStats = activeAgents.map((agent) => {
      const agentClosedDeals = deals.filter((d: any) => d.agent === agent.name && d.status === "CLOSURE");
      const totalClosedSales = agentClosedDeals.reduce((sum: number, d: any) => sum + d.totalValue, 0);
      return {
        name: agent.name,
        sales: totalClosedSales || agent.sales * 0.1, // Fallback to proportion of seeds
        deals: agentClosedDeals.length || agent.deals,
        avatar: agent.avatar,
      };
    }).sort((a, b) => b.sales - a.sales);

    setLeaderboard(agentStats);

    // Lead channels dynamic aggregation
    const sources = [
      { name: "Google Ads", value: leads.filter((l: any) => l.source === "GOOGLE_ADS").length * 10 + 240, color: "#df9420" },
      { name: "Facebook / IG", value: leads.filter((l: any) => l.source === "FACEBOOK_ADS" || l.source === "INSTAGRAM").length * 10 + 190, color: "#3b82f6" },
      { name: "Housing.com", value: leads.filter((l: any) => l.source === "PROPERTY_FINDER").length * 10 + 310, color: "#10b981" },
      { name: "99acres", value: leads.filter((l: any) => l.source === "BAYUT").length * 10 + 150, color: "#8b5cf6" },
      { name: "Referrals", value: leads.filter((l: any) => l.source === "REFERRALS").length * 10 + 50, color: "#ec4899" },
    ];
    setSourceData(sources);

    return () => clearInterval(interval);
  }, []);

  const totalSourcesCount = sourceData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-7"
    >
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Command Center</h2>
          <p className="text-gray-500 text-xs mt-1">
            Real-time performance metrics for 24K Realtors — Pune West Corridor.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-600 bg-[#0c0e14] border border-[#151a26] px-3.5 py-1.5 rounded-lg font-mono">
            IST <span className="text-gray-400 font-semibold">{clock}</span>
          </span>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Leads", value: leadsCount.toString(), change: "+14.2%", sub: "vs last 30 days", icon: Users, iconBg: "bg-brand-950/20 border-brand-500/15 text-brand-400", changeBg: "text-emerald-400 bg-emerald-950/20" },
          { label: "Pipeline Stage Value", value: pipelineValue, change: `${dealsCount} Deals`, sub: "Open Negotiations", icon: TrendingUp, iconBg: "bg-emerald-950/20 border-emerald-500/15 text-emerald-400", changeBg: "text-emerald-400 bg-emerald-950/20" },
          { label: "Pending Showings", value: visitsCount.toString(), change: "Active scheduled", sub: "Site Visits", icon: Calendar, iconBg: "bg-blue-950/20 border-blue-500/15 text-blue-400", changeBg: "text-blue-400 bg-blue-950/20" },
          { label: "Est. Revenue (comm.)", value: revenueForecast, change: "Outstanding Brokerage", sub: "Brokerage Ledger", icon: DollarSign, iconBg: "bg-amber-950/20 border-amber-500/15 text-brand-400", changeBg: "text-emerald-400 bg-emerald-950/20" },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            variants={itemVariants}
            className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{metric.label}</p>
                <h3 className={`text-2xl font-extrabold text-white mt-1.5 ${i === 3 ? "text-gold-gradient" : ""}`}>{metric.value}</h3>
              </div>
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${metric.iconBg}`}>
                <metric.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-[10px]">
              <span className={`font-bold ${metric.changeBg} px-2 py-0.5 rounded-full`}>{metric.change}</span>
              <span className="text-gray-600">{metric.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <motion.div
          variants={itemVariants}
          className="glass-panel p-5 rounded-2xl lg:col-span-2 space-y-4"
        >
          <div className="flex justify-between items-center pb-2 border-b border-[#111520]">
            <div>
              <h3 className="font-bold text-white text-sm">Monthly Brokerage Revenue (₹)</h3>
              <p className="text-[10px] text-gray-600 mt-0.5">Closed developer payouts — Pune West corridor</p>
            </div>
            <span className="text-[10px] text-brand-400 font-semibold bg-brand-950/15 px-2.5 py-1 rounded-lg border border-brand-500/10">
              H1 2026
            </span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#df9420" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#df9420" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#111520" vertical={false} />
                <XAxis dataKey="month" stroke="#374151" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#374151" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0b0f", borderColor: "#151a26", borderRadius: "12px", fontSize: "11px" }}
                  formatter={(val: any) => [`₹ ${val.toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#df9420" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Lead Sources Pie */}
        <motion.div
          variants={itemVariants}
          className="glass-panel p-5 rounded-2xl space-y-4"
        >
          <div className="pb-2 border-b border-[#111520]">
            <h3 className="font-bold text-white text-sm">Lead Channel Mix</h3>
            <p className="text-[10px] text-gray-600 mt-0.5">Active inquiry distribution</p>
          </div>
          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0a0b0f", borderColor: "#151a26", borderRadius: "12px", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-black text-white">{totalSourcesCount}</span>
              <span className="text-[9px] text-gray-600 font-semibold tracking-wider uppercase">Inquiries</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
            {sourceData.map((source) => (
              <div key={source.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: source.color }} />
                <span className="text-gray-500 truncate">{source.name}</span>
                <span className="text-white font-bold ml-auto">{source.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Leaderboard */}
      <div className="grid grid-cols-1 gap-5">
        <motion.div
          variants={itemVariants}
          className="glass-panel p-5 rounded-2xl space-y-4"
        >
          <div className="pb-2 border-b border-[#111520] flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-sm">Agent Leaderboard</h3>
              <p className="text-[10px] text-gray-600 mt-0.5">Top performing consultants by closed sales volume</p>
            </div>
            <Award className="w-4 h-4 text-brand-400" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {leaderboard.map((agent, i) => (
              <div key={agent.name} className="flex items-center gap-3 bg-[#0c0e14]/50 p-4 rounded-xl border border-[#111520]">
                <span className="text-xs font-bold text-gray-600 w-4">#{i + 1}</span>
                <div className="w-9 h-9 rounded-lg bg-brand-950/25 border border-brand-500/15 flex items-center justify-center font-bold text-brand-400 text-xs">
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-[11px] truncate leading-none">{agent.name}</h4>
                  <span className="text-[9px] text-gray-600 font-semibold tracking-wider uppercase mt-1 inline-block">{agent.deals} sales closed</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-400 block">{formatPrice(agent.sales)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
