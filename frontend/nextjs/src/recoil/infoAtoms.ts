import { atom } from 'recoil';

const initialInfo = {
  id: 0,
  title: '',
  url: '',
  content: '',
  image: '',
  description: '',
  public: false,
  noindex: false,
  updated_at: '',
  tag: '',
  tagUrl: '',
  tagElement: '',
  child: [],
};

//メイン
export const infoAtoms = atom<InfoFetch>({
  key: 'infoAtoms',
  default: initialInfo,
});

const initialChild = {
  id: 0,
  child_title: '',
  child_content: '',
};

//子
export const childInfoAtoms = atom({
  key: 'childInfoAtoms',
  default: [initialChild],
});

const initialTag = { name: 'お知らせ', url: 'news', element: 'blog' };

//タグ
export const infoTagAtoms = atom({
  key: 'infoTagAtoms',
  default: initialTag,
});

const initialImage = {
  index: -1,
  mode: '',
  url: '',
};

//編集コンテンツ番号
export const editIndexAtoms = atom({
  key: 'editIndexAtoms',
  default: -1,
});

//モーダルの開閉
export const isShowModalAtoms = atom({
  key: 'isShowModalAtoms',
  default: false,
});

//画像選択
export const imageAtoms = atom({
  key: 'imageAtoms',
  default: initialImage,
});

const initialWordConfig = {
  mode: '',
};

//定型文
export const wordConfigAtoms = atom({
  key: 'wordConfigAtoms',
  default: initialWordConfig,
});
