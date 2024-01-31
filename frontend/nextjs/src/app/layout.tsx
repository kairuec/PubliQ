import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import RecoilProvider from './recoilProvider';
import Analytics from '@/components/Analitics';
import { Suspense } from 'react';

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] });

const siteName = 'PubliQ';
const description = 'AIに質問をして正解を当てるクイズアプリ。解くだけでなく、自分で問題を作ってSNSでシェアも可能です。';
const url = 'https://publiq.cloud';

export const metadata = {
  title: {
    default: siteName,
    template: `%s - ${siteName}`,
  },
  metadataBase: new URL(url),
  description,
  openGraph: {
    title: `${siteName}|AIに質問をするクイズWEBアプリ`,
    description: description,
    url: url,
    siteName: siteName,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName}|AIに質問をして正解を当てるクイズWEBアプリ`,
    description: description,
    site: '@AiPubliq91607',
    creator: '@AiPubliq91607',
  },
  verification: {
    google: '4hDnKAEVix29eEeWlFou3fEVD0IXUtKWCH7b5TuUhkQ',
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
