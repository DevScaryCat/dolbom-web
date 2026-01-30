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
          cookiesToSet.forEach(({ name, value, options }) =>
            // [수정된 부분] 인자를 3개가 아니라 객체 1개로 묶어서 전달해야 함
            request.cookies.set({
              name,
              value,
              ...options,
            }),
          );

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
  const url = request.nextUrl.clone();

  // 1. 로그인 상태일 때
  if (user) {
    // 로그인/회원가입 페이지 접근 시 -> 대시보드로 튕겨냄
    if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // 온보딩 여부 확인
    const { data: profile } = await supabase.from("profiles").select("is_onboarded").eq("id", user.id).single();

    // 정보 입력 안 했는데 딴짓 하려고 하면 -> 온보딩 페이지로 납치
    if (
      profile &&
      !profile.is_onboarded &&
      !url.pathname.startsWith("/onboarding") &&
      !url.pathname.startsWith("/auth") &&
      !url.pathname.startsWith("/api")
    ) {
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    // 정보 입력 다 했는데 또 온보딩 페이지 가면 -> 대시보드로 보냄
    if (profile && profile.is_onboarded && url.pathname.startsWith("/onboarding")) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } else {
    // 2. 비로그인 상태일 때
    if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/onboarding")) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
