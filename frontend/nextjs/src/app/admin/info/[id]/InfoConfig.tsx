import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import Link from 'next/link';
import { useInfo } from '@/hooks/Info';
import { Button } from 'flowbite-react';
import { useRecoilState } from 'recoil';
import { configAtoms } from '@/recoil/configAtoms';

export function InfoConfig() {
  const [config] = useRecoilState(configAtoms);
  const { info, setInfo, setChildInfos, tag, setTag, setGetImage, rowCount } = useInfo();

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

  //入力
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  //入力 boolean型
  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: JSON.parse(value) }));
  };

  //タグの処理
  const blogTags = config.blogTag;
  const helpTags = config.helpTag;
  const handleSelect = (requestTag: string) => {
    blogTags.map((blogTag) => {
      if (blogTag.name === requestTag) {
        setTag({ name: requestTag, url: blogTag.url, element: 'blog' });
      }
    });
    helpTags.map((helpTag) => {
      if (helpTag.name === requestTag) {
        setTag({ name: requestTag, url: helpTag.url, element: 'help' });
      }
    });
  };

  return (
    <section className="space-y-8">
      <div className="rounded">
        <label className="block mb-2 text-sm font-bold text-gray-900">URL</label>
        <input
          type="text"
          name="url"
          value={info.url}
          disabled={info.id ? true : false}
          onChange={handleChange}
          required
          className="bg-white disabled:bg-white-100 border-2 border-gray-200 disabled:border-0 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-[300px] p-2.5"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-900">ブログサムネイル（画像URL）</label>
        {info.image && (
          <>
            <Image onClick={() => setGetImage((prev) => ({ ...prev, mode: 'thumbnail' }))} src={info.image} className="mb-4 cursor-pointer" width={200} height={200} alt={info.title + 'サムネイル'} />
          </>
        )}
        <Button onClick={() => setGetImage((prev) => ({ ...prev, mode: 'thumbnail' }))} className="bg-gray-400 flex items-center shadow rounded">
          画像の選択
        </Button>
      </div>
      <div>
        <label className="block mb-2 text-sm font-bold text-gray-900">登録タグ</label>
        <select
          name="blogTag"
          onChange={(e) => {
            handleSelect(e.target.value);
          }}
          className="border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-[300px] p-2.5"
          required
        >
          <option value={tag.name}>{tag.name}</option>
          {blogTags.map((blogTag) => (
            <option value={blogTag.name} key={blogTag.name}>
              {blogTag.name}
            </option>
          ))}
          {helpTags.map((helpTag, index) => (
            <option value={helpTag.name} key={helpTag.name}>
              {helpTag.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-4 text-sm font-semibold text-gray-900">公開設定</label>
        <div className="flex items-center md:mb-0 md:mr-8">
          <label className="mr-6 text-sm flex items-center">
            <input
              name="public"
              onChange={handleRadio}
              value="true" // Here, use boolean false
              checked={info.public === true}
              type="radio"
              className="mr-2 w-4 h-4 text-blue-400 bg-white border-gray-200 focus:ring-blue-500 focus:ring-2"
            />
            公開
          </label>
          <label className="mr-6 text-sm flex items-center">
            <input
              name="public"
              onChange={handleRadio}
              value="false" // Here, use boolean false
              checked={info.public === false}
              type="radio"
              className="mr-2 w-4 h-4 text-blue-400 bg-white border-gray-200 focus:ring-blue-500 focus:ring-2"
            />
            非公開
          </label>
        </div>
      </div>
      <div>
        <label className="block mb-4 text-sm font-semibold text-gray-900">noindex指定</label>
        <div className="flex items-center md:mb-0 md:mr-8">
          <label className="mr-6 text-sm flex items-center">
            <input
              name="noindex"
              onChange={handleRadio}
              value="true" // Here, use boolean false
              checked={info.noindex === true}
              type="radio"
              className="mr-2 w-4 h-4 text-blue-400 bg-white border-gray-200 focus:ring-blue-500 focus:ring-2"
            />
            指定しない
          </label>
          <label className="mr-6 text-sm flex items-center">
            <input
              name="noindex"
              onChange={handleRadio}
              value="false" // Here, use boolean false
              checked={info.noindex === false}
              type="radio"
              className="mr-2 w-4 h-4 text-blue-400 bg-white border-gray-200 focus:ring-blue-500 focus:ring-2"
            />
            指定する
          </label>
        </div>
      </div>

      <div className="">
        <label className="block mb-2 text-sm font-semibold text-gray-900">ページ説明（description）</label>
        <textarea
          name="description"
          rows={rowCount(info.description)}
          onChange={handleChange}
          value={info.description}
          className="block px-8 py-6 leading-8 w-full text-sm text-gray-90 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
    </section>
  );
}
