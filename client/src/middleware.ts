import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
let ans = 0;
export async function middleware(request: NextRequest, res: NextResponse) {
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/Login", "/Register", "/"],
};
