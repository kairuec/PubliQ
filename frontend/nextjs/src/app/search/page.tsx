'use client';
import { useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import axios from 'axios';
import 'zenn-content-css';
import markdownToHtml from 'zenn-markdown-html';
import parse from 'html-react-parser';
import { MagnifyingGlassIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import { BreadCrumb } from '@/components/BreadCrumb';
import Link from 'next/link';
import Head from 'next/head';
import { useLaravelApi } from '@/hooks/LaravelApi';
import { useSearch } from '@/hooks/Search';
import { Loading } from '@/components/Loading';
import { Pagination } from '@/components/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';

import InfoLayout from '../info/layout';

interface urls {
  url: string;
}

const title: string = 'ページ一覧';

interface BlogItem {
  title: string;
  url: string;
  image: string;
  description: string;
  updated_at: string;
  tag: string;
  tagUrl: string;
  element: string;
}

interface BlogData {
  map(arg0: (blog: any, index: any) => JSX.Element): import('react').ReactNode;
  current_page: number;
  data: BlogItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export default function InfoSearch() {
  // blogs ステートの初期値を設定
  const initialBlogData: BlogData = {
    current_page: 1,
    data: [],
    first_page_url: '',
    from: 0,
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: 20,
    prev_page_url: null,
    to: 0,
    total: 0,
    map: function (arg0: (blog: any, index: any) => JSX.Element): ReactNode {
      throw new Error('Function not implemented.');
    },
  };
  const [blogs, setBlogs] = useState<BlogData>(initialBlogData);

  //読み込み中
  const [isLoading, setIsLoading] = useState(true);

  //検索関連
  const { search, handleSearch, handleSelect, searchResult, setSearchResult } = useSearch('infos.updated_at');

  const searchHtml = () => {
    return (
      <form className="relative">
        <input
          value={search.keyword}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          className="w-full md:w-[300px] border-2 border-gray-200 bg-white h-12 px-5 pr-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          type="search"
        />
        <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
        </button>
      </form>
    );
  };

  // キーワードパラメーターを取得;
  const router = useRouter();
  const params = useSearchParams();
  let paramKey = params.get('keyword');

  //APIを叩きページ一覧取得
  const { getIndex } = useLaravelApi();

  //初回の処理
  useEffect(() => {
    // paramKey が存在し、空でないかどうかを確認
    if (paramKey != null) {
      // 検索を実行
      getIndex(`/api/info/index?page=1`, search, setBlogs, setIsLoading);
      setSearchResult(paramKey);
    }
  }, [paramKey]); // eslint-disable-line

  //検索を実行
  // const submitSearch = (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   router.push({
  //     pathname: '/search', //URL
  //     query: { keyword: search.keyword }, //検索クエリ
  //   });
  // };

  //並び順変更・ページネーション等を操作した場合
  useEffect(() => {
    getIndex(`/api/info/index?page=1`, search, setBlogs, setIsLoading);
  }, [search.paginate, search.order, search.sort]); // eslint-disable-line

  return (
    <InfoLayout>
      <div className="block md:flex items-center justify-between py-2 md:py-4">
        <BreadCrumb tag="" />
      </div>

      <div className="block md:flex items-center justify-between py-2 md:py-4 mx-4 md:mx-0">
        <h1 className="font-bold text-2xl mb-8">
          {title} <span className={(searchResult == '' && 'hidden ') + ' text-base'}>&nbsp;&nbsp;タグ：{searchResult}</span>
        </h1>
        {/* <div className="flex items-center justify-between gap-4 relative text-gray-600">
          <select
            onChange={(e) => {
              handleSelect(Number(e.target.value), search.order, search.sort);
            }}
            className="bg-whitw border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[100px] p-3"
            required
          >
            <option value="20">20件</option>
            <option value="50">50件</option>
            <option value="100">100件</option>
          </select>
          <select
            onChange={(e) => handleSelect(search.paginate, e.target.value.split(':')[0], e.target.value.split(':')[1])}
            className="bg-whitw border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[180px] p-3"
            required
          >
            <option value="infos.updated_at:desc">更新（新しい順）</option>
            <option value="infos.updated_at:asc">更新（古い順）</option>
          </select>
          <div className="hidden md:block">{searchHtml()}</div>
        </div> */}
      </div>

      {isLoading && <Loading />}

      <div className={isLoading ? 'hidden' : ''}>
        {blogs.data.length === 0 && <div className="m-6 text-lg">見つかりませんでした。</div>}
        <div className={blogs.data.length === 0 ? 'hidden' : ''}>
          <div className="hidden md:block">
            <Pagination route={'/api/info/index'} search={search} data={blogs} setData={setBlogs} setIsLoading={setIsLoading} />
          </div>
          <section className="mx-4 md:mx-0">
            {blogs.data.map((blog, index) => {
              return (
                <article className="bg-neutral-50 md:bg-white rounded-md shadow-md my-6 p-4 border-2 border-white hover:border-blue-400 duration-75" key={index}>
                  <Link href={`info/${blog.url}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm p-2 bg-gray-200 rounded-md">
                        <TagIcon className="h-4 w-4 -mt-0.5 inline mr-2" />
                        {blog.tag}
                      </span>
                      <p className="text-gray-400 flex items-center gap-2 text-sm">
                        <ClockIcon className="h-5 w-5" />
                        {blog.updated_at}
                      </p>
                    </div>
                    <h2 className="font-bold text-lg my-3">{blog.title}</h2>
                    <p className="break-words line-clamp-2">{blog.description}</p>
                  </Link>
                </article>
              );
            })}
          </section>
          <Pagination route={'/api/info/index'} search={search} data={blogs} setData={setBlogs} setIsLoading={setIsLoading} />
        </div>
        {/* <div className="md:hidden mx-4 mt-6">{searchHtml()}</div> */}
      </div>
    </InfoLayout>
  );
}
