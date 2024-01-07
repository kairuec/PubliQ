import Image from 'next/image';
import { ChangeEvent, useContext, useState } from 'react';

import Link from 'next/link';
import { useInfo } from '@/hooks/Info';
import { AdjustmentsHorizontalIcon, ChevronUpDownIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon, PlayIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Modal, Tooltip } from 'flowbite-react';

import { InfoConfig } from './InfoConfig';
import { configAtoms } from '@/recoil/configAtoms';
import { useRecoilState } from 'recoil';
import { InfoContent } from '@/app/info/content';

export function InfoMenu() {
  const [config] = useRecoilState(configAtoms);
  const { info, setInfo, childInfos, setChildInfos, tag, setTag, editIndex, setEditIndex, props, handleChange, handleChild } = useInfo();

  //ドラッグアンドドロップの処理
  const [dragIndex, setDragIndex] = useState(null);
  const dragStart = (index: any) => {
    setDragIndex(index);
  };
  const dragEnter = (index: any) => {
    if (index === dragIndex) return;
    setChildInfos((prevState) => {
      let newUsers = JSON.parse(JSON.stringify(prevState));
      const deleteElement = newUsers.splice(dragIndex, 1)[0];
      newUsers.splice(index, 0, deleteElement);
      return newUsers;
    });
    setDragIndex(index);
  };
  const dragEnd = () => {
    setDragIndex(null);
  };

  //子コンテンツ追加
  const handleAdd = () => {
    // 新しいコンテンツ
    const newChild = {
      id: 0,
      child_title: '',
      child_content: '',
    };
    setEditIndex(childInfos.length);
    setChildInfos([...childInfos, newChild]);
  };

  //子コンテンツ削除
  const handleDelete = (indexId: number) => {
    setEditIndex(indexId);
    props.setOpenModal('delete');
  };

  // モーダルでの確認後の処理
  const handleDeleteConfirmed = () => {
    const newChilds = childInfos.filter((childInfo, index) => index !== editIndex);
    setChildInfos(newChilds);
    props.setOpenModal(undefined);
    setEditIndex(-1);
  };

  const handlePreview = () => {
    setInfo((prev: InfoFetch) => ({ ...prev, child: childInfos, tag: tag.name }));
    props.setOpenModal('preview');
  };

  return (
    <div className="space-y-6">
      <ul className=" space-y-4 w-full md:w-[450px] h-[60vh] overflow-y-scroll">
        <li className="relative">
          <input
            value={info.title}
            name="title"
            type="text"
            onClick={() => setEditIndex(-1)}
            onChange={handleChange}
            className={`${editIndex == -1 && 'border-l-2 border-blue-400'} w-full p-4 pl-[55px] h-[60px] border-0 shadow-md rounded-md placeholder-gray-300 focus:ring-white`}
            placeholder="メインコンテンツ"
          />
        </li>
        {childInfos &&
          childInfos.map((childInfo, index) => (
            <li
              key={index}
              onClick={() => setEditIndex(index)}
              draggable={true}
              onDragStart={() => dragStart(index)}
              onDragEnter={() => dragEnter(index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={dragEnd}
              className={`${index == dragIndex ? 'border-b-4 border-blue-400' : ''}  
            ${index == editIndex && 'border-l-2 border-blue-400'} px-4 h-[60px] bg-white shadow-md rounded-md flex items-center gap-4 cursor-pointer`}
            >
              <ChevronUpDownIcon className="w-6 h-6 text-gray-400 hover:text-blue-500" />
              <input
                value={childInfo.child_title}
                name="title"
                type="text"
                onClick={() => setEditIndex(-1)}
                onChange={(e) => {
                  handleChild({ ...childInfos[editIndex], child_title: e.target.value });
                }}
                className={`w-full border-0 placeholder-gray-300 focus:ring-white`}
                placeholder="サブコンテンツ"
              />
              {childInfos.length > 1 && <XCircleIcon onClick={() => handleDelete(index)} className="w-6 h-6 text-gray-400 hover:text-red-500 cursor-pointer" />}
            </li>
          ))}
      </ul>
      <section className="flex items-center gap-6 justify-center">
        <Tooltip content="サブコンテンツ追加">
          <div
            onClick={handleAdd}
            className="bg-white text-gray-400 hover:text-blue-400  border-2 border-gray-200 hover:border-blue-400 duration-75 rounded-full w-[50px] h-[50px] flex items-center justify-center shadow-2xl"
          >
            <PlusIcon className="h-6 w-6 hover:text-blue-500" />
          </div>
        </Tooltip>
        <Tooltip content="プレビュー">
          <div
            onClick={handlePreview}
            className="bg-white text-gray-400 hover:text-blue-400  border-2 border-gray-200 hover:border-blue-400 duration-75 rounded-full w-[50px] h-[50px] flex items-center justify-center shadow-2xl"
          >
            <PlayIcon className="h-6 w-6 text-gray-400 hover:text-blue-500" />
          </div>
        </Tooltip>
        <Tooltip content="詳細設定">
          <div
            onClick={() => props.setOpenModal('config')}
            className="bg-white text-gray-400 hover:text-blue-400  border-2 border-gray-200 hover:border-blue-400 duration-75 rounded-full w-[50px] h-[50px] flex items-center justify-center shadow-2xl"
          >
            <AdjustmentsHorizontalIcon className="h-6 w-6 mx-2 text-gray-400 hover:text-blue-500" />
          </div>
        </Tooltip>
        <Tooltip content="使い方">
          <div className="bg-white text-gray-400 hover:text-blue-400  border-2 border-gray-200 hover:border-blue-400 duration-75 rounded-full w-[50px] h-[50px] flex items-center justify-center shadow-2xl">
            <QuestionMarkCircleIcon className="h-6 w-6 mx-2 text-gray-400 hover:text-blue-500" />
          </div>
        </Tooltip>
      </section>
      <Modal show={props.openModal === 'preview'} size={'10xl'} onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header>
          <b>プレビュー</b>
        </Modal.Header>
        <Modal.Body className="bg-neutral-100">{info != undefined && <InfoContent getData={info} />}</Modal.Body>
      </Modal>
      <Modal show={props.openModal === 'config'} size={'7xl'} onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header>
          <b>ページ設定</b>
        </Modal.Header>
        <Modal.Body>
          <InfoConfig />
        </Modal.Body>
      </Modal>
      <Modal show={props.openModal === 'delete'} size={'md'} onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header>
          <b>確認事項</b>
        </Modal.Header>
        <Modal.Body>
          <section className="space-y-8 flex items-center justify-center flex-col">
            <ExclamationCircleIcon className="w-20 h-20 text-gray-400" />
            <p>本当に削除しますか？</p>
            <div className="mt-8 flex justify-center">
              <button onClick={handleDeleteConfirmed} type="button" className="p-4 flex items-center text-white bg-blue-400 hover:bg-blue-500 duration-100 rounded shadow">
                削除する
              </button>
              <button
                onClick={() => {
                  props.setOpenModal(undefined);
                }}
                type="button"
                className="p-4 ml-4 text-white bg-gray-400 hover:bg-gray-500 duration-100 rounded shadow"
              >
                キャンセル
              </button>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
}
