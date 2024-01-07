"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth";

const title: string = "投稿管理";

export default function Page() {
  const { logout } = useAuth({
    middleware: "auth",
  });

  return <></>;
}
