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
import { Logo } from "../../components/Logo";
import { useAuth } from "@/hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth({
    middleware: "auth",
  });
  const router = useRouter();
  useEffect(() => {
    if (user != undefined && user.Authority != "admin") {
      router.push("/404");
    }
  }, [router, user]);

  return (
    <div className={`max-w-7xl mx-auto text-gray-800 leading-8`}>
      <header className="flex items-center justify-between py-6 px-4 md:px-0">
        <Logo />
        <ul className="flex items-center gap-6">
          <li>
            <Link href="/admin/info">投稿管理</Link>
          </li>
          <li>
            <button onClick={logout}>ログアウト</button>
          </li>
        </ul>
      </header>
      <main className="mt-4 min-h-[80vh]">{children}</main>
    </div>
  );
}
