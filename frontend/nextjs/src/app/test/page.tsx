"use client";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Sample() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const reCaptchaVerify = async (address: string): Promise<boolean> => {
    if (!executeRecaptcha) {
      return false;
    }

    // executeRecaptcha内の文字列は任意
    const recaptchaToken = await executeRecaptcha("wallet");

    // reCaptchaの検証を行うバックエンドAPIリクエスト（仮定）
    const responseReCaptchaVerify = await reCaptchaVerifyBackend(
      address,
      recaptchaToken
    );

    console.log(
      `responseReCaptchaVerify: ${JSON.stringify(responseReCaptchaVerify)}`
    );

    return responseReCaptchaVerify.success;
  };

  return <button>再生</button>;
}

// 仮定: バックエンドの reCaptcha 検証関数
async function reCaptchaVerifyBackend(address: string, recaptchaToken: string) {
  // ここに実際のバックエンドの処理を追加
  // 仮に成功とするレスポンスを返す
  return { success: true };
}
