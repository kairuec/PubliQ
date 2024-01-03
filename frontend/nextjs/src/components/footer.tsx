import Link from "next/link";

export function Footer() {
  return (
    <footer className="md:flex md:items-center justify-center md:justify-between py-4 md::p-0 md:pb-10 mt-6 mx-auto">
      <ul className="flex items-center justify-center md:justify-normal flex-wrap mb-6 md:mb-0 gap-4 md:gap-6">
        <li>
          <Link
            href="/chat"
            className="text-sm font-normal text-gray-500 hover:underline"
          >
            チャット
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            className="text-sm font-normal text-gray-500 hover:underline"
          >
            ブログ
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
            href="/contact"
            className="text-sm font-normal text-gray-500 hover:underline"
          >
            お問い合わせ
          </Link>
        </li>
      </ul>
      <p className="text-center text-sm text-gray-500">
        &copy; 2024
        <Link href="/" className="hover:underline ml-1" target="_blank">
          PublicContent
        </Link>
        . All rights reserved.
      </p>
    </footer>
  );
}
