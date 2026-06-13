import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "redis";

export async function GET(req: NextRequest) {
  const tenantId = req.headers.get("x-tenant-id") || "global-system";
  const subdomain = req.headers.get("x-tenant-subdomain") || "default";

  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    tenantContext: {
      tenantId,
      subdomain,
    },
    database: "DISCONNECTED",
    cache: "DISCONNECTED",
  };

  // 1. Verify Prisma / PostgreSQL Connection
  try {
    // Simple query to verify connectivity
    await prisma.$queryRaw`SELECT 1`;
    diagnostics.database = "CONNECTED";
  } catch (err: any) {
    diagnostics.database = `ERROR: ${err.message}`;
  }

  // 2. Verify Redis Connectivity
  try {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    const client = createClient({ url: redisUrl });
    
    // Set a very short connection timeout to prevent route hanging
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000))
    ]);
    
    diagnostics.cache = "CONNECTED";
    await client.disconnect();
  } catch (err: any) {
    diagnostics.cache = `ERROR: ${err.message}`;
  }

  const overallStatus =
    diagnostics.database === "CONNECTED" && diagnostics.cache === "CONNECTED"
      ? 200
      : 500;

  return NextResponse.json(diagnostics, { status: overallStatus });
}
export const dynamic = "force-dynamic";
