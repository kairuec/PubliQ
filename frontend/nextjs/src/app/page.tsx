"use client";
import Head from "next/head";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { isFailState } from "@/recoil/questionAtom";
import useSound from "use-sound";
import { useEffect, useState } from "react";
import { Fail } from "./quiz/fail";
import { SendForm } from "./quiz/sendForm";
import { Chat } from "./quiz/chat";
import { CreateForm } from "./quiz/createForm";
import { FaXTwitter } from "react-icons/fa6";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SideMenu } from "@/components/SideMenu";

export default function Page() {
  const [isFail, setIsFail] = useRecoilState(isFailState);

  return (
    <>
      {isFail && <Fail />}
      {!isFail && (
        <div className={`max-w-7xl mx-auto text-gray-800 leading-8`}>
          <header className="flex items-center justify-between py-6 px-4 md:px-0">
            <h1 className="text-3xl font-bold">
              <Link href="/blog">
                Publi<span className="text-amber-500">Q</span>
              </Link>
              <span className="text-gray-300 text-base ml-2">α ver</span>
            </h1>
            <ul className="flex items-center gap-6">
              <li>
                <SideMenu />
              </li>
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
