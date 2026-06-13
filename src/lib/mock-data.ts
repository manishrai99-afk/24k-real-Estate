// Shared mock data repository for 24K Realtors CRM

export interface Agent {
  name: string;
  sales: number;
  deals: number;
  avatar: string;
  role: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: string;
  budget: number;
  project: string;
  agent: string;
  prefLocation: string;
  createdAt: string;
  notes?: { staff: string; text: string; date: string }[];
}

export interface Property {
  id: string;
  unitNumber: string;
  floor: number;
  tower: string;
  project: string;
  builder: string;
  location: string;
  status: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  coverImage: string;
}

export interface SiteVisit {
  id: string;
  leadName: string;
  agentName: string;
  propertyUnit: string;
  location: string;
  scheduledAt: string;
  status: string;
  gpsCheckIn: { lat: number; lng: number; checkInTime: string; distanceMeters: number } | null;
  notes: string;
  outcome: string;
}

export interface Deal {
  id: string;
  leadName: string;
  propertyUnit: string;
  project: string;
  builder: string;
  agent: string;
  bookingAmount: number;
  totalValue: number;
  status: string;
  milestones: { id: number; name: string; amount: number; status: string; date: string }[];
}

export interface Commission {
  id: string;
  dealId: string;
  unit: string;
  builder: string;
  agent: string;
  totalContract: number;
  agentComm: number;
  teamComm: number;
  builderComm: number;
  status: string;
  approvals: { name: string; role: string; status: string; date: string | null }[];
}

export interface Campaign {
  id: string;
  name: string;
  source: string;
  spent: number;
  leads: number;
  bookings: number;
  sales: number;
  status: string;
  startDate: string;
}

export interface Document {
  id: string;
  name: string;
  category: string;
  size: string;
  date: string;
  author: string;
}

export const activeAgents: Agent[] = [
  { name: "Rohan Deshmukh", sales: 42000000, deals: 12, avatar: "RD", role: "SUPER_ADMIN" },
  { name: "Priya Sharma", sales: 28500000, deals: 8, avatar: "PS", role: "AGENT" },
  { name: "Rahul Shinde", sales: 19500000, deals: 5, avatar: "RS", role: "AGENT" },
  { name: "Amit Kulkarni", sales: 13500000, deals: 3, avatar: "AK", role: "AGENT" },
  { name: "Sarah Fernandes", sales: 7800000, deals: 1, avatar: "SF", role: "AGENT" },
];

export const initialProperties: Property[] = [
  {
    id: "PROP-901", unitNumber: "TB-1602", floor: 16,
    tower: "Tower B", project: "Godrej 24", builder: "Godrej Properties",
    location: "Hinjewadi Phase 1", status: "SOLD",
    price: 9500000, beds: 3, baths: 3, sqft: 1180,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-902", unitNumber: "A-502", floor: 5,
    tower: "Tower A", project: "Godrej 24", builder: "Godrej Properties",
    location: "Hinjewadi Phase 1", status: "SOLD",
    price: 6800000, beds: 2, baths: 2, sqft: 790,
    coverImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-903", unitNumber: "C-2201", floor: 22,
    tower: "Cluster C", project: "Kasturi EON Homes", builder: "Kasturi Builders",
    location: "Hinjewadi Phase 3", status: "AVAILABLE",
    price: 13500000, beds: 3, baths: 3, sqft: 1450,
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-904", unitNumber: "B-1105", floor: 11,
    tower: "Cluster B", project: "Kasturi EON Homes", builder: "Kasturi Builders",
    location: "Hinjewadi Phase 3", status: "AVAILABLE",
    price: 11800000, beds: 3, baths: 2, sqft: 1280,
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-905", unitNumber: "T4-1204", floor: 12,
    tower: "Building T4", project: "VTP Blue Waters", builder: "VTP Realty",
    location: "Wakad", status: "AVAILABLE",
    price: 7800000, beds: 2, baths: 2, sqft: 810,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-906", unitNumber: "T4-1804", floor: 18,
    tower: "Building T4", project: "VTP Blue Waters", builder: "VTP Realty",
    location: "Wakad", status: "AVAILABLE",
    price: 8800000, beds: 3, baths: 2, sqft: 1050,
    coverImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-907", unitNumber: "LR-A-704", floor: 7,
    tower: "Tower A", project: "Kolte Patil Life Republic", builder: "Kolte Patil",
    location: "Wakad", status: "AVAILABLE",
    price: 7200000, beds: 2, baths: 2, sqft: 850,
    coverImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-908", unitNumber: "LR-B-1501", floor: 15,
    tower: "Tower B", project: "Kolte Patil Life Republic", builder: "Kolte Patil",
    location: "Wakad", status: "RESERVED",
    price: 9200000, beds: 3, baths: 3, sqft: 1190,
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-909", unitNumber: "JV-C-302", floor: 3,
    tower: "Tower C", project: "Shapoorji Pallonji Joyville", builder: "Shapoorji Pallonji",
    location: "Maan Gaon", status: "AVAILABLE",
    price: 5800000, beds: 2, baths: 2, sqft: 780,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-910", unitNumber: "JV-A-1802", floor: 18,
    tower: "Tower A", project: "Shapoorji Pallonji Joyville", builder: "Shapoorji Pallonji",
    location: "Maan Gaon", status: "AVAILABLE",
    price: 7500000, beds: 3, baths: 2, sqft: 1020,
    coverImage: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-911", unitNumber: "PL-D-901", floor: 9,
    tower: "Tower D", project: "Pristine Prolife", builder: "Pristine Properties",
    location: "Maan Gaon", status: "AVAILABLE",
    price: 6500000, beds: 2, baths: 2, sqft: 870,
    coverImage: "https://images.unsplash.com/photo-1600573472591-ee6981cf81f6?w=600&h=400&fit=crop",
  },
  {
    id: "PROP-912", unitNumber: "PL-A-2001", floor: 20,
    tower: "Tower A", project: "Pristine Prolife", builder: "Pristine Properties",
    location: "Maan Gaon", status: "SOLD",
    price: 8900000, beds: 3, baths: 3, sqft: 1150,
    coverImage: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&h=400&fit=crop",
  },
];

export const initialLeads: Lead[] = [
  {
    id: "LD-101", name: "Ramesh Nair", phone: "+91 98220 98765", email: "ramesh.nair@infosys.com",
    source: "GOOGLE_ADS", status: "SITE_VISIT", budget: 8500000, project: "VTP Blue Waters",
    agent: "Rahul Shinde", prefLocation: "Wakad", createdAt: "2026-06-11",
    notes: [
      { staff: "Sarah Fernandes", text: "Software engineer at Infosys Hinjewadi. Looking for immediate booking in VTP Blue Waters.", date: "2026-06-11 at 10:35 AM" },
      { staff: "Rahul Shinde", text: "Scheduled site visit for Tower T4 flat 1204.", date: "2026-06-11 at 10:40 AM" }
    ]
  },
  {
    id: "LD-102", name: "Priya Deshmukh", phone: "+91 96730 00053", email: "priya.d@tcs.com",
    source: "PROPERTY_FINDER", status: "NEGOTIATION", budget: 14000000, project: "Kasturi EON Homes",
    agent: "Priya Sharma", prefLocation: "Hinjewadi Phase 3", createdAt: "2026-06-10",
    notes: [
      { staff: "Priya Sharma", text: "Wants a luxury 3 BHK in Kasturi EON Homes. Negotiation on payment plan is active.", date: "2026-06-10 at 08:15 AM" }
    ]
  },
  {
    id: "LD-103", name: "Amit Patel", phone: "+91 91580 44332", email: "apatel@wipro.com",
    source: "FACEBOOK_ADS", status: "NEW", budget: 7000000, project: "VTP Blue Waters",
    agent: "Rahul Shinde", prefLocation: "Wakad", createdAt: "2026-06-12",
    notes: [
      { staff: "Sarah Fernandes", text: "Lead captured via Hinjewadi 2 BHK Facebook Lead Form.", date: "2026-06-12 at 09:30 AM" }
    ]
  },
  {
    id: "LD-104", name: "Suhas Kulkarni", phone: "+91 94220 33445", email: "suhas.k@persistent.com",
    source: "REFERRALS", status: "FOLLOW_UP", budget: 9500000, project: "Godrej 24",
    agent: "Amit Kulkarni", prefLocation: "Hinjewadi Phase 1", createdAt: "2026-06-09",
    notes: [
      { staff: "Amit Kulkarni", text: "Persistent Systems manager. Comparing 2BHK and 3BHK options.", date: "2026-06-09 at 11:00 AM" }
    ]
  },
  {
    id: "LD-105", name: "Nilesh Patil", phone: "+91 77200 88990", email: "npatil@cognizant.com",
    source: "ORGANIC_SEO", status: "CONTACTED", budget: 8200000, project: "Shapoorji Joyville",
    agent: "Priya Sharma", prefLocation: "Maan Gaon", createdAt: "2026-06-08",
    notes: [
      { staff: "Priya Sharma", text: "Cognizant engineer. Budget-conscious buyer interested in Maan Gaon.", date: "2026-06-08 at 02:00 PM" }
    ]
  },
  {
    id: "LD-106", name: "Deepali Joshi", phone: "+91 98900 11223", email: "deepali.j@techmahindra.com",
    source: "BAYUT", status: "BOOKED", budget: 13500000, project: "Kasturi EON Homes",
    agent: "Priya Sharma", prefLocation: "Hinjewadi Phase 3", createdAt: "2026-06-05",
    notes: [
      { staff: "Priya Sharma", text: "Tech Mahindra team lead. Client liked the show flat. Confirmed booking.", date: "2026-06-05 at 04:30 PM" }
    ]
  },
  {
    id: "LD-107", name: "Vikas Sawant", phone: "+91 90110 55667", email: "vikas.s@accenture.com",
    source: "GOOGLE_ADS", status: "NEW", budget: 6500000, project: "Pristine Prolife",
    agent: "Amit Kulkarni", prefLocation: "Maan Gaon", createdAt: "2026-06-13",
    notes: []
  },
  {
    id: "LD-108", name: "Sneha Bhosale", phone: "+91 88050 22334", email: "sneha.b@infosys.com",
    source: "INSTAGRAM", status: "LOST", budget: 7500000, project: "Kolte Patil Life Republic",
    agent: "Sarah Fernandes", prefLocation: "Wakad", createdAt: "2026-06-02",
    notes: [
      { staff: "Sarah Fernandes", text: "Client postponed plans to next year.", date: "2026-06-02 at 05:00 PM" }
    ]
  },
];

export const initialVisits: SiteVisit[] = [
  { id: "SV-401", leadName: "Ramesh Nair", agentName: "Rahul Shinde", propertyUnit: "VTP Blue Waters T4-1204", location: "Wakad", scheduledAt: "2026-06-15T14:30", status: "SCHEDULED", gpsCheckIn: null, notes: "Infosys employee. Wants to check balcony riverside view.", outcome: "" },
  { id: "SV-402", leadName: "Priya Deshmukh", agentName: "Priya Sharma", propertyUnit: "Kasturi EON Homes C-2201", location: "Hinjewadi Phase 3", scheduledAt: "2026-06-12T11:00", status: "COMPLETED", gpsCheckIn: { lat: 18.5912, lng: 73.7402, checkInTime: "2026-06-12T10:55", distanceMeters: 14 }, notes: "TCS Lead. Client liked the flat. Requested payment schedule.", outcome: "Positive — moving to negotiation" },
  { id: "SV-403", leadName: "Suhas Kulkarni", agentName: "Amit Kulkarni", propertyUnit: "Godrej 24 TB-1602", location: "Hinjewadi Phase 1", scheduledAt: "2026-06-14T10:00", status: "CONFIRMED", gpsCheckIn: null, notes: "Referral lead. Wants to compare 2BHK and 3BHK pricing.", outcome: "" },
  { id: "SV-404", leadName: "Nilesh Patil", agentName: "Priya Sharma", propertyUnit: "Shapoorji Joyville JV-C-302", location: "Maan Gaon", scheduledAt: "2026-06-16T16:00", status: "SCHEDULED", gpsCheckIn: null, notes: "Cognizant employee. First-time buyer. Budget-conscious.", outcome: "" },
  { id: "SV-405", leadName: "Vikas Sawant", agentName: "Amit Kulkarni", propertyUnit: "Pristine Prolife PL-D-901", location: "Maan Gaon", scheduledAt: "2026-06-17T11:30", status: "SCHEDULED", gpsCheckIn: null, notes: "Accenture. Looking for 2BHK as investment property.", outcome: "" },
  { id: "SV-406", leadName: "Sneha Bhosale", agentName: "Sarah Fernandes", propertyUnit: "Kolte Patil LR-A-704", location: "Wakad", scheduledAt: "2026-06-10T09:00", status: "CANCELLED", gpsCheckIn: null, notes: "Client rescheduled due to personal commitments.", outcome: "Cancelled — will reschedule" },
];

export const initialDeals: Deal[] = [
  { id: "DL-0021", leadName: "Priya Deshmukh", propertyUnit: "Godrej 24 TB-1602", project: "Godrej 24", builder: "Godrej Properties", agent: "Priya Sharma", bookingAmount: 200000, totalValue: 9500000, status: "CLOSURE",
    milestones: [ { id: 1, name: "10% Booking Token", amount: 950000, status: "PAID", date: "2026-06-12" }, { id: 2, name: "40% Slab Construction", amount: 3800000, status: "PENDING", date: "2026-10-15" }, { id: 3, name: "50% Registration & Possession", amount: 4750000, status: "PENDING", date: "2027-02-28" } ] },
  { id: "DL-0022", leadName: "Ramesh Nair", propertyUnit: "VTP Blue Waters T4-1204", project: "VTP Blue Waters", builder: "VTP Realty", agent: "Rahul Shinde", bookingAmount: 200000, totalValue: 7800000, status: "AGREEMENT",
    milestones: [ { id: 1, name: "10% Booking Token", amount: 78000, status: "PAID", date: "2026-06-11" }, { id: 2, name: "90% Possession", amount: 7020000, status: "PENDING", date: "2026-11-01" } ] },
  { id: "DL-0023", leadName: "Deepali Joshi", propertyUnit: "Kasturi EON C-2201", project: "Kasturi EON Homes", builder: "Kasturi Builders", agent: "Priya Sharma", bookingAmount: 200000, totalValue: 13500000, status: "BOOKING",
    milestones: [ { id: 1, name: "Booking Token ₹2L", amount: 200000, status: "PAID", date: "2026-06-05" }, { id: 2, name: "10% Down Payment", amount: 1350000, status: "PENDING", date: "2026-07-15" }, { id: 3, name: "Balance Possession", amount: 11950000, status: "PENDING", date: "2027-06-01" } ] },
  { id: "DL-0024", leadName: "Suhas Kulkarni", propertyUnit: "Godrej 24 B-1105", project: "Godrej 24", builder: "Godrej Properties", agent: "Amit Kulkarni", bookingAmount: 150000, totalValue: 11800000, status: "NEGOTIATION",
    milestones: [ { id: 1, name: "Intent Token", amount: 150000, status: "PAID", date: "2026-06-13" } ] },
];

export const initialCampaigns: Campaign[] = [
  { id: "MKT-01", name: "Google Hinjewadi 2/3BHK Ads", source: "GOOGLE_ADS", spent: 125000, leads: 140, bookings: 3, sales: 25000000, status: "ACTIVE", startDate: "2026-04-01" },
  { id: "MKT-02", name: "Facebook Wakad Premium Flats", source: "FACEBOOK_ADS", spent: 85000, leads: 280, bookings: 2, sales: 11600000, status: "ACTIVE", startDate: "2026-03-15" },
  { id: "MKT-03", name: "Instagram Maan Gaon Township", source: "INSTAGRAM", spent: 65000, leads: 190, bookings: 1, sales: 4500000, status: "PAUSED", startDate: "2026-05-01" },
  { id: "MKT-04", name: "Housing.com + 99acres SEO", source: "ORGANIC_SEO", spent: 15000, leads: 110, bookings: 4, sales: 18500000, status: "ACTIVE", startDate: "2026-01-01" },
  { id: "MKT-05", name: "WhatsApp Referral Campaign", source: "REFERRALS", spent: 8000, leads: 45, bookings: 2, sales: 9200000, status: "ENDED", startDate: "2026-02-01" },
];

export const initialDocs: Document[] = [
  { id: "DOC-301", name: "Godrej_24_TB1602_SPA_Draft.pdf", category: "AGREEMENT", size: "2.4 MB", date: "2026-06-12", author: "Priya Sharma" },
  { id: "DOC-302", name: "Ramesh_Nair_KYC_Passport.pdf", category: "KYC", size: "1.1 MB", date: "2026-06-11", author: "Rahul Shinde" },
  { id: "DOC-303", name: "VTP_BlueWaters_T4_Floorplans.pdf", category: "FLOORPLAN", size: "8.5 MB", date: "2026-06-08", author: "VTP Realty (Synced)" },
  { id: "DOC-304", name: "Kasturi_EON_Homes_Brochure.pdf", category: "BROCHURE", size: "12.2 MB", date: "2026-06-05", author: "Kasturi Builders" },
  { id: "DOC-305", name: "Kolte_Patil_LifeRepublic_PriceList.pdf", category: "BROCHURE", size: "4.8 MB", date: "2026-06-03", author: "Amit Kulkarni" },
  { id: "DOC-306", name: "Deepali_Joshi_AadhaarKYC.pdf", category: "KYC", size: "0.8 MB", date: "2026-06-01", author: "Priya Sharma" },
  { id: "DOC-307", name: "Shapoorji_Joyville_MaanGaon_Layout.pdf", category: "FLOORPLAN", size: "6.3 MB", date: "2026-05-28", author: "Shapoorji Pallonji" },
  { id: "DOC-308", name: "Commission_Invoice_June2026.pdf", category: "INVOICE", size: "0.5 MB", date: "2026-06-10", author: "Sarah Fernandes" },
];

export const initialLedger: Commission[] = [
  { id: "COM-701", dealId: "DL-0021", unit: "Godrej 24 TB-1602", builder: "Godrej Properties", agent: "Priya Sharma", totalContract: 9500000, agentComm: 118750, teamComm: 11875, builderComm: 237500, status: "PENDING_APPROVAL",
    approvals: [ { name: "Sarah Fernandes", role: "Sales Manager", status: "APPROVED", date: "2026-06-12" }, { name: "Rohan Deshmukh", role: "Admin", status: "PENDING", date: null } ] },
  { id: "COM-702", dealId: "DL-0022", unit: "VTP Blue Waters T4-1204", builder: "VTP Realty", agent: "Rahul Shinde", totalContract: 7800000, agentComm: 78000, teamComm: 7800, builderComm: 156000, status: "PAID",
    approvals: [ { name: "Sarah Fernandes", role: "Sales Manager", status: "APPROVED", date: "2026-06-11" }, { name: "Rohan Deshmukh", role: "Admin", status: "APPROVED", date: "2026-06-12" } ] },
  { id: "COM-703", dealId: "DL-0023", unit: "Kasturi EON C-2201", builder: "Kasturi Builders", agent: "Priya Sharma", totalContract: 13500000, agentComm: 168750, teamComm: 16875, builderComm: 337500, status: "PENDING_APPROVAL",
    approvals: [ { name: "Sarah Fernandes", role: "Sales Manager", status: "PENDING", date: null }, { name: "Rohan Deshmukh", role: "Admin", status: "PENDING", date: null } ] },
  { id: "COM-704", dealId: "DL-0024", unit: "Godrej 24 B-1105", builder: "Godrej Properties", agent: "Amit Kulkarni", totalContract: 11800000, agentComm: 147500, teamComm: 14750, builderComm: 295000, status: "APPROVED",
    approvals: [ { name: "Sarah Fernandes", role: "Sales Manager", status: "APPROVED", date: "2026-06-13" }, { name: "Rohan Deshmukh", role: "Admin", status: "APPROVED", date: "2026-06-13" } ] },
];
export interface Chat {
  id: string;
  client: string;
  channel: "WHATSAPP" | "EMAIL" | "SMS";
  lastMessage: string;
  time: string;
  unread: boolean;
  history: { sender: string; text: string; time: string }[];
}

export const initialChats: Chat[] = [
  {
    id: "chat-1",
    client: "Ramesh Nair",
    channel: "WHATSAPP",
    lastMessage: "Balcony riverside view details needed.",
    time: "10:45 AM",
    unread: true,
    history: [
      { sender: "Client (Ramesh)", text: "Hi, interested in VTP Blue Waters.", time: "10:30 AM" },
      { sender: "Agent (You)", text: "Hello Ramesh, I have scheduled a site visit for you this weekend.", time: "10:40 AM" },
      { sender: "Client (Ramesh)", text: "Thanks. Please share if balcony riverside view details are available.", time: "10:45 AM" }
    ]
  },
  {
    id: "chat-2",
    client: "Priya Deshmukh",
    channel: "EMAIL",
    lastMessage: "Draft Agreement reviewed, payment schedule is acceptable.",
    time: "Yesterday",
    unread: false,
    history: [
      { sender: "Agent (You)", text: "Hi Priya, sharing the Draft SPA Agreement for Godrej 24 TB-1602.", time: "09:15 AM" },
      { sender: "Client (Priya)", text: "Draft Agreement reviewed, payment schedule is acceptable.", time: "04:30 PM" }
    ]
  },
  {
    id: "chat-3",
    client: "Amit Patel",
    channel: "SMS",
    lastMessage: "Sure, let's meet at 11 AM.",
    time: "2 days ago",
    unread: false,
    history: [
      { sender: "Agent (You)", text: "Hello Amit, would you like to schedule a call for Wakad projects?", time: "02:00 PM" },
      { sender: "Client (Amit)", text: "Sure, let's meet at 11 AM.", time: "02:15 PM" }
    ]
  }
];

export function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom event so other components on same page know they need to refresh
    window.dispatchEvent(new Event("crm-state-update"));
  }
}
