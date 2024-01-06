"use client";
import Head from "next/head";
import Link from "next/link";
import InfoLayout from "../info/layout";
import { useAuth } from "@/hooks/auth";

export default function Page() {
  const { logout } = useAuth({
    middleware: "auth",
  });

  return (
    <>
      <button onClick={logout}>ログアウト</button>
    </>
  );
}
