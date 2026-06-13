"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Phone,
  Mail,
  MessageSquare,
  CheckCheck,
  Plus,
  X,
  Filter,
  Search,
  BookOpen,
  MapPin,
  FileText,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../layout";
import {
  getStoredData,
  setStoredData,
  initialChats,
} from "../../../lib/mock-data";

const channelConfig: Record<string, { bg: string; text: string; label: string }> = {
  WHATSAPP: { bg: "bg-emerald-950/20", text: "text-emerald-400", label: "WhatsApp" },
  EMAIL: { bg: "bg-blue-950/20", text: "text-blue-400", label: "Email" },
  SMS: { bg: "bg-purple-950/20", text: "text-purple-400", label: "SMS" },
};

// Response Templates
const quickTemplates = [
  { id: "temp-1", label: "Send Brochure", icon: BookOpen, text: "Hi {Name}, sharing the project e-brochure as requested. Let me know when we can arrange a site visit." },
  { id: "temp-2", label: "Send Floorplan", icon: FileText, text: "Hello {Name}, sharing the floor plans for Godrej 24 TB-1602. It has an East-facing balcony." },
  { id: "temp-3", label: "SRO Office", icon: MapPin, text: "Here is the Sub-Registrar Office (SRO) Wakad address location coordinates: https://maps.google.com/?q=SRO+Wakad+Pune" },
  { id: "temp-4", label: "Token Transfer", icon: CreditCard, text: "Dear {Name}, to confirm your flat holding token, please wire ₹2,00,000 to the 24K Realtors bank account. Sharing details: ICICI Bank Hinjewadi, IFSC ICIC0001234." },
];

export default function CommunicationHub() {
  const { showToast } = useToast();
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const data = getStoredData("crm_chats", initialChats);
    setChats(data);
    if (data.length > 0) setActiveChat(data[0]);
  }, []);

  const saveChatsToStorage = (updated: any[]) => {
    setChats(updated);
    setStoredData("crm_chats", updated);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;

    const newMsg = { sender: "Agent (You)", text: replyText, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) };
    const updatedHistory = [...activeChat.history, newMsg];
    
    const updatedChat = {
      ...activeChat,
      lastMessage: replyText,
      time: "Just now",
      history: updatedHistory,
      unread: false,
    };

    const updatedChats = chats.map((c) => (c.id === activeChat.id ? updatedChat : c));
    saveChatsToStorage(updatedChats);
    setActiveChat(updatedChat);
    setReplyText("");
    showToast(`Message sent to ${activeChat.client}`, "success");
  };

  const selectTemplate = (templateText: string) => {
    if (!activeChat) return;
    const resolvedText = templateText.replace("{Name}", activeChat.client.split(" ")[0]);
    setReplyText(resolvedText);
    showToast("Template loaded into editor", "info");
  };

  const filteredChats = chats.filter((c) => {
    const matchesChannel = channelFilter === "ALL" || c.channel === channelFilter;
    const matchesSearch = c.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const unreadTotal = chats.filter((c) => c.unread).length;

  if (!activeChat) {
    return <div className="text-center py-16 text-xs text-gray-600">Loading Chats...</div>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Communication Hub</h2>
        <p className="text-xs text-gray-500 mt-1">
          WhatsApp Business, Email, and SMS conversations with prospects and clients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[600px] items-stretch">
        {/* Chat List */}
        <div className="lg:col-span-1 bg-[#08090c] border border-[#111520] rounded-2xl p-4 flex flex-col space-y-3 overflow-hidden">
          {/* Chat List Header */}
          <div className="flex justify-between items-center pb-2 border-b border-[#111520]">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Conversations</h3>
            <span className="w-5 h-5 rounded-full bg-brand-500 text-black font-bold text-[9px] flex items-center justify-center">
              {unreadTotal}
            </span>
          </div>

          {/* Search + Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." className="w-full bg-[#0c0e14] border border-[#151a26] rounded-lg py-1.5 pl-7 pr-2 text-[10px] text-gray-300 placeholder-gray-600 focus:outline-none" />
            </div>
            <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-[#0c0e14] border border-[#151a26] rounded-lg py-1.5 px-2 text-[10px] text-gray-300 focus:outline-none">
              <option value="ALL">All</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
            </select>
          </div>

          {/* Chat List Items */}
          <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
            {filteredChats.map((chat) => {
              const ch = channelConfig[chat.channel];
              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat);
                    const updated = chats.map((c) => (c.id === chat.id ? { ...c, unread: false } : c));
                    saveChatsToStorage(updated);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    activeChat.id === chat.id
                      ? "bg-[#0f1117] border border-brand-500/15"
                      : "border border-transparent hover:bg-[#0c0e14]"
                  }`}
                >
                  <div className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-2">
                      {chat.unread && <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />}
                      <span className={`font-semibold ${chat.unread ? "text-white" : "text-gray-400"} truncate`}>{chat.client}</span>
                    </div>
                    <span className="text-[9px] text-gray-600 shrink-0">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[10px] text-gray-600 truncate w-40">{chat.lastMessage}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold ${ch.bg} ${ch.text}`}>
                      {ch.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Chat Panel */}
        <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col overflow-hidden border border-[#111520]">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#111520] bg-[#08090c] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-950/25 border border-brand-500/15 flex items-center justify-center text-brand-400 font-bold text-xs">
                {activeChat.client.split(" ")[0][0]}{activeChat.client.split(" ")[1]?.[0] || ""}
              </div>
              <div>
                <h4 className="font-bold text-white text-xs leading-none">{activeChat.client}</h4>
                <span className="text-[10px] text-gray-600 mt-0.5 block">
                  {activeChat.phone} · {channelConfig[activeChat.channel].label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-[#0f1117] transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-[#0f1117] transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#060709]/50">
            {activeChat.history.map((msg: any, idx: number) => {
              const isAgent = msg.sender.includes("Agent") || msg.sender.includes("System");
              return (
                <div key={idx} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-xs space-y-1 ${
                    isAgent
                      ? "bg-brand-950/25 border border-brand-500/10 text-white rounded-tr-sm"
                      : "bg-[#0c0e14] border border-[#151a26] text-gray-300 rounded-tl-sm"
                  }`}>
                    <span className="text-[9px] text-gray-600 font-semibold block">{msg.sender}</span>
                    <p className="leading-relaxed">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-[8px] text-gray-600">{msg.time}</span>
                      {isAgent && <CheckCheck className="w-3 h-3 text-blue-400" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick reply templates row */}
          <div className="px-4 py-2 border-t border-[#111520]/60 bg-[#07080c] flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider self-center mr-1">Templates:</span>
            {quickTemplates.map((t) => {
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => selectTemplate(t.text)}
                  className="bg-[#0c0e14] hover:bg-[#121520] border border-[#181d2a] text-gray-400 px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all shrink-0 hover:text-white"
                >
                  <IconComp className="w-3 h-3 text-brand-400" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#111520] bg-[#08090c] flex gap-2">
            <input
              type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${activeChat.client.split(" ")[0]}...`}
              className="flex-1 bg-[#0c0e14] border border-[#151a26] rounded-xl px-4 py-2.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/40"
            />
            <button type="submit"
              className="bg-brand-600 hover:bg-brand-500 text-black p-2.5 rounded-xl shadow-lg shadow-brand-500/10 transition-all active:scale-95">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
