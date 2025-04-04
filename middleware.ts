import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const username = request.cookies.get("username")?.value;

  if (!username) {
    if (path !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (path === "/") {
      return NextResponse.redirect(new URL("/rooms", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/rooms", "/room/:path*"],
};
