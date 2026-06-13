"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, KeyRound, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [needs2FA, setNeeds2FA] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Simulate 2FA challenge for demo if login is support@24krealtors.com
      if (email.includes("support") && !needs2FA) {
        setNeeds2FA(true);
        return;
      }

      // Success - Redirect to dashboard
      router.push("/");
    }, 1000);
  };

  const handleQuickLogin = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("Password123");
    setNeeds2FA(false);
    setLoading(true);
    setTimeout(() => {
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative luxury gradient background glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-brand-950/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-950/15 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0a0b0e]/85 backdrop-blur-xl border border-[#1b202e] rounded-3xl p-8 shadow-2xl relative z-10 space-y-6"
      >
        {/* Logo and Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-black text-2.5xl mx-auto shadow-lg shadow-brand-500/10">
            24K
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mt-4">24K REALTORS CRM</h2>
          <p className="text-xs text-gray-500">Real Estate Property Consultant Portal</p>
        </div>

        {error && (
          <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!needs2FA ? (
              <motion.div
                key="creds"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block mb-1">Corporate Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@24krealtors.com"
                      className="w-full bg-[#111319] border border-[#1d2230] rounded-2xl py-3 pl-11 pr-4 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block mb-1 font-sans">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#111319] border border-[#1d2230] rounded-2xl py-3 pl-11 pr-4 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="2fa"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-brand-950/20 border border-brand-500/20 rounded-xl p-3 text-xs text-brand-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Two-Factor Authentication is active for this account.</span>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block mb-1">6-Digit OTP / App Code</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="Enter code (e.g. 123456)"
                      className="w-full bg-[#111319] border border-[#1d2230] rounded-2xl py-3 pl-11 pr-4 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500 tracking-widest text-center font-bold"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-black font-semibold py-3.5 rounded-2xl text-xs hover:from-brand-500 hover:to-brand-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/10 active:scale-[0.98]"
          >
            <span>{loading ? "Authorizing Security..." : needs2FA ? "Verify & Enter Portal" : "Sign In to Office"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="border-t border-[#141822] pt-6 space-y-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Quick Demo Accounts Switcher
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              onClick={() => handleQuickLogin("admin@24krealtors.com")}
              className="bg-[#111319] border border-[#1d2230] hover:border-brand-500/30 text-gray-300 py-2 rounded-xl"
            >
              Super Admin
            </button>
            <button
              onClick={() => handleQuickLogin("manager@24krealtors.com")}
              className="bg-[#111319] border border-[#1d2230] hover:border-brand-500/30 text-gray-300 py-2 rounded-xl"
            >
              Sales Manager
            </button>
            <button
              onClick={() => handleQuickLogin("agent1@24krealtors.com")}
              className="bg-[#111319] border border-[#1d2230] hover:border-brand-500/30 text-gray-300 py-2 rounded-xl"
            >
              Sales Agent (Rahul)
            </button>
            <button
              onClick={() => handleQuickLogin("support@24krealtors.com")}
              className="bg-[#111319] border border-[#1d2230] hover:border-brand-500/30 text-gray-300 py-2 rounded-xl"
            >
              Admin (2FA Trigger)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
