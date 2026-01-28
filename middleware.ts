// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 현재 경로 확인
  const url = request.nextUrl.clone();

  // 1. 로그인된 상태에서 '/login'이나 '/signup' 접속 시 -> 대시보드로 강제 이동
  if (user && (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup"))) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 2. 로그인 안 된 상태에서 '/dashboard' 접속 시 -> 로그인으로 강제 이동
  if (!user && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // 미들웨어가 적용될 경로 설정 (이미지, api 등 제외)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
