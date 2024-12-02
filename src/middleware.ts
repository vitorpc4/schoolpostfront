import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { IResponseToken } from "./app/(account)/login/page";
import { IUserSchoolAssociation } from "./http/Models/Response/IUserSchoolAssociation";

const publicRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const token = (await cookies()).get("token")?.value!;
  const user = (await cookies()).get("user")?.value!;

  const path = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(path);

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  //updateObjuser(user, token);

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
