"use client";

import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY as string}
          language="ja"
        >
          <RecoilRoot>{children}</RecoilRoot>
        </GoogleReCaptchaProvider>
      </body>
    </html>
  );
}
