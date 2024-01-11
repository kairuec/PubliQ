import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import RecoilProvider from './recoilProvider';
import Analytics from '@/components/Analitics';
import { Suspense } from 'react';

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] });

const siteName = 'PubliQ';
const description = 'AIに質問をして正解を当てるクイズアプリ。解くだけでなく、自分で問題を作ってSNSでシェアも可能です。';
const url = 'https://publiq.online';

export const metadata = {
  title: {
    default: siteName,
    template: `%s - ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description,
    site: '@PubliQ_AI',
    creator: '@PubliQ_AI',
  },
  verification: {
    google: 'サーチコンソールのやつ',
  },
  alternates: {
    canonical: url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <Suspense>
          <Analytics />
        </Suspense>
        <RecoilProvider>{children}</RecoilProvider>
      </body>
    </html>
  );
}
