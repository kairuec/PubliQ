import { atom } from 'recoil';

const config = {
  serviseName: 'PubliQ',
  originalUrl: 'https:/publiq.online',
  nullName: 'PubliQ（パブリック）',
  helpTag: [
    { name: 'オプション', url: 'options' },
    { name: '注文管理', url: 'orders' },
    { name: '商品編集', url: 'items' },
    { name: 'ショップ設定', url: 'shops' },
    { name: 'お支払い', url: 'payments' },
  ],
  blogTag: [
    { name: 'お知らせ', url: 'news' },
    { name: 'SKUプロジェクト', url: 'skuProject' },
    { name: '楽天', url: 'rakuten' },
    { name: 'Excel', url: 'Excel' },
  ],
  wordConfigTag: ['名称', '料金', '数量'],
};

//メイン
export const configAtoms = atom({
  key: 'configAtoms',
  default: config,
});
