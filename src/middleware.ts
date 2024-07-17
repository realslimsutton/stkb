import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUser } from "./shop-titans/utils";

export async function middleware(request: NextRequest) {
  const user = await getUser();

  const isAuthPages = request.nextUrl.pathname.startsWith("/auth");
  if (user && isAuthPages) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (!user && !isAuthPages) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/auth/:path*", "/market/:path*"],
};
