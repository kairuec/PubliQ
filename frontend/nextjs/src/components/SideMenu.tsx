import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function SideMenu() {
  return (
    <Sheet>
      <SheetTrigger className="hover:underline">メニュー</SheetTrigger>
      <SheetContent>
        <ul className="pt-10 px-2 space-y-10">
          <li>
            <Link href="https://twitter.com/PubliQ_AI" target="_blank" className="flex items-center gap-2 hover:underline">
              <span className="text-3xl mr-2">
                <FaXTwitter />
              </span>
              開発者ツイッター
              <br />
              お知らせはコチラから
            </Link>
          </li>
          <li>
            <Link href="/info/howto" className="hover:underline">
              PabliQ（パブリック）の遊び方
            </Link>
          </li>
          {/* <li>今後のロードマップ</li> */}
          {/* <li>広告主 募集中</li> */}
          <li>
            <Link href="/contact" className="hover:underline">
              お問い合わせ
            </Link>
          </li>
          <li>
            <Link href="/terms" className="hover:underline">
              利用規約
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:underline">
              プライバシーポリシー
            </Link>
          </li>
        </ul>
        <div className="fixed bottom-10">
          <p className="text-gray-400">© 2024 PubliQ. All rights reserved.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
