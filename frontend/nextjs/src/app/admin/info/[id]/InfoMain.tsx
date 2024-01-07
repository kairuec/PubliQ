import Image from 'next/image';
import { ChangeEvent, useContext } from 'react';
import { useInfo } from '@/hooks/Info';

export function InfoMain() {
  const { info, setInfo, rowCount } = useInfo();

  //入力
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full">
      <input
        name="title"
        type="text"
        value={info.title}
        required
        onChange={handleChange}
        placeholder="ここにタイトルを入力"
        className="p-4 w-full bg-white border-b-2 border-gray-200  focus:ring-blue-500 focus:border-blue-500 block placeholder-gray-300 text-lg"
      />
      <textarea
        name="content"
        rows={rowCount(info.content)}
        onChange={handleChange}
        value={info.content}
        required
        className="block p-4 md:p-8 leading-8 w-full h-[70vh] border-0  focus:ring-0 focus:ring-blue-500"
        style={{
          resize: 'none', // ユーザーがリサイズできないようにする
        }}
      ></textarea>
    </div>
  );
}
