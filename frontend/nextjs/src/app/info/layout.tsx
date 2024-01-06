"use client";

import Link from "next/link";
import { useRecoilState } from "recoil";
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

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`max-w-7xl mx-auto text-gray-800 leading-8`}>
      <header className="flex items-center justify-between py-6 px-4 md:px-0">
        <h1 className=" text-3xl font-bold">
          <Link href="/">
            Publi<span className="text-amber-500">Q</span>
          </Link>
        </h1>
        <ul className="flex items-center gap-6">
          <li>
            <SideMenu />
          </li>
          <li>
            <Link
              href="/"
              className="px-4 py-3 rounded-md  bg-gray-900 text-white hover:text-amber-500 duration-150"
            >
              問題を解く
            </Link>
          </li>
        </ul>
      </header>
      <main className="mt-4 min-h-[80vh]">{children}</main>
      <footer className="md:flex md:items-center md:justify-between py-4 md::p-0 md:pb-10 mt-6 mx-auto">
        <ul className="flex items-center flex-wrap mb-6 md:mb-0 px-4 md:px-0 gap-4 md:gap-6">
          <li>
            <Link
              href="https://twitter.com/PubliQ_AI"
              target="_blank"
              className="text-sm font-normal text-gray-500 hover:underline"
            >
              公式ツイッター
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-sm font-normal text-gray-500 hover:underline"
            >
              お問い合わせ
            </Link>
          </li>
          <li>
            <Link
              href="/terms"
              className="text-sm font-normal text-gray-500 hover:underline"
            >
              利用規約
            </Link>
          </li>
          <li>
            <Link
              href="/privacy"
              className="text-sm font-n ormal text-gray-500 hover:underline"
            >
              プライバシーポリシー
            </Link>
          </li>
        </ul>
        <p className="text-center text-sm text-gray-500">
          &copy; 2024{" "}
          <Link href="/" className="hover:underline" target="_blank">
            PubliQ
          </Link>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
