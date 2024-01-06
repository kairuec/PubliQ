import Head from "next/head";
import Link from "next/link";
import InfoLayout from "../info/layout";

const siteName = "PubliQ";
const description = "利用規約に関するページです。";

export const metadata = {
  title: {
    default: `利用規約｜${siteName}`,
    template: `%s - ${siteName}`,
  },
  description,
};

export default function Page() {
  return (
    <InfoLayout>
      <div className="bg-white shadow rounded-lg md:mt-0 w-full xl:p-0 mx-auto">
        <div className="p-6 sm:p-8 lg:p-8 space-y-8">
          <h1 className="text-2xl lg:text-3xl font-normal text-gray-900">
            お問い合わせ
          </h1>
          <p>
            お手数おかけしますが、公式ツイッターアカウントにDMをお願い致します。
          </p>
          <Link
            href="https://twitter.com/PubliQ_AI"
            target="_blank"
            className="text-amber-500 hover:underline"
          >
            アカウントはコチラ（@PubliQ_AI）
          </Link>
        </div>
      </div>
    </InfoLayout>
  );
}
