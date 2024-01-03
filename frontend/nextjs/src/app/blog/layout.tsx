import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PublicBlog",
  description: "誰でも編集可能なwikipediaチックなブログサイトです。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`max-w-7xl mx-auto text-gray-800 leading-8`}>
      <header className="flex items-center justify-between py-6 px-4 md:px-0">
        <h1 className=" text-2xl font-bold">
          <Link href="/blog">
            Public<span className="text-gray-500">Blog</span>
          </Link>
        </h1>
        <ul className="flex items-center gap-6">
          <li>
            <Link href="" className="hover:underline">
              ゲストさん
            </Link>
          </li>
          <li>
            <Button className="text-base">投稿する</Button>
          </li>
        </ul>
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
