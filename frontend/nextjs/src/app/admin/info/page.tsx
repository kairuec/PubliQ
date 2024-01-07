"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/auth";

export default function Page() {
  const { logout } = useAuth({
    middleware: "auth",
  });

  return <>管理sss画面</>;
}
