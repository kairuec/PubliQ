"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Sample() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async () => {
    try {
      if (executeRecaptcha) {
        const token = await executeRecaptcha("contactPage");

        // トークンをサーバーに送信
        const response = await fetch("/api/recaptcha", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          // サーバーからエラーレスポンスが返ってきた場合
          const errorText = await response.text();
          throw new Error(`サーバーエラー: ${response.status}, ${errorText}`);
        }

        // 成功時の処理
        const res = await response.json();
        console.log(res.responceJsonRecaptcha.success);
      }
    } catch (error) {
      // エラーハンドリング
      console.error(
        "エラーが発生しました:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  return <button onClick={onSubmit}>再生</button>;
}
