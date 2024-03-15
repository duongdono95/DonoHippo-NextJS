import { NextResponse } from "next/server";
import {
  authMiddleware,
  redirectToSignIn,
} from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"],

  afterAuth(auth, req) {
    if (auth.userId && auth.isPublicRoute) {
      let path = `/sell/${auth.userId}`;

      if (auth.orgId) {
        path = `/sell/${auth.orgId}`;
      }

      const orgSelection = new URL(path, req.url);
      return NextResponse.redirect(orgSelection);
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
