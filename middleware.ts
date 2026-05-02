import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type RoleRule = {
  pathPrefix: string;
  allowedRoles: string[];
};

const roleRules: RoleRule[] = [
  { pathPrefix: "/admin", allowedRoles: ["administrador"] },
  { pathPrefix: "/cocina", allowedRoles: ["cocinero", "administrador"] },
];

const getRedirectPath = (role: string | undefined) => {
  switch (role) {
    case "administrador":
      return "/admin";
    case "cocinero":
      return "/cocina";
    default:
      return "/";
  }
};

const findRoleRule = (pathname: string) => {
  return roleRules.find(
    (rule) => pathname === rule.pathPrefix || pathname.startsWith(`${rule.pathPrefix}/`)
  );
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const roleRule = findRoleRule(pathname);

  if (!roleRule) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  if (!token) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (!role || !roleRule.allowedRoles.includes(role)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getRedirectPath(role);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cocina/:path*"],
};
