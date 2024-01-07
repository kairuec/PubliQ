'use client';

import Head from 'next/head';
import Link from 'next/link';
import InfoLayout from '../info/layout';
import useSWR, { mutate } from 'swr';
import axios, { csrf } from '@/lib/axios';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Page() {
  const { data } = useSWR('/api/test', fetcher);

  // data が存在するかどうかを確認してからアクセスする
  return <InfoLayout>{data && data.message}</InfoLayout>;
}
