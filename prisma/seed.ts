import { PrismaClient, UserRole, LeadStatus, LeadSource, PropertyStatus, VisitStatus, DealStatus, CommissionStatus, CommChannel } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.auditLog.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.communicationLog.deleteMany({});
  await prisma.commission.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.siteVisit.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.tower.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.builder.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tenant.deleteMany({});

  console.log("Seeding started...");

  // 1. Create Tenant (24K Realtors)
  const tenant = await prisma.tenant.create({
    data: {
      name: "24K Realtors Pune",
      subdomain: "24krealtors",
      logoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=100&fit=crop",
    },
  });

  // Hashed password for mock users: "Password123"
  const passwordHash = await bcrypt.hash("Password123", 10);

  // 2. Create Users for 24K Realtors
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@24krealtors.com",
      passwordHash,
      name: "Rohan Deshmukh",
      role: UserRole.SUPER_ADMIN,
      phone: "+91 9673000053",
      tenantId: tenant.id,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "support@24krealtors.com",
      passwordHash,
      name: "Pratik Patil",
      role: UserRole.ADMIN,
      phone: "+91 96730 00054",
      tenantId: tenant.id,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@24krealtors.com",
      passwordHash,
      name: "Sarah Fernandes",
      role: UserRole.SALES_MANAGER,
      phone: "+91 98220 12345",
      tenantId: tenant.id,
    },
  });

  const teamLeader = await prisma.user.create({
    data: {
      email: "leader@24krealtors.com",
      passwordHash,
      name: "Amit Kulkarni",
      role: UserRole.TEAM_LEADER,
      phone: "+91 91580 55555",
      tenantId: tenant.id,
    },
  });

  const agent1 = await prisma.user.create({
    data: {
      email: "agent1@24krealtors.com",
      passwordHash,
      name: "Rahul Shinde",
      role: UserRole.AGENT,
      phone: "+91 96730 11111",
      tenantId: tenant.id,
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      email: "agent2@24krealtors.com",
      passwordHash,
      name: "Priya Sharma",
      role: UserRole.AGENT,
      phone: "+91 96730 22222",
      tenantId: tenant.id,
    },
  });

  // Create Team
  const teamWest = await prisma.team.create({
    data: {
      name: "Pune West Flat Sales Team",
      leaderId: teamLeader.id,
      tenantId: tenant.id,
    },
  });

  await prisma.user.update({ where: { id: agent1.id }, data: { teamId: teamWest.id } });
  await prisma.user.update({ where: { id: agent2.id }, data: { teamId: teamWest.id } });
  await prisma.user.update({ where: { id: teamLeader.id }, data: { teamId: teamWest.id } });

  // 3. Create Builders in Pune
  const vtp = await prisma.builder.create({
    data: {
      name: "VTP Realty",
      contactEmail: "sales@vtprealty.in",
      contactPhone: "+91 20 6688 8888",
      companyDetails: {
        registrationNumber: "PR-VTP-9921",
        address: "VTP House, Bhandarkar Road, Pune, Maharashtra",
      },
      commissionRules: {
        defaultRate: 2.0, // 2% agency commission
      },
      tenantId: tenant.id,
    },
  });

  const godrej = await prisma.builder.create({
    data: {
      name: "Godrej Properties",
      contactEmail: "pune.partners@godrejproperties.com",
      contactPhone: "+91 22 6169 8500",
      companyDetails: {
        registrationNumber: "PR-GODREJ-5531",
        address: "Godrej One, Vikhroli, Mumbai, Maharashtra",
      },
      commissionRules: {
        defaultRate: 2.5,
      },
      tenantId: tenant.id,
    },
  });

  const kasturi = await prisma.builder.create({
    data: {
      name: "Kasturi Builders",
      contactEmail: "sales@kasturibuilders.com",
      contactPhone: "+91 20 2565 0660",
      companyDetails: {
        registrationNumber: "PR-KASTURI-2245",
        address: "Kasturi House, Shivaji Nagar, Pune",
      },
      commissionRules: {
        defaultRate: 3.0,
      },
      tenantId: tenant.id,
    },
  });

  // 4. Create Projects in Hinjewadi, Wakad, Maan
  const blueWaters = await prisma.project.create({
    data: {
      name: "VTP Blue Waters",
      builderId: vtp.id,
      city: "Pune",
      location: "Maan Road, Hinjewadi Phase 1",
      description: "Huge township with riverside views, dynamic layouts, and premium amenities.",
      tenantId: tenant.id,
    },
  });

  const godrej24 = await prisma.project.create({
    data: {
      name: "Godrej 24",
      builderId: godrej.id,
      city: "Pune",
      location: "Hinjewadi Phase 1",
      description: "Premium residences featuring 24/7 lifestyle amenities and concierge support.",
      tenantId: tenant.id,
    },
  });

  const eonHomes = await prisma.project.create({
    data: {
      name: "Kasturi EON Homes",
      builderId: kasturi.id,
      city: "Pune",
      location: "Hinjewadi Phase 3",
      description: "High-end aesthetic architecture with state-of-the-art smart home facilities.",
      tenantId: tenant.id,
    },
  });

  // Towers
  const towerVTP = await prisma.tower.create({
    data: { name: "VTP Blue Waters - Building T4", projectId: blueWaters.id },
  });

  const towerGodrej = await prisma.tower.create({
    data: { name: "Godrej 24 - Tower B", projectId: godrej24.id },
  });

  const towerKasturi = await prisma.tower.create({
    data: { name: "EON Homes - Cluster C", projectId: eonHomes.id },
  });

  // 5. Create Properties (Inventory)
  const prop1 = await prisma.property.create({
    data: {
      unitNumber: "T4-1204",
      floor: 12,
      towerId: towerVTP.id,
      projectId: blueWaters.id,
      builderId: vtp.id,
      status: PropertyStatus.AVAILABLE,
      price: 7800000, // ₹78 Lakhs
      currency: "INR",
      beds: 2,
      baths: 2,
      sqft: 810.0,
      floorPlanUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
      brochureUrl: "https://example.com/vtp-blue-waters.pdf",
      tenantId: tenant.id,
    },
  });

  const prop2 = await prisma.property.create({
    data: {
      unitNumber: "TB-1602",
      floor: 16,
      towerId: towerGodrej.id,
      projectId: godrej24.id,
      builderId: godrej.id,
      status: PropertyStatus.RESERVED,
      price: 9500000, // ₹95 Lakhs
      currency: "INR",
      beds: 3,
      baths: 3,
      sqft: 1180.0,
      floorPlanUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
      brochureUrl: "https://example.com/godrej-24.pdf",
      tenantId: tenant.id,
    },
  });

  const prop3 = await prisma.property.create({
    data: {
      unitNumber: "C-2201",
      floor: 22,
      towerId: towerKasturi.id,
      projectId: eonHomes.id,
      builderId: kasturi.id,
      status: PropertyStatus.AVAILABLE,
      price: 13500000, // ₹1.35 Crores Luxury Flat
      currency: "INR",
      beds: 3,
      baths: 3.5,
      sqft: 1450.0,
      floorPlanUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
      tenantId: tenant.id,
    },
  });

  // 6. Create Leads
  const lead1 = await prisma.lead.create({
    data: {
      name: "Ramesh Nair",
      email: "ramesh.nair@infosys.com",
      phone: "+91 98220 98765",
      source: LeadSource.GOOGLE_ADS,
      status: LeadStatus.SITE_VISIT,
      budget: 8500000,
      locationPreference: "Hinjewadi Phase 1 / Maan Road",
      notes: [
        { staff: "Sarah Fernandes", text: "Software engineer at Infosys Hinjewadi. Looking for immediate booking in VTP Blue Waters.", date: new Date().toISOString() },
        { staff: "Rahul Shinde", text: "Scheduled site visit for Tower T4 flat 1204.", date: new Date().toISOString() }
      ],
      assignedToId: agent1.id,
      projectId: blueWaters.id,
      tenantId: tenant.id,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: "Priya Deshmukh",
      email: "priya.d@tcs.com",
      phone: "+91 96730 00053", // Using user's verification contact
      source: LeadSource.PROPERTY_FINDER,
      status: LeadStatus.NEGOTIATION,
      budget: 14000000,
      locationPreference: "Hinjewadi Phase 3 (EON Homes)",
      notes: [
        { staff: "Priya Sharma", text: "Wants a luxury 3 BHK in Kasturi EON Homes. Negotiation on payment plan is active.", date: new Date().toISOString() }
      ],
      assignedToId: agent2.id,
      projectId: eonHomes.id,
      tenantId: tenant.id,
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      name: "Amit Patel",
      email: "apatel@wipro.com",
      phone: "+91 91580 44332",
      source: LeadSource.FACEBOOK_ADS,
      status: LeadStatus.NEW,
      budget: 7000000,
      locationPreference: "Wakad / Hinjewadi",
      notes: [
        { staff: "Sarah Fernandes", text: "Lead captured via Hinjewadi 2 BHK Facebook Lead Form.", date: new Date().toISOString() }
      ],
      assignedToId: agent1.id,
      projectId: blueWaters.id,
      tenantId: tenant.id,
    },
  });

  // 7. Create Site Visits
  await prisma.siteVisit.create({
    data: {
      leadId: lead1.id,
      assignedToId: agent1.id,
      scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      status: VisitStatus.SCHEDULED,
      notes: "Pick up client from Infosys Circle Hinjewadi and show VTP Building T4 unit 1204.",
      tenantId: tenant.id,
    },
  });

  await prisma.siteVisit.create({
    data: {
      leadId: lead2.id,
      assignedToId: agent2.id,
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: VisitStatus.COMPLETED,
      outcome: "Checked show flat C-2201. Client requested details on the registration scheme.",
      notes: "EON Homes Phase 3 Site Visit.",
      tenantId: tenant.id,
      gpsCheckIn: {
        lat: 18.5912,
        lng: 73.7402,
        checkInTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  });

  // 8. Create Deal & Commissions
  const deal1 = await prisma.deal.create({
    data: {
      leadId: lead2.id,
      propertyId: prop2.id, // Godrej 3 BHK
      builderId: godrej.id,
      agentId: agent2.id,
      bookingAmount: 200000, // ₹2 Lakhs Token
      status: DealStatus.CLOSURE,
      paymentMilestones: [
        { description: "10% Booking Token", amount: 950000, dueDate: new Date().toISOString(), status: "PAID" },
        { description: "40% Slab Wise", amount: 3800000, dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), status: "PENDING" },
        { description: "50% Registration & Possession", amount: 4750000, dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), status: "PENDING" },
      ],
      contractUrl: "contract_godrej_1602.pdf",
      tenantId: tenant.id,
    },
  });

  // Set property status as SOLD
  await prisma.property.update({
    where: { id: prop2.id },
    data: { status: PropertyStatus.SOLD },
  });

  await prisma.commission.create({
    data: {
      dealId: deal1.id,
      // Total commission = 2.5% of 95 Lakhs = ₹2,37,500
      // Agent gets 50% = ₹1,18,750
      // Team override gets 5% = ₹11,875
      agentAmount: 118750,
      teamAmount: 11875,
      builderAmount: 237500,
      status: CommissionStatus.PENDING_APPROVAL,
      approvalWorkflow: [
        { approver: "Sarah Fernandes", role: "SALES_MANAGER", status: "APPROVED", date: new Date().toISOString() },
        { approver: "Pratik Patil", role: "ADMIN", status: "PENDING", date: null }
      ],
      tenantId: tenant.id,
    },
  });

  // 9. Campaign
  const campaign = await prisma.marketingCampaign.create({
    data: {
      name: "Hinjewadi IT Corridor Adwords 2026",
      source: LeadSource.GOOGLE_ADS,
      cost: 25000, // INR
      budget: 30000,
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      tenantId: tenant.id,
    },
  });

  await prisma.marketingCampaign.update({
    where: { id: campaign.id },
    data: {
      projects: {
        connect: { id: blueWaters.id },
      },
    },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
