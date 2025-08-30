import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { parse } from "cookie"
import { jwtVerify } from "jose"

const PUBLIC_ROUTES = [
  "/signup",
  "/login",
  "/forgot-password",
  "/reset-password",
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next()

  const cookieHeader = req.headers.get("cookie") || ""
  const cookies = parse(cookieHeader)
  const token = cookies.token

  if (!token) {
    // If user hits welcome with no token → show welcome normally
    if (pathname === "/" || pathname === "/welcome") {
      return NextResponse.next()
    }

    // Otherwise force login
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_JWT_SECRET || ""
    )
    const { payload } = await jwtVerify(token, secret)

    const role = payload.role as string

    // 🚀 Redirect from "/" or "/welcome" to role-based dashboard
    if (pathname === "/" || pathname === "/welcome") {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
      if (role === "OFFICER") {
        return NextResponse.redirect(new URL("/official", req.url))
      }
      // fallback for other roles
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Role-based protection
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/official") && role !== "OFFICER") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Forward token if needed
    const response = NextResponse.next()
    response.headers.set("x-access-token", token)
    return response
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/", "/admin/:path*", "/official/:path*", "/dashboard/:path*"],
}
