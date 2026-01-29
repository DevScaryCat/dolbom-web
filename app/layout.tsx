// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { Agentation } from "agentation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dolbom AI Pipeline",
  description: "Genomic Risk Assessment Platform",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    // [핵심] suppressHydrationWarning 추가
    // 확장 프로그램이 html 태그를 건드려도 에러내지 말라고 설정하는 겁니다.
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar user={user} />
        {children}

        <Agentation />
      </body>
    </html>
  );
}