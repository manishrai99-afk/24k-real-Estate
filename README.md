# 🚀 24K Realtors CRM — Professional Real Estate Agency SaaS

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-black?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-emerald?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=git)](LICENSE)

A high-fidelity, luxury-themed Real Estate Client Relationship Management (CRM) SaaS system optimized for agency operations in Pune's major real estate corridors (Hinjewadi, Wakad, Maan Gaon). This application provides end-to-end simulation of leads acquisition, site visits check-in, sales agreements, commission ledger distribution, campaign marketing simulations, and role-based permissions management.

---

## 🌐 Live Production Demo
Access the live production environment:  
👉 **[24k-real-estate-crm.vercel.app](https://24k-real-estate-crm.vercel.app)**

---

## ✨ Key Features & Product Modules

| Module | Description | High-Fidelity Integrations |
| :--- | :--- | :--- |
| **📊 Executive Dashboard** | Real-time KPI analysis (Leads, Active Deals, Pipeline Forecast, Revenue Forecast, Site Visit ratios) | Live Indian Standard Time (IST) Clock, interactive performance charts, and live agent leaderboards. |
| **👥 Leads CRM** | Central client intake with stage tracking (New, Contacted, Follow-up, Site Visit, Negotiation, Booked, Lost). | Dynamic Notes timeline feed, pre-filled visits scheduler, deal forms, and agent-assignment modals. |
| **🏢 Properties Inventory** | Visual showcase of 12 premium units (VTP, Godrej, Kasturi) with location/status selectors. | Reservation lock simulation and detailed slide-over info catalogs. |
| **🚗 GPS Site Visits** | Real-time scheduler for coordinating on-site property visits. | Dropdown selectors, automatic Hinjewadi/Wakad location lookups, and mock mobile GPS check-ins. |
| **🤝 Deals Pipeline** | Automated contract values, booking token tracking, and structured construction milestones. | Advancing deal stages automatically updates matching client pipeline statuses inside the Leads CRM. |
| **💰 Commissions Ledger** | Brokerage accounting splits (builder, agent, and agency shares) with real-time approval pipelines. | Multi-agent approval steps with role-gated buttons (Super Admin, Sales Manager). |
| **💬 Communications Hub** | Live contact logger supporting WhatsApp templates, SMS, and Corporate Email. | Preset response templates (Brochure, SRO Wakad Address, Token Transfer bank info) that auto-fill text inputs. |
| **📈 Marketing Analytics** | Tracking of live campaigns (Google Ads, Facebook, Instagram, Portals) and ROI calculators. | Interactive "Simulate Activity" panel to generate traffic, spent budget, and real-time Cost Per Lead (CPL) updates. |
| **🔒 Settings Matrix** | Tenant details, corporate parameters (GSTIN), user accounts list, and RBAC matrix. | Dynamic Role-Based Access Control matrix (Super Admin, Admin, Manager, Agent) affecting page permissions. |

---

## 🛠️ Technical Stack & Architecture

- **Framework**: [Next.js 15.5](https://nextjs.org/) (using App Router, Server Actions, and client-side page transitions).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a curated HSL glassmorphism theme (deep charcoal backgrounds, golden-brand accent gradients).
- **Icons & Animations**: [Lucide React](https://lucide.dev/) icons and [Framer Motion](https://www.framer.com/motion/) for fluid, premium micro-animations.
- **ORM & Database**: [Prisma ORM](https://www.prisma.io/) with a PostgreSQL schema file ready for DB sync. (Demo runs on a robust `localStorage` synchronization layer for immediate visual persistence).
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) configuration handles route isolation and role restrictions.

---

## ⚙️ Local Development Setup

To run this project locally, ensure you have [Node.js (v18+)](https://nodejs.org/) installed:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/manishrai99-afk/24k-real-Estate.git
   cd 24k-real-Estate
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables**:  
   Create a `.env` file in the root directory and copy values from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

6. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🤝 Contributing

Contributions to improve 24K Realtors CRM are welcome! Please follow these steps:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.
