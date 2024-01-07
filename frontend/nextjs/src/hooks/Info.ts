import { childInfoAtoms, editIndexAtoms, imageAtoms, infoAtoms, infoTagAtoms, isShowModalAtoms, wordConfigAtoms } from '@/recoil/infoAtoms';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

export const useInfo = () => {
  const [info, setInfo] = useRecoilState<InfoFetch>(infoAtoms);
  const [childInfos, setChildInfos] = useRecoilState<Child[]>(childInfoAtoms);
  const [tag, setTag] = useRecoilState(infoTagAtoms);
  const [editIndex, setEditIndex] = useRecoilState(editIndexAtoms);
  const [getImage, setGetImage] = useRecoilState(imageAtoms);
  const [wordConfig, setWordConfig] = useRecoilState(wordConfigAtoms);
  const [isShowModal, setIsShowModal] = useRecoilState(isShowModalAtoms);

  //モーダル
  const [openModal, setOpenModal] = useState<string | undefined>();
  const props = { openModal, setOpenModal };
  useEffect(() => {
    if (getImage.mode != '') {
      props.setOpenModal('image');
    }
  }, [getImage.mode]);
  useEffect(() => {
    props.setOpenModal(undefined);
  }, [getImage.url]);
  useEffect(() => {
    if (wordConfig.mode == 'exit') {
      props.setOpenModal(undefined);
    }
  }, [wordConfig.mode]);

  //入力
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  //子コンテンツ編集
  const handleChild = (request: Child) => {
    const newChilds: Child[] = childInfos.map((childInfo, index) => {
      if (index === editIndex) {
        return request;
      }
      return childInfo;
    });
    setChildInfos(newChilds);
  };

  //テキストエリアの高さ取得
  const rowCount = (text: string) => {
    if (text !== null && text !== undefined && text.match(/\n/)) {
      return text.split('\n').length;
    } else {
      return 1;
    }
  };

  return {
    info,
    setInfo,
    childInfos,
    setChildInfos,
    tag,
    setTag,
    editIndex,
    setEditIndex,
    isShowModal,
    setIsShowModal,
    getImage,
    setGetImage,
    wordConfig,
    setWordConfig,
    rowCount,
    openModal,
    setOpenModal,
    props,
    handleChange,
    handleChild,
  };
};
