import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "24K Realtors | Pune Real Estate Property Consultant Platform",
  description:
    "Enterprise-grade multi-tenant SaaS CRM built for 24K Realtors Pune, tracking Hinjewadi, Wakad, and Maan flat sales.",
  keywords: ["real estate", "CRM", "Pune", "Hinjewadi", "Wakad", "Maan", "24K Realtors", "property consultant"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-[#060709] text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
