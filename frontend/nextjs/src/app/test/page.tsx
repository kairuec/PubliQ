"use client";

import { useRecapcha } from "@/hooks/Recapcha";

export default function Sample() {
  const { isRecapchaCheck, handleRecapcha } = useRecapcha();

  return (
    <button onClick={handleRecapcha}>
      {isRecapchaCheck ? "あああ" : "いいい"}
    </button>
  );
}
