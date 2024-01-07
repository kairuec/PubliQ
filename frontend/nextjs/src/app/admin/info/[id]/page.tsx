'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios, { csrf } from '@/lib/axios';
import useSWR, { mutate } from 'swr';
import { useInfo } from '@/hooks/Info';
import { Modal, Tooltip } from 'flowbite-react';
import { Loading } from '@/components/Loading';
import Link from 'next/link';
import { InfoMain } from './InfoMain';
import { InfoChild } from './InfoChild';
import { InfoMenu } from './InfoMenu';
import ShortCutButtons from './ShortCutButtons';
import InfoImage from './InfoImage';

const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);
const page = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { info, setInfo, childInfos, setChildInfos, tag, setTag, editIndex, props } = useInfo();

  //データフェッチ関連の処理
  //フェッチする条件idが数値（新規作成のid=createではfetchしない）
  const url = !isNaN(Number(id)) ? `/api/infoEdit/${id}` : null;
  const { data, error, isLoading: isInfoLoading } = useSWR(url, fetcher);
  useEffect(() => {
    if (data) {
      setInfo(data);
      if (data.child.length > 0) {
        setChildInfos(data.child);
      }
      setTag({ name: data.tag, url: data.tagUrl, element: data.tagElement });
    }
  }, [data]);

  //送信関連
  const submitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await csrf();
      const submit = {
        main: info,
        childs: childInfos,
        tag: tag,
      };
      const res = await axios.post('/api/infoEdit/store', submit);
      // 成功時のページ遷移を行う
      router.push('/admin/blog');
    } catch (error) {
      // エラーハンドリングを追加
    } finally {
      //新規作成の場合はindexへ遷移
      if (isNaN(Number(id))) {
        router.push('/admin/info');
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <article className="space-y-4">
        <section className="flex justify-between gap-10">
          {editIndex == -1 && <InfoMain />}
          {childInfos != undefined && editIndex != -1 && <InfoChild />}
          <div className="space-y-6">
            <InfoMenu />
            <section>
              {!isLoading && (
                <form onSubmit={submitForm} className="mt-8 flex justify-center">
                  <button type="submit" className="p-4 flex items-center text-white bg-blue-400 hover:bg-blue-500 duration-100 rounded shadow">
                    登録する
                  </button>
                  <Link href="/admin/info/" className="p-4 ml-4 text-white bg-gray-400 hover:bg-gray-500 duration-100 rounded shadow">
                    一覧に戻る
                  </Link>
                </form>
              )}
              {isLoading && <Loading />}
            </section>
          </div>
        </section>
        <section className="mx-10">
          <ShortCutButtons index={editIndex} />
        </section>
      </article>
      <Modal show={props.openModal === 'image'} size={'7xl'} onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header>
          <b>画像選択</b>
        </Modal.Header>
        <Modal.Body>
          <InfoImage />
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default page;
