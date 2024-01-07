import Image from 'next/image';
import { ChangeEvent, useContext } from 'react';
import Link from 'next/link';
import { useInfo } from '@/hooks/Info';

export function InfoChild() {
  const { info, setInfo, childInfos, setChildInfos, tag, setTag, editIndex, rowCount, handleChild } = useInfo();
  return (
    <div className="bg-white rounded-lg shadow-xl w-full">
      <input
        name="title"
        type="text"
        value={childInfos[editIndex]?.child_title}
        required
        onChange={(e) => {
          handleChild({ ...childInfos[editIndex], child_title: e.target.value });
        }}
        placeholder="ここに見出しを入力"
        className="p-4 w-full bg-white border-b-2 border-gray-200  focus:ring-blue-500 focus:border-blue-500 block placeholder-gray-300 text-lg"
      />
      <textarea
        name="content"
        rows={rowCount(info.content)}
        onChange={(e) => {
          handleChild({ ...childInfos[editIndex], child_content: e.target.value });
        }}
        value={childInfos[editIndex]?.child_content}
        required
        className="block p-4 md:p-8 leading-8 w-full h-[70vh] border-0  focus:ring-0 focus:ring-blue-500"
        style={{
          resize: 'none', // ユーザーがリサイズできないようにする
        }}
      ></textarea>
    </div>
  );
}
