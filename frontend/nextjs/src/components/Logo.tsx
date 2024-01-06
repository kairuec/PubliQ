import Link from "next/link";

export function Logo() {
  return (
    <h1 className="text-3xl font-bold">
      <Link href="/">
        Publi<span className="text-amber-500">Q</span>
      </Link>
      <span className="text-gray-300 text-base ml-2">α ver</span>
    </h1>
  );
}
