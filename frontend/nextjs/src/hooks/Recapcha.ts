import { isRecapchaCheckState } from "@/recoil/recapchaAtom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRecoilState } from "recoil";

export const useRecapcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isRecapchaCheck, setIsRecapchaCheck] =
    useRecoilState(isRecapchaCheckState);

  const handleRecapcha = async () => {
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
        if (res.responceJsonRecaptcha.success) {
          setIsRecapchaCheck(true);
          return true;
        }
      }
    } catch (error) {
      // エラーハンドリング
      console.error(
        "エラーが発生しました:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  return { isRecapchaCheck, handleRecapcha };
};
