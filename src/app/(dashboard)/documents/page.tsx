"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Search,
  FolderLock,
  Plus,
  Trash2,
  X,
  Upload,
  Image,
  File,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../layout";

// ─── Pune Localized Documents ─────────────────────────────────
const initialDocs = [
  { id: "DOC-301", name: "Godrej_24_TB1602_SPA_Draft.pdf", category: "AGREEMENT", size: "2.4 MB", date: "2026-06-12", author: "Priya Sharma" },
  { id: "DOC-302", name: "Ramesh_Nair_KYC_Passport.pdf", category: "KYC", size: "1.1 MB", date: "2026-06-11", author: "Rahul Shinde" },
  { id: "DOC-303", name: "VTP_BlueWaters_T4_Floorplans.pdf", category: "FLOORPLAN", size: "8.5 MB", date: "2026-06-08", author: "VTP Realty (Synced)" },
  { id: "DOC-304", name: "Kasturi_EON_Homes_Brochure.pdf", category: "BROCHURE", size: "12.2 MB", date: "2026-06-05", author: "Kasturi Builders" },
  { id: "DOC-305", name: "Kolte_Patil_LifeRepublic_PriceList.pdf", category: "BROCHURE", size: "4.8 MB", date: "2026-06-03", author: "Amit Kulkarni" },
  { id: "DOC-306", name: "Deepali_Joshi_AadhaarKYC.pdf", category: "KYC", size: "0.8 MB", date: "2026-06-01", author: "Priya Sharma" },
  { id: "DOC-307", name: "Shapoorji_Joyville_MaanGaon_Layout.pdf", category: "FLOORPLAN", size: "6.3 MB", date: "2026-05-28", author: "Shapoorji Pallonji" },
  { id: "DOC-308", name: "Commission_Invoice_June2026.pdf", category: "INVOICE", size: "0.5 MB", date: "2026-06-10", author: "Sarah Fernandes" },
];

const categoryConfig: Record<string, { icon: any; color: string }> = {
  AGREEMENT: { icon: FileText, color: "text-blue-400 bg-blue-950/20 border-blue-500/15" },
  KYC: { icon: FolderLock, color: "text-amber-400 bg-amber-950/20 border-amber-500/15" },
  FLOORPLAN: { icon: Image, color: "text-emerald-400 bg-emerald-950/20 border-emerald-500/15" },
  BROCHURE: { icon: File, color: "text-brand-400 bg-brand-950/20 border-brand-500/15" },
  INVOICE: { icon: FileText, color: "text-purple-400 bg-purple-950/20 border-purple-500/15" },
};

export default function DocumentVault() {
  const { showToast } = useToast();
  const [docs, setDocs] = useState(initialDocs);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [uploadModal, setUploadModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Upload form
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("BROCHURE");

  const filtered = docs.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = catFilter === "ALL" || doc.category === catFilter;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName) return;
    const newDoc = {
      id: `DOC-${300 + docs.length + 1}`,
      name: uploadName.endsWith(".pdf") ? uploadName : `${uploadName}.pdf`,
      category: uploadCategory,
      size: `${(Math.random() * 10 + 1).toFixed(1)} MB`,
      date: new Date().toISOString().split("T")[0],
      author: "Rohan Deshmukh",
    };
    setDocs([newDoc, ...docs]);
    showToast(`"${newDoc.name}" uploaded to vault`, "success");
    setUploadModal(false);
    setUploadName("");
  };

  const handleDelete = (id: string) => {
    const doc = docs.find((d) => d.id === id);
    setDocs(docs.filter((d) => d.id !== id));
    showToast(`"${doc?.name}" removed from vault`, "warning");
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Document Vault</h2>
          <p className="text-xs text-gray-500 mt-1">
            Secure storage for brochures, floor plans, KYC files, SPAs, and invoices — {docs.length} files.
          </p>
        </div>
        <button onClick={() => setUploadModal(true)}
          className="bg-brand-600 hover:bg-brand-500 text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-500/10">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files by name or author..."
            className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 pl-9 pr-4 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/40" />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="bg-[#0c0e14] border border-[#151a26] rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none">
          <option value="ALL">All Categories</option>
          <option value="AGREEMENT">Agreements (SPAs)</option>
          <option value="KYC">KYC Documents</option>
          <option value="FLOORPLAN">Floor Plans</option>
          <option value="BROCHURE">Brochures</option>
          <option value="INVOICE">Invoices</option>
        </select>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((doc) => {
          const cat = categoryConfig[doc.category] || categoryConfig.BROCHURE;
          const CatIcon = cat.icon;
          return (
            <motion.div key={doc.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-4 rounded-2xl border border-[#111520] space-y-3 flex flex-col justify-between group">
              <div>
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${cat.color}`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-[11px] truncate leading-normal" title={doc.name}>
                  {doc.name}
                </h3>
                <div className="flex justify-between items-center mt-1.5 text-[9px] text-gray-600 font-semibold uppercase tracking-wider">
                  <span>{doc.category}</span>
                  <span>{doc.size}</span>
                </div>
                <p className="text-[9px] text-gray-600 mt-1">by {doc.author}</p>
              </div>

              <div className="border-t border-[#111520] pt-2.5 flex justify-between items-center text-xs text-gray-500">
                <span className="text-[9px]">{doc.date}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDeleteConfirm(doc.id)}
                    className="text-gray-700 hover:text-rose-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="text-brand-400 hover:text-brand-300 font-bold inline-flex items-center gap-1"
                    onClick={() => showToast(`Downloading "${doc.name}" from S3...`, "info")}>
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Download</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-600 py-16 text-xs">
          <FolderLock className="w-8 h-8 mx-auto mb-3 text-gray-700" />
          No documents found. Try adjusting your search or filter.
        </div>
      )}

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0b0f] border border-[#151a26] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
              <h3 className="font-bold text-white text-sm">Delete Document?</h3>
              <p className="text-xs text-gray-500">This action cannot be undone. The file will be permanently removed from the vault.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded-xl text-xs font-semibold">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setUploadModal(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-24 max-w-md mx-auto bg-[#0a0b0f] border border-[#151a26] z-50 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#111520] pb-3 mb-4">
                <h3 className="font-bold text-sm text-white">Upload Document</h3>
                <button onClick={() => setUploadModal(false)} className="text-gray-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleUpload} className="space-y-3">
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">File Name *</label>
                  <input type="text" required value={uploadName} onChange={(e) => setUploadName(e.target.value)}
                    placeholder="e.g. VTP_BlueWaters_T5_Brochure.pdf"
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" />
                </div>
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Category</label>
                  <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                    <option value="BROCHURE">Brochure</option>
                    <option value="FLOORPLAN">Floor Plan</option>
                    <option value="KYC">KYC Document</option>
                    <option value="AGREEMENT">Agreement (SPA)</option>
                    <option value="INVOICE">Invoice</option>
                  </select>
                </div>
                <div className="border-2 border-dashed border-[#151a26] rounded-xl p-6 text-center hover:border-brand-500/30 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-[10px] text-gray-600">Click to select file or drag & drop</p>
                  <p className="text-[9px] text-gray-700 mt-1">PDF, JPG, PNG up to 25MB</p>
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-[#111520]">
                  <button type="button" onClick={() => setUploadModal(false)} className="border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold">Upload to Vault</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
