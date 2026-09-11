import { NextResponse } from "next/server"
import { isRateLimited } from "@/lib/rate-limit"
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_MS,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    )
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin access is not configured. Set ADMIN_PASSWORD in the server environment." },
      { status: 503 }
    )
  }

  const body = await request.json().catch(() => null)
  const password = typeof body?.password === "string" ? body.password : ""

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
  }

  const token = createAdminSessionToken()
  if (!token) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
  })
  return response
}
