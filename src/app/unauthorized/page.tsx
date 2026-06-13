"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-rose-950/10 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0a0b0e] border border-[#1b202e] rounded-3xl p-8 shadow-2xl text-center space-y-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-950/35 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500 shadow-lg shadow-rose-500/5">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Access Unauthorized</h2>
          <p className="text-xs text-gray-500 leading-normal">
            Your corporate account role does not have permission to view this section.
            If this is a mistake, contact your administrator.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#111319] hover:bg-[#1a1c24] text-gray-300 hover:text-white border border-[#1d2230] px-5 py-2.5 rounded-xl text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
