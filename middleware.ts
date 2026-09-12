import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Public admin auth routes
  const publicAuthRoutes = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
  ];

  const isPublicAuthRoute = publicAuthRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not yet configured, allow viewing login page with notice, but block protected admin
  if (!supabaseUrl || !supabaseAnonKey) {
    if (isPublicAuthRoute) {
      return NextResponse.next();
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "unconfigured");
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If authenticated and trying to access login, redirect to /admin
  if (user && isPublicAuthRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If unauthenticated and trying to access protected admin route
  if (!user && !isPublicAuthRoute) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated, verify against ADMIN_USER_ID allowlist if configured
  if (user && !isPublicAuthRoute) {
    const configuredAdminId = process.env.ADMIN_USER_ID?.trim();
    if (configuredAdminId && user.id !== configuredAdminId) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
