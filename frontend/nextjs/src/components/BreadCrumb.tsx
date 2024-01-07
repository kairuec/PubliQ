import React, { useContext } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import { configAtoms } from '@/recoil/configAtoms';
import { useRecoilState } from 'recoil';

export function BreadCrumb(props: { tag: string }) {
  const [config] = useRecoilState(configAtoms);

  //configに記載のタグを取得+(検索結果のPATHを取得できるようにここで追加)

  //中間のパス
  const staticPath = [
    { name: 'ブログ', url: 'blog' },
    { name: 'ヘルプ', url: 'help' },
    { name: '検索結果', url: 'search' },
  ];

  const pathNameList = config.blogTag.concat(config.helpTag.concat(staticPath));

  //パスとパンくずリストに表示する文字列
  const pathName = (path: string) => {
    const name = pathNameList.filter((pathName) => {
      return pathName.url == path;
    });
    return name[0];
  };

  //パンくずの配列※初期値はトップページのみ
  const breadCrumbList = [{ name: 'TOP', url: '' }];

  //パンくずのパスを結合した文字列を作るための配列
  const pathParts = [''];

  //URLからパスを取得※usePathname()からの値がnullの場合、空の配列[]を代わりに使用します。
  const currentPathList = usePathname()?.split('/') || [];

  //中間のパンくず
  for (const path of currentPathList) {
    const pathNameSearch = pathName(path);
    if (pathNameSearch != undefined) {
      breadCrumbList.push(pathNameSearch);
      pathParts.push(pathNameSearch.url);
    }
  }

  //タグのパンくず（引数のタグを使用）
  if (props.tag != '') {
    const tag = pathName(props.tag);
    breadCrumbList.push({ name: tag?.name, url: `search?keyword=${tag?.name}` });
  }

  //パンくずリストの型サンプル
  // const breadCrumbList = [
  //   { name: 'TOP', url: '' },
  //   { name: 'ブログ', url: 'blog' },
  //   { name: '楽天', url: 'blog/rakuten' },
  // ];

  return (
    <ol itemScope itemType="https://schema.org/BreadcrumbList" className="flex items-center gap-2 mx-6 md:px-0">
      {breadCrumbList.map((breadCrumb, index) => {
        const arrow = () => {
          //アロー追加
          if (index !== breadCrumbList.length - 1) {
            return <ChevronRightIcon className="w-4 h-4 -mt-0.5" />;
          }
          //最後はアローをつけない
          else {
            return null;
          }
        };
        return (
          <li key={index} itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
            <a href={'/' + breadCrumb?.url} className="flex items-center gap-2 hover:underline" itemProp="item">
              <span itemProp="name">{breadCrumb?.name}</span>
              {arrow()}
            </a>
            <meta itemProp="position" content={(index + 1).toString()} />
          </li>
        );
      })}
    </ol>
  );
}
