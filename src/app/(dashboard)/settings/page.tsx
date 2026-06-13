"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Lock,
  UserCheck,
  CheckCircle,
  Database,
  Sliders,
  Building,
  Users,
  Save,
  RotateCcw,
  X,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../layout";

// Role-Based Access Matrix
const defaultMatrix: Record<string, string[]> = {
  SUPER_ADMIN: ["LEAD_TRANSFER", "COMMISSION_APPROVE", "TENANT_BILLING", "CAMPAIGN_CREATE", "LEAD_EDIT"],
  ADMIN: ["LEAD_TRANSFER", "COMMISSION_APPROVE", "CAMPAIGN_CREATE", "LEAD_EDIT"],
  SALES_MANAGER: ["LEAD_TRANSFER", "COMMISSION_APPROVE", "LEAD_EDIT"],
  TEAM_LEADER: ["LEAD_EDIT", "LEAD_TRANSFER"],
  AGENT: ["LEAD_EDIT"],
  MARKETING_EXECUTIVE: ["CAMPAIGN_CREATE"],
  BUILDER_PARTNER: [],
};

const actionsList = [
  { id: "TENANT_BILLING", label: "Manage billing tier options", category: "System Settings" },
  { id: "COMMISSION_APPROVE", label: "Approve broker commission payout vouchers", category: "Financial Ledger" },
  { id: "LEAD_TRANSFER", label: "Re-assign or transfer pipeline leads", category: "Leads CRM" },
  { id: "LEAD_EDIT", label: "Modify leads data history", category: "Leads CRM" },
  { id: "CAMPAIGN_CREATE", label: "Configure Google / FB marketing ads links", category: "Marketing Hub" },
];

const initialUsers = [
  { id: "USR-001", name: "Rohan Deshmukh", email: "rohan@24krealtors.com", role: "SUPER_ADMIN", status: "Active" },
  { id: "USR-002", name: "Priya Sharma", email: "priya@24krealtors.com", role: "AGENT", status: "Active" },
  { id: "USR-003", name: "Rahul Shinde", email: "rahul@24krealtors.com", role: "AGENT", status: "Active" },
  { id: "USR-004", name: "Amit Kulkarni", email: "amit@24krealtors.com", role: "AGENT", status: "Active" },
  { id: "USR-005", name: "Sarah Fernandes", email: "sarah@24krealtors.com", role: "AGENT", status: "Active" },
];

export default function SystemSettings() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"rbac" | "tenant" | "users">("rbac");
  
  // RBAC State
  const [matrix, setMatrix] = useState(defaultMatrix);
  const [selectedRole, setSelectedRole] = useState("AGENT");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Tenant Profile State
  const [companyName, setCompanyName] = useState("24K Realtors");
  const [subdomain, setSubdomain] = useState("24k-realtors");
  const [officeAddress, setOfficeAddress] = useState("Commercial Tower B, Phase 1, Hinjewadi, Pune - 411057");
  const [taxId, setTaxId] = useState("27AAAAA1111A1Z1");
  const [tier, setTier] = useState("Enterprise Suite");

  // User Management State
  const [users, setUsers] = useState(initialUsers);
  const [newUserModal, setNewUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("AGENT");

  const togglePermission = (role: string, permission: string) => {
    const activePerms = matrix[role] || [];
    const updated = activePerms.includes(permission)
      ? activePerms.filter((p) => p !== permission)
      : [...activePerms, permission];

    setMatrix({
      ...matrix,
      [role]: updated,
    });
  };

  const handleSaveRBAC = () => {
    showToast("Role permission rules updated successfully", "success");
  };

  const handleResetRBAC = () => {
    setMatrix(defaultMatrix);
    showToast("Restored system default permission matrix", "info");
    setShowResetConfirm(false);
  };

  const handleSaveTenant = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Tenant profile configuration saved", "success");
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const user = {
      id: `USR-00${users.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "Active",
    };
    setUsers([...users, user]);
    showToast(`User account created for ${newUserName}`, "success");
    setNewUserModal(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("AGENT");
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers(users.filter(u => u.id !== id));
    showToast(`Deactivated user ${name}`, "warning");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">System Settings</h2>
        <p className="text-xs text-gray-500 mt-1">
          Configure dynamic role permissions (RBAC), multi-tenant mappings, and corporate settings.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[#141822] gap-2">
        <button
          onClick={() => setActiveTab("rbac")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "rbac"
              ? "border-brand-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <Shield className="w-4 h-4" />
          Role Permissions Matrix
        </button>
        <button
          onClick={() => setActiveTab("tenant")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "tenant"
              ? "border-brand-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <Building className="w-4 h-4" />
          Tenant Profile
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "users"
              ? "border-brand-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <Users className="w-4 h-4" />
          User Management
        </button>
      </div>

      {/* Dynamic Tabs Content */}
      <div className="min-h-[500px]">
        {activeTab === "rbac" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Roles list */}
            <div className="lg:col-span-1 bg-[#0b0c10] border border-[#141822] rounded-2xl p-4 flex flex-col space-y-4">
              <div className="pb-2 border-b border-[#141822]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-300">Available Roles</h3>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {Object.keys(matrix).map((role) => (
                  <div
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                      selectedRole === role
                        ? "bg-brand-950/25 border-brand-500/25 text-white"
                        : "bg-[#111319]/20 border-transparent text-gray-400 hover:bg-[#111319]/50"
                    }`}
                  >
                    <span className="font-semibold">{role.replace(/_/g, " ")}</span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {matrix[role].length} perms
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Permissions matrix checkbox panel */}
            <div className="lg:col-span-2 glass-panel rounded-2xl border border-[#141822] p-6 flex flex-col justify-between">
              <div className="space-y-4 flex-1 overflow-y-auto">
                <div className="pb-3 border-b border-[#141822] flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-base">Configure Permissions Matrix</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Role scope: <span className="text-brand-400 font-bold">{selectedRole.replace(/_/g, " ")}</span></p>
                  </div>
                  <Shield className="w-5 h-5 text-brand-400" />
                </div>

                <div className="space-y-3 pt-2">
                  {actionsList.map((action) => {
                    const isChecked = (matrix[selectedRole] || []).includes(action.id);
                    return (
                      <div
                        key={action.id}
                        onClick={() => togglePermission(selectedRole, action.id)}
                        className="p-3 bg-[#12141a]/60 border border-[#1d2230] rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#12141a] transition-all text-xs"
                      >
                        <div>
                          <span className="text-[9px] bg-[#1a1c24] border border-[#2b3040] px-2 py-0.5 rounded text-gray-500 font-semibold uppercase font-sans">
                            {action.category}
                          </span>
                          <p className="font-semibold text-white mt-1.5">{action.label}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`w-5 h-5 rounded-lg border flex items-center justify-center font-bold text-xs ${
                            isChecked
                              ? "bg-brand-500 text-black border-brand-500 shadow-md shadow-brand-500/10"
                              : "bg-transparent text-transparent border-[#1d2230]"
                          }`}>
                            ✓
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#141822] pt-4 flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="bg-transparent border border-[#1d2230] hover:bg-gray-950 text-gray-400 px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
                <button
                  onClick={handleSaveRBAC}
                  className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/10 flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Dynamic Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tenant" && (
          <form onSubmit={handleSaveTenant} className="glass-panel rounded-2xl border border-[#141822] p-6 max-w-2xl space-y-6">
            <div className="pb-3 border-b border-[#141822] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-base">Tenant Profile Settings</h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage details for your corporate 24K Realtors tenant space.</p>
              </div>
              <Building className="w-5 h-5 text-brand-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3.5 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Tenant Plan Tier</label>
                <input
                  type="text"
                  value={tier}
                  disabled
                  className="w-full bg-[#0c0e14]/50 border border-[#151a26]/50 rounded-xl py-2 px-3.5 text-xs text-gray-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Subdomain Mapping</label>
              <div className="flex">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className="bg-[#0c0e14] border border-[#151a26] border-r-0 rounded-l-xl py-2 px-3.5 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40 flex-1"
                  required
                />
                <span className="bg-[#12141c] border border-[#151a26] rounded-r-xl py-2 px-3.5 text-xs text-gray-600 font-mono flex items-center">
                  .crm.estate
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Registered Office Address</label>
              <textarea
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                rows={3}
                className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3.5 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">GSTIN / Tax ID</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3.5 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40 font-mono"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">Logo Simulation</label>
                <div className="flex items-center gap-3 bg-[#0c0e14] border border-[#151a26] rounded-xl py-1 px-2 text-xs text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-black text-black">24K</div>
                  <span className="text-[10px] text-gray-600">24k_logo_gold.svg</span>
                  <span className="ml-auto text-[9px] text-brand-400 cursor-pointer font-bold px-2 hover:underline">Change</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#141822] pt-4 flex justify-end gap-3">
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/10 flex items-center gap-1.5 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                Save Profile
              </button>
            </div>
          </form>
        )}

        {activeTab === "users" && (
          <div className="glass-panel rounded-2xl border border-[#141822] p-6 space-y-4">
            <div className="pb-3 border-b border-[#141822] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-base">User Management</h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage roles and workspace access for agent accounts.</p>
              </div>
              <button
                onClick={() => setNewUserModal(true)}
                className="bg-brand-600 hover:bg-brand-500 text-black font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-500/10 transition-all"
              >
                Add User Account
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#141822] text-gray-500 uppercase tracking-widest text-[9px]">
                    <th className="pb-3 font-semibold">User Details</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141822]/40">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#0c0e14]/20 transition-colors">
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#151a26] to-[#1e2538] border border-[#252d40] flex items-center justify-center font-bold text-white">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-bold text-white leading-none">{user.name}</p>
                            <span className="text-[10px] text-gray-600 mt-0.5 block">{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 text-gray-400 font-mono">{user.email}</td>
                      <td className="py-3.5 pr-3">
                        <span className="text-[9px] bg-brand-950/20 border border-brand-500/15 text-brand-400 font-bold px-2 py-0.5 rounded font-sans uppercase">
                          {user.role.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-950/15 border border-emerald-500/15 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {user.role !== "SUPER_ADMIN" ? (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-rose-400 hover:text-rose-300 font-bold hover:underline"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <span className="text-gray-700 italic">System Owner</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0b0f] border border-[#151a26] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center"
            >
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <div>
                <h3 className="font-bold text-white text-sm">Reset Role Permissions Matrix?</h3>
                <p className="text-xs text-gray-500 leading-relaxed mt-1.5">
                  Are you sure you want to revert all roles and permissions back to the initial default system definitions? This action is immediate.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-transparent border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetRBAC}
                  className="bg-amber-600 hover:bg-amber-500 text-black px-6 py-2 rounded-xl text-xs font-semibold"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {newUserModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewUserModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-20 max-w-md mx-auto bg-[#0a0b0f] border border-[#151a26] z-50 p-6 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#111520] pb-3 mb-4">
                <h3 className="font-bold text-sm text-white">Create New Workspace Account</h3>
                <button onClick={() => setNewUserModal(false)} className="text-gray-500 hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. Ramesh Nair"
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block font-semibold">Corporate Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="e.g. ramesh@24krealtors.com"
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block font-semibold">Assigned System Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none"
                  >
                    {Object.keys(matrix).map((role) => (
                      <option key={role} value={role}>
                        {role.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-[#111520]">
                  <button
                    type="button"
                    onClick={() => setNewUserModal(false)}
                    className="border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
