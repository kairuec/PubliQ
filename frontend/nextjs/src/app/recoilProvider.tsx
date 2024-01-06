"use client";

import { ReactNode } from "react";
import { RecoilRoot } from "recoil";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

function RecoilProvider({ children }: { children: ReactNode }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
      language="ja"
    >
      <RecoilRoot>{children}</RecoilRoot>
    </GoogleReCaptchaProvider>
  );
}

export default RecoilProvider;
