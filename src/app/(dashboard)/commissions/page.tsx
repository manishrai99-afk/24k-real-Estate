"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, CheckCircle, Building, Banknote } from "lucide-react";
import { useToast } from "../layout";
import {
  getStoredData,
  setStoredData,
  initialLedger,
} from "../../../lib/mock-data";

export default function CommissionsLedger() {
  const { showToast } = useToast();
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    setLedger(getStoredData("crm_commissions", initialLedger));
  }, []);

  const saveLedgerToStorage = (updated: any[]) => {
    setLedger(updated);
    setStoredData("crm_commissions", updated);
  };

  const approveCommission = (id: string, stageIndex: number) => {
    const updated = ledger.map((item) => {
      if (item.id === id) {
        const approvalsCopy = [...item.approvals];
        approvalsCopy[stageIndex] = { ...approvalsCopy[stageIndex], status: "APPROVED", date: new Date().toISOString().split("T")[0] };
        const allApproved = approvalsCopy.every((a) => a.status === "APPROVED");
        showToast(`Approved by ${approvalsCopy[stageIndex].name}`, "success");
        return { ...item, approvals: approvalsCopy, status: allApproved ? "APPROVED" : item.status };
      }
      return item;
    });
    saveLedgerToStorage(updated);
  };

  const markPaid = (id: string) => {
    const updated = ledger.map((item) => item.id === id ? { ...item, status: "PAID" } : item);
    saveLedgerToStorage(updated);
    showToast(`Commission ${id} marked as paid`, "success");
  };

  // Auto-calculate totals
  const pendingTotal = ledger.filter((l) => l.status === "PENDING_APPROVAL" || l.status === "APPROVED").reduce((a, l) => a + l.agentComm + l.teamComm, 0);
  const paidTotal = ledger.filter((l) => l.status === "PAID").reduce((a, l) => a + l.agentComm + l.teamComm, 0);
  const builderOutstanding = ledger.filter((l) => l.status !== "PAID").reduce((a, l) => a + l.builderComm, 0);

  const formatINR = (v: number) => `₹ ${v.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Brokerage & Commission Ledger</h2>
        <p className="text-xs text-gray-500 mt-1">Agent payouts, team overrides, and multi-tier approval workflow.</p>
      </div>

      {/* KPIs — auto-calculated */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-[#111520]">
          <div className="w-9 h-9 rounded-xl bg-brand-950/20 border border-brand-500/15 flex items-center justify-center text-brand-400"><DollarSign className="w-4 h-4" /></div>
          <div><span className="text-[9px] text-gray-600 block uppercase tracking-wider font-semibold">Pending Payouts</span><span className="text-base font-extrabold text-white">{formatINR(pendingTotal)}</span></div>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-[#111520]">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/20 border border-emerald-500/15 flex items-center justify-center text-emerald-400"><CheckCircle className="w-4 h-4" /></div>
          <div><span className="text-[9px] text-gray-600 block uppercase tracking-wider font-semibold">Paid (This Month)</span><span className="text-base font-extrabold text-white">{formatINR(paidTotal)}</span></div>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-[#111520]">
          <div className="w-9 h-9 rounded-xl bg-indigo-950/20 border border-indigo-500/15 flex items-center justify-center text-indigo-400"><Building className="w-4 h-4" /></div>
          <div><span className="text-[9px] text-gray-600 block uppercase tracking-wider font-semibold">Builder Outstanding</span><span className="text-base font-extrabold text-white">{formatINR(builderOutstanding)}</span></div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-2xl border border-[#111520] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="border-b border-[#111520] bg-[#08090c] text-[9px] font-semibold text-gray-600 uppercase">
              <th className="p-3">ID</th><th className="p-3">Deal / Unit</th><th className="p-3">Agent</th>
              <th className="p-3">Agent %</th><th className="p-3">Team</th><th className="p-3">Builder</th>
              <th className="p-3">Approvals</th><th className="p-3">Status</th><th className="p-3 font-sans uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="text-[11px] text-gray-400 divide-y divide-[#111520]/40">
            {ledger.map((item) => (
              <tr key={item.id} className="hover:bg-[#0c0e14]/40 transition-colors">
                <td className="p-3 font-mono font-bold text-gray-600 text-[10px]">{item.id}</td>
                <td className="p-3"><div className="font-semibold text-white">{item.unit}</div><div className="text-[9px] text-gray-600 mt-0.5">{item.builder}</div></td>
                <td className="p-3"><div className="font-semibold text-white">{item.agent}</div><div className="text-[9px] text-gray-600 mt-0.5">₹ {(item.totalContract / 100000).toFixed(0)}L deal</div></td>
                <td className="p-3 font-bold text-white">{formatINR(item.agentComm)}<div className="text-[8px] text-gray-600 mt-0.5">1.25%</div></td>
                <td className="p-3 text-gray-500">{formatINR(item.teamComm)}<div className="text-[8px] text-gray-600 mt-0.5">0.125%</div></td>
                <td className="p-3 text-brand-400 font-bold">{formatINR(item.builderComm)}<div className="text-[8px] text-gray-600 mt-0.5">2.5%</div></td>
                <td className="p-3">
                  <div className="space-y-1">
                    {item.approvals.map((app: any, idx: number) => (
                      <div key={app.name} className="flex items-center gap-1 text-[9px]">
                        <span className={`w-1.5 h-1.5 rounded-full ${app.status === "APPROVED" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <span className="text-gray-500">{app.role}:</span>
                        <span className="text-white font-medium">{app.name}</span>
                        {app.status === "PENDING" ? (
                          <button onClick={() => approveCommission(item.id, idx)}
                            className="text-[8px] text-brand-400 font-bold bg-brand-950/15 border border-brand-500/15 px-1.5 py-0.5 rounded ml-1 hover:bg-brand-950/30">Approve</button>
                        ) : <span className="text-emerald-400 ml-1">✓</span>}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-3">
                  <span className={`status-badge border px-2 py-0.5 ${
                    item.status === "PAID" ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20" :
                    item.status === "APPROVED" ? "bg-blue-950/20 text-blue-400 border-blue-500/20" :
                    "bg-amber-950/20 text-amber-400 border-amber-500/20"
                  }`}>{item.status.replace("_", " ")}</span>
                </td>
                <td className="p-3">
                  {item.status === "APPROVED" && (
                    <button onClick={() => markPaid(item.id)}
                      className="text-[9px] bg-emerald-950/20 border border-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-lg font-semibold hover:bg-emerald-950/30 flex items-center gap-1">
                      <Banknote className="w-3.5 h-3.5" /> Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
