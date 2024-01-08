import { atom } from 'recoil';

const config = {
  serviseName: 'PubliQ',
  originalUrl: 'https://publiq.cloud',
  nullName: 'PubliQ（パブリック）',
  helpTag: [{ name: 'お支払い', url: 'payments' }],
  blogTag: [{ name: 'お知らせ', url: 'news' }],
  wordConfigTag: ['名称', '料金', '数量'],
};

//メイン
export const configAtoms = atom({
  key: 'configAtoms',
  default: config,
});
