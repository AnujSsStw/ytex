import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  ignoredRoutes: ["/api/:path*"],
});

// export function cors() {
//   // retrieve the current response
//   const res = NextResponse.next();

//   // add the CORS headers to the response
//   res.headers.append("Access-Control-Allow-Credentials", "true");
//   res.headers.append("Access-Control-Allow-Origin", "*"); // replace this your actual origin
//   res.headers.append(
//     "Access-Control-Allow-Methods",
//     "GET,DELETE,PATCH,POST,PUT"
//   );
//   res.headers.append(
//     "Access-Control-Allow-Headers",
//     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
//   );

//   return res;
// }

// Stop Middleware running on static files
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
