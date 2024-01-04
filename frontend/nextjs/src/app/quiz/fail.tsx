"use client";
import { useRecoilState } from "recoil";
import { isFailState } from "@/recoil/questionAtom";
import useSound from "use-sound";
import { useEffect } from "react";

export function Fail() {
  const [isFail, setIsFail] = useRecoilState(isFailState);
  const [playFail] = useSound("/sounds/男性の悲鳴.mp3");

  useEffect(() => {
    if (isFail) {
      playFail();
    }
  }, [isFail, playFail]);

  return (
    <div className="fadeIn flex text-center justify-center items-center h-[100vh] bg-black text-red-600 text-7xl md:text-9xl you_died">
      YOU DIED
    </div>
  );
}
