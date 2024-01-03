"use client";

import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <RecoilRoot>{children}</RecoilRoot>
      </body>
    </html>
  );
}
