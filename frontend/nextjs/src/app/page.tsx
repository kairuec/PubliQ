"use client";

import Link from "next/link";
import { useRecoilState } from "recoil";
import { isFailState } from "@/recoil/questionAtom";
import useSound from "use-sound";
import { useEffect } from "react";
import { Fail } from "./quiz/fail";
import { SendForm } from "./quiz/sendForm";
import { Chat } from "./quiz/chat";
import { CreateForm } from "./quiz/createForm";

export default function Page() {
  const [isFail, setIsFail] = useRecoilState(isFailState);
  return (
    <>
      {isFail && <Fail />}
      {!isFail && (
        <div className={`max-w-7xl mx-auto text-gray-800 leading-8`}>
          <header className="flex items-center justify-between py-6 px-4 md:px-0">
            <h1 className=" text-3xl font-bold">
              <Link href="/blog">
                Publi<span className="text-amber-500">Q</span>
              </Link>
            </h1>
            <ul className="flex items-center gap-6">
              <li>
                <CreateForm />
              </li>
            </ul>
          </header>
          <main>
            <article>
              <Chat />
              <SendForm />
            </article>
          </main>
        </div>
      )}
    </>
  );
}
