"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building,
  Search,
  CheckCircle,
  Clock,
  Ban,
  BedDouble,
  Bath,
  Maximize,
  ExternalLink,
  Tag,
  Plus,
  X,
  MapPin,
  IndianRupee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../layout";
import {
  getStoredData,
  setStoredData,
  initialProperties,
} from "../../../lib/mock-data";

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  AVAILABLE: { label: "Available", bg: "bg-emerald-950/20 border-emerald-500/20", text: "text-emerald-400", icon: CheckCircle },
  RESERVED: { label: "Reserved", bg: "bg-amber-950/20 border-amber-500/20", text: "text-amber-400", icon: Clock },
  BOOKED: { label: "Booked", bg: "bg-orange-950/20 border-orange-500/20", text: "text-orange-400", icon: Tag },
  SOLD: { label: "Sold Out", bg: "bg-rose-950/20 border-rose-500/20", text: "text-rose-400", icon: Ban },
};

const formatPrice = (value: number) => {
  if (value >= 10000000) return `₹ ${(value / 10000000).toFixed(2)} Cr`;
  return `₹ ${(value / 100000).toFixed(0)} Lakhs`;
};

const allBuilders = initialProperties.map((p) => p.builder).filter((val, idx, self) => self.indexOf(val) === idx);
const allLocations = initialProperties.map((p) => p.location).filter((val, idx, self) => self.indexOf(val) === idx);

function PropertiesCatalogContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [builderFilter, setBuilderFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [reserveModal, setReserveModal] = useState<any | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [selectedProp, setSelectedProp] = useState<any | null>(null);

  // Add Property form
  const [newUnit, setNewUnit] = useState("");
  const [newFloor, setNewFloor] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newBuilder, setNewBuilder] = useState("VTP Realty");
  const [newLocation, setNewLocation] = useState("Hinjewadi Phase 1");
  const [newPrice, setNewPrice] = useState("");
  const [newBeds, setNewBeds] = useState("2");
  const [newBaths, setNewBaths] = useState("2");
  const [newSqft, setNewSqft] = useState("");

  useEffect(() => {
    const data = getStoredData("crm_properties", initialProperties);
    setProperties(data);

    // Deep link search parameter integration
    const querySearch = searchParams.get("search");
    if (querySearch) {
      const match = data.find((p: any) => p.unitNumber.toLowerCase().includes(querySearch.toLowerCase()) || p.project.toLowerCase().includes(querySearch.toLowerCase()));
      if (match) setSelectedProp(match);
    }
  }, [searchParams]);

  const savePropertiesToStorage = (updated: any[]) => {
    setProperties(updated);
    setStoredData("crm_properties", updated);
  };

  const handleReserve = (id: string) => {
    const updated = properties.map((p) => (p.id === id ? { ...p, status: "RESERVED" } : p));
    savePropertiesToStorage(updated);
    showToast(`Flat ${reserveModal.unitNumber} reserved — 48hr hold active`, "success");
    setReserveModal(null);
    setSelectedProp(null);
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const newProp = {
      id: `PROP-${900 + properties.length + 1}`,
      unitNumber: newUnit,
      floor: parseInt(newFloor) || 1,
      tower: "New Tower",
      project: newProject,
      builder: newBuilder,
      location: newLocation,
      status: "AVAILABLE",
      price: parseInt(newPrice) || 7000000,
      beds: parseInt(newBeds),
      baths: parseInt(newBaths),
      sqft: parseInt(newSqft) || 900,
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    };
    
    savePropertiesToStorage([newProp, ...properties]);
    showToast(`Property ${newUnit} added to inventory`, "success");
    setAddModal(false);
    setNewUnit(""); setNewFloor(""); setNewProject(""); setNewPrice(""); setNewSqft("");
  };

  const filtered = properties.filter((prop) => {
    const matchesSearch =
      prop.project.toLowerCase().includes(search.toLowerCase()) ||
      prop.tower.toLowerCase().includes(search.toLowerCase()) ||
      prop.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
      prop.location.toLowerCase().includes(search.toLowerCase());
    const matchesBuilder = builderFilter === "ALL" || prop.builder === builderFilter;
    const matchesStatus = statusFilter === "ALL" || prop.status === statusFilter;
    const matchesLocation = locationFilter === "ALL" || prop.location === locationFilter;
    return matchesSearch && matchesBuilder && matchesStatus && matchesLocation;
  });

  // Stats
  const available = properties.filter((p) => p.status === "AVAILABLE").length;
  const reserved = properties.filter((p) => p.status === "RESERVED").length;
  const sold = properties.filter((p) => p.status === "SOLD" || p.status === "BOOKED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Property Inventory</h2>
          <p className="text-xs text-gray-500 mt-1">
            2 & 3 BHK flats across Hinjewadi, Wakad, and Maan Gaon — {properties.length} total units.
          </p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="bg-brand-600 hover:bg-brand-500 text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-500/10"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-[#111520]">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/20 border border-emerald-500/15 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-gray-600 block uppercase font-semibold tracking-wider">Available</span>
            <span className="text-base font-extrabold text-white">{available}</span>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-[#111520]">
          <div className="w-8 h-8 rounded-lg bg-amber-950/20 border border-amber-500/15 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-gray-600 block uppercase font-semibold tracking-wider">Reserved</span>
            <span className="text-base font-extrabold text-white">{reserved}</span>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-[#111520]">
          <div className="w-8 h-8 rounded-lg bg-rose-950/20 border border-rose-500/15 flex items-center justify-center text-rose-400">
            <Ban className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-extrabold text-white">{sold}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-xl grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project, tower, unit, or location..."
            className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 pl-9 pr-4 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/40"
          />
        </div>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
          className="bg-[#0c0e14] border border-[#151a26] rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none">
          <option value="ALL">All Locations</option>
          {allLocations.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={builderFilter} onChange={(e) => setBuilderFilter(e.target.value)}
          className="bg-[#0c0e14] border border-[#151a26] rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none">
          <option value="ALL">All Builders</option>
          {allBuilders.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0c0e14] border border-[#151a26] rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none">
          <option value="ALL">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="SOLD">Sold</option>
        </select>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((prop) => {
          const status = statusConfig[prop.status] || statusConfig.AVAILABLE;
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl overflow-hidden border border-[#111520] flex flex-col group cursor-pointer"
              onClick={() => setSelectedProp(prop)}
            >
              <div className="h-40 relative overflow-hidden bg-gray-950">
                <img src={prop.coverImage} alt={prop.project}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${status.bg} ${status.text}`}>
                    <StatusIcon className="w-2.5 h-2.5" />
                    {status.label}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span className="text-[9px] bg-[#0a0b0f]/90 backdrop-blur text-gray-400 px-2 py-0.5 rounded font-semibold">
                    {prop.unitNumber}
                  </span>
                  <span className="text-[9px] bg-[#0a0b0f]/90 backdrop-blur text-brand-400 px-2 py-0.5 rounded font-semibold flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {prop.location}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[9px] font-semibold text-brand-400/80 tracking-wider uppercase">{prop.builder}</span>
                  <h3 className="font-bold text-white text-sm mt-0.5 truncate">{prop.project}</h3>
                  <p className="text-[10px] text-gray-600 mt-0.5 flex items-center gap-1">
                    <Building className="w-3 h-3" /> {prop.tower} · Floor {prop.floor}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 border-y border-[#111520] py-2.5 text-[10px] text-gray-500">
                  <div className="flex items-center gap-1 justify-center">
                    <BedDouble className="w-3.5 h-3.5 text-gray-700" />
                    {prop.beds} BHK
                  </div>
                  <div className="flex items-center gap-1 justify-center border-x border-[#111520]">
                    <Bath className="w-3.5 h-3.5 text-gray-700" />
                    {prop.baths} Bath
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <Maximize className="w-3.5 h-3.5 text-gray-700" />
                    {prop.sqft} sqft
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-gray-600 block font-semibold">ASKING PRICE</span>
                    <span className="text-sm font-extrabold text-white">{formatPrice(prop.price)}</span>
                  </div>
                </div>

                {prop.status === "AVAILABLE" ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); setReserveModal(prop); }}
                    className="w-full bg-[#0c0e14] hover:bg-brand-500 hover:text-black text-brand-400 border border-[#151a26] hover:border-brand-500 font-semibold py-2 rounded-xl text-xs transition-all"
                  >
                    Reserve / Hold
                  </button>
                ) : (
                  <button disabled className="w-full bg-[#0c0e14]/30 text-gray-700 border border-[#111520]/30 font-semibold py-2 rounded-xl text-xs cursor-not-allowed">
                    {prop.status === "SOLD" || prop.status === "BOOKED" ? "Sold Out" : "Reserved"}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-600 py-16 text-xs">
          <Building className="w-8 h-8 mx-auto mb-3 text-gray-700" />
          No properties match your filters. Try adjusting your search.
        </div>
      )}

      {/* Reserve Confirmation Modal */}
      <AnimatePresence>
        {reserveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0b0f] border border-[#151a26] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            >
              <h3 className="font-bold text-white text-sm">Reserve Flat {reserveModal.unitNumber}?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Reserving will block this flat for 48 hours. The agent must collect ₹2 Lakhs booking token before auto-release.
              </p>
              <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#151a26] text-xs text-gray-400 space-y-1.5">
                <div className="flex justify-between"><span>Builder:</span><span className="text-white font-semibold">{reserveModal.builder}</span></div>
                <div className="flex justify-between"><span>Location:</span><span className="text-white font-semibold">{reserveModal.location}</span></div>
                <div className="flex justify-between"><span>Value:</span><span className="text-white font-semibold">{formatPrice(reserveModal.price)}</span></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setReserveModal(null)} className="bg-transparent border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs">Cancel</button>
                <button onClick={() => handleReserve(reserveModal.id)} className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold">Confirm Hold</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Property Modal */}
      <AnimatePresence>
        {addModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setAddModal(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-16 max-w-lg mx-auto bg-[#0a0b0f] border border-[#151a26] z-50 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#111520] pb-3 mb-4">
                <h3 className="font-bold text-sm text-white">Add New Property Unit</h3>
                <button onClick={() => setAddModal(false)} className="text-gray-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddProperty} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Unit Number *</label>
                    <input type="text" required value={newUnit} onChange={(e) => setNewUnit(e.target.value)} placeholder="e.g. T5-2201"
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Floor *</label>
                    <input type="number" required value={newFloor} onChange={(e) => setNewFloor(e.target.value)} placeholder="e.g. 22"
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Project Name *</label>
                  <input type="text" required value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="e.g. VTP Blue Waters"
                    className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Builder</label>
                    <select value={newBuilder} onChange={(e) => setNewBuilder(e.target.value)}
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                      {allBuilders.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Location</label>
                    <select value={newLocation} onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                      {allLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Price (₹) *</label>
                    <input type="number" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="7500000"
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">BHK</label>
                    <select value={newBeds} onChange={(e) => setNewBeds(e.target.value)}
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none">
                      <option value="1">1 BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option><option value="4">4 BHK</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Sqft *</label>
                    <input type="number" required value={newSqft} onChange={(e) => setNewSqft(e.target.value)} placeholder="1050"
                      className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-500/40" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-[#111520]">
                  <button type="button" onClick={() => setAddModal(false)} className="border border-[#151a26] text-gray-500 px-4 py-2 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-black px-6 py-2 rounded-xl text-xs font-semibold">Add to Inventory</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Property Detail Slide-Over */}
      <AnimatePresence>
        {selectedProp && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProp(null)} className="fixed inset-0 z-40 bg-black/60" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              className="fixed top-0 bottom-0 right-0 w-full sm:w-[440px] bg-[#0a0b0f] border-l border-[#151a26] z-50 p-6 flex flex-col shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#111520] pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-600">{selectedProp.id}</span>
                  <h3 className="font-bold text-base text-white mt-1">{selectedProp.project}</h3>
                  <p className="text-xs text-brand-400 mt-0.5">{selectedProp.builder}</p>
                </div>
                <button onClick={() => setSelectedProp(null)} className="text-gray-500 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-48 rounded-xl overflow-hidden mb-4">
                <img src={selectedProp.coverImage} alt={selectedProp.project} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#151a26]">
                  <span className="text-[9px] text-gray-600 block">UNIT</span>
                  <span className="text-sm font-bold text-white">{selectedProp.unitNumber}</span>
                </div>
                <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#151a26]">
                  <span className="text-[9px] text-gray-600 block">FLOOR</span>
                  <span className="text-sm font-bold text-white">{selectedProp.floor}</span>
                </div>
                <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#151a26]">
                  <span className="text-[9px] text-gray-600 block">LOCATION</span>
                  <span className="text-xs font-bold text-brand-400">{selectedProp.location}</span>
                </div>
                <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#151a26]">
                  <span className="text-[9px] text-gray-600 block">STATUS</span>
                  <span className={`text-xs font-bold ${statusConfig[selectedProp.status]?.text || "text-white"}`}>{statusConfig[selectedProp.status]?.label || selectedProp.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4 border-y border-[#111520] py-4 text-xs text-gray-400">
                <div className="text-center"><BedDouble className="w-5 h-5 mx-auto mb-1 text-gray-600" />{selectedProp.beds} BHK</div>
                <div className="text-center"><Bath className="w-5 h-5 mx-auto mb-1 text-gray-600" />{selectedProp.baths} Bath</div>
                <div className="text-center"><Maximize className="w-5 h-5 mx-auto mb-1 text-gray-600" />{selectedProp.sqft} sqft</div>
              </div>
              <div className="mb-4">
                <span className="text-[9px] text-gray-600 block mb-1">ASKING PRICE</span>
                <span className="text-xl font-extrabold text-white">{formatPrice(selectedProp.price)}</span>
                <span className="text-[10px] text-gray-600 block mt-1">₹ {(selectedProp.price / selectedProp.sqft).toFixed(0)}/sqft carpet area</span>
              </div>
              {selectedProp.status === "AVAILABLE" && (
                <button
                  onClick={() => { setSelectedProp(null); setReserveModal(selectedProp); }}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-black py-3 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/10 mt-auto"
                >
                  Reserve This Flat
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PropertiesCatalog() {
  return (
    <Suspense fallback={<div className="text-center text-xs py-16 text-gray-600">Loading Properties...</div>}>
      <PropertiesCatalogContent />
    </Suspense>
  );
}
