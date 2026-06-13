"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, KeyRound, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [needs2FA, setNeeds2FA] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoAccess, setShowDemoAccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
    <div className="min-h-screen bg-[#030406] flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Decorative luxury gradient background glows */}
      <div className="absolute top-[-25%] left-[-25%] w-[70%] h-[70%] rounded-full bg-brand-950/20 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-25%] w-[70%] h-[70%] rounded-full bg-indigo-950/10 blur-[180px] pointer-events-none" />

      {/* Empty div for vertical centering spacing */}
      <div className="flex-1" />

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#090b0e]/90 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 mx-auto space-y-7"
      >
        {/* Logo and Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-extrabold text-[#090b0e] text-3xl mx-auto shadow-[0_0_30px_rgba(223,148,32,0.15)] border border-brand-300/10">
            24K
          </div>
          <h2 className="text-2xl font-bold tracking-wider text-white mt-4 uppercase">24K REALTORS CRM</h2>
          <p className="text-xs text-gray-400 tracking-wide font-medium leading-relaxed">
            Real Estate Property Consultant Portal
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!needs2FA ? (
              <motion.div
                key="creds"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@24krealtors.com"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-gray-200 placeholder-zinc-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-gray-200 placeholder-zinc-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between pt-1 pb-2">
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-zinc-800 bg-zinc-950 text-brand-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 accent-brand-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors"
                  >
                    Forgot Password?
                  </a>
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
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    6-Digit OTP / App Code
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="Enter code (e.g. 123456)"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-gray-200 placeholder-zinc-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 focus:outline-none tracking-widest text-center font-bold transition-all duration-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-500 to-brand-400 text-zinc-950 font-bold py-3.5 rounded-2xl text-xs hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/10 focus:outline-none"
          >
            <span>{loading ? "Authorizing Security..." : needs2FA ? "Verify & Enter Portal" : "Sign In to Office"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Create Account/Request Access Section */}
        <div className="text-center text-xs text-zinc-500">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
          >
            Create one here
          </a>
        </div>

        {/* Demo Fast Login Switcher Accordion */}
        <div className="border-t border-zinc-800/60 pt-5">
          <button
            type="button"
            onClick={() => setShowDemoAccess(!showDemoAccess)}
            className="w-full flex items-center justify-between text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider font-semibold focus:outline-none"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400/80" />
              💡 Developer Demo Access
            </span>
            <span>{showDemoAccess ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</span>
          </button>

          <AnimatePresence>
            {showDemoAccess && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 text-[10px] mt-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@24krealtors.com")}
                    className="bg-zinc-950/40 border border-zinc-900 hover:border-brand-500/40 text-zinc-400 hover:text-white py-2 px-3 rounded-xl transition-all"
                  >
                    Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("manager@24krealtors.com")}
                    className="bg-zinc-950/40 border border-zinc-900 hover:border-brand-500/40 text-zinc-400 hover:text-white py-2 px-3 rounded-xl transition-all"
                  >
                    Sales Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("agent1@24krealtors.com")}
                    className="bg-zinc-950/40 border border-zinc-900 hover:border-brand-500/40 text-zinc-400 hover:text-white py-2 px-3 rounded-xl transition-all"
                  >
                    Sales Agent (Rahul)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("support@24krealtors.com")}
                    className="bg-zinc-950/40 border border-zinc-900 hover:border-brand-500/40 text-zinc-400 hover:text-white py-2 px-3 rounded-xl transition-all"
                  >
                    Admin (2FA Trigger)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Empty div for vertical centering spacing */}
      <div className="flex-1" />

      {/* Professional Footer */}
      <div className="text-[10px] text-zinc-600 text-center tracking-wide mt-6">
        © 2026 24K Realtors. All rights reserved. | <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-zinc-400 transition-colors">Support</a>
      </div>
    </div>
  );
}
