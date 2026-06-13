import { NextResponse } from "next/server";
import { auth } from "./src/lib/auth"; // NextAuth V5 auth handler

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const tenantId = req.auth?.user?.tenantId;

  // Resolve subdomain or domain
  const hostname = req.headers.get("host") || "";
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "localhost:3000";
  
  let tenantSubdomain = "";
  if (isLocalhost) {
    // apex.localhost:3000 -> apex
    const parts = hostname.split(".");
    if (parts.length > 2) {
      tenantSubdomain = parts[0];
    }
  } else {
    // apex.realestatecrm.com -> apex
    tenantSubdomain = hostname.replace(`.${baseDomain}`, "");
  }

  // Define public and authentication routes
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || 
                      nextUrl.pathname.startsWith("/signup") || 
                      nextUrl.pathname.startsWith("/forgot-password") ||
                      nextUrl.pathname.startsWith("/reset-password");

  const isPublicApiRoute = nextUrl.pathname.startsWith("/api/v1/webhooks");

  // Redirect to login if user is not authenticated and trying to reach dashboard
  if (!isLoggedIn && !isAuthRoute && !isPublicApiRoute && nextUrl.pathname !== "/unauthorized") {
    const loginUrl = new URL("/login", req.url);
    if (tenantSubdomain) {
      loginUrl.searchParams.set("tenant", tenantSubdomain);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if user is logged in but tries to access login page
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Role-Based Access Control (RBAC) validations
  if (isLoggedIn) {
    const path = nextUrl.pathname;
    
    // Commission route requires SUPER_ADMIN, ADMIN, or SALES_MANAGER
    if (path.startsWith("/commissions")) {
      const allowed = ["SUPER_ADMIN", "ADMIN", "SALES_MANAGER"];
      if (!allowed.includes(userRole || "")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Tenant Settings require SUPER_ADMIN or ADMIN
    if (path.startsWith("/settings") && !path.startsWith("/settings/profile")) {
      const allowed = ["SUPER_ADMIN", "ADMIN"];
      if (!allowed.includes(userRole || "")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  // Inject tenant details in headers
  const requestHeaders = new Headers(req.headers);
  if (tenantId) {
    requestHeaders.set("x-tenant-id", tenantId);
  }
  if (tenantSubdomain) {
    requestHeaders.set("x-tenant-subdomain", tenantSubdomain);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    // Skip static assets, next internals
    "/((?!api/auth|_next/static|_next/image|assets|favicon.ico).*)",
  ],
};
