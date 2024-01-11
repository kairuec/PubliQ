'use client';

import Head from 'next/head';
import Link from 'next/link';
import InfoLayout from '../info/layout';
import useSWR, { mutate } from 'swr';
import axios, { csrf } from '@/lib/axios';
import { useRecoilState } from 'recoil';
import { questionState } from '@/recoil/questionAtom';
import { useQuestion } from '@/hooks/Question';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Page() {
  const { question, regenerateQuestion } = useQuestion();

  // data が存在するかどうかを確認してからアクセスする
  return (
    <>
      {process.env.NODE_ENV}
      {question && question.id}
      <button onClick={regenerateQuestion}>更新</button>
    </>
  );
}
