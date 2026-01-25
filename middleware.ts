import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // this comes from your NextAuth config export

export async function middleware(request: NextRequest) {
  const session = await auth(); // NextAuth session (or null)
  const isLoggedIn = !!session?.user;


  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  //  If logged in and trying to access signin/signup → redirect to home/dashboard
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If NOT logged in and route is protected → redirect to signin
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
