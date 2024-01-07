'use client';
import { useEffect, useState, useCallback } from 'react';
import { Dropdown } from 'flowbite-react';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon, EllipsisVerticalIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Pagination } from '@/components/Pagination';
import { FrashMessage } from '@/components/FrashMessage';
import { Loading } from '@/components/Loading';
import { useCheckbox } from '@/hooks/Checkbox';
import { useSearch } from '@/hooks/Search';
import { useLaravelApi } from '@/hooks/LaravelApi';

const title: string = '投稿管理';

export default function IndexBrog() {
  // blogs ステートの初期値を設定
  const initialBlogData: InfoData = {
    current_page: 1,
    data: [],
    first_page_url: '',
    from: 0,
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: 20, // 必要に応じて変更
    prev_page_url: null,
    to: 0,
    total: 0,
  };
  const [blogs, setBlogs] = useState<InfoData>(initialBlogData);

  //読み込み中
  const [isLoading, setIsLoading] = useState(true);

  //フラッシュメッセージ
  const [frash, setFrash] = useState({ element: '', message: '' });

  //チェックボックス関連
  const { checks, setChecks, handleChecked, handleBulkChecked, selectChecks } = useCheckbox();

  //検索関連
  const { search, handleSearch, handleSelect, searchResult, setSearchResult } = useSearch('infos.updated_at');
  //検索実行
  const submitSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    getIndex('/api/infoEdit/index?page=1', search, setBlogs, setIsLoading);
    setSearchResult(search.keyword);
  };

  //APIを叩きページ一覧取得
  const { getIndex, deleteDatas } = useLaravelApi();
  useEffect(() => {
    if (frash.element != 'excution') {
      getIndex('/api/infoEdit/index?page=1', search, setBlogs, setIsLoading);
    }
  }, [frash, search.paginate, search.order, search.sort]); // eslint-disable-line

  useEffect(() => {
    const blogIds = blogs.data.map((blog) => blog['id']);
    const initialBlogIds = blogIds.map((blogId) => {
      return {
        id: blogId,
        checked: false,
      };
    });
    setChecks(initialBlogIds);
  }, [blogs, setChecks]);

  //一括削除
  const bulkDeleteRequest = () => {
    const deleteIds = selectChecks.map((selectCheck) => {
      return Number(selectCheck.id);
    });
    deleteDatas(deleteIds, '/api/infoEdit/delete', setIsLoading, setFrash);
  };

  //単体削除
  const deleteRequest = (e: { currentTarget: { getAttribute: (arg0: string) => any } }) => {
    const deleteID = [Number(e.currentTarget.getAttribute('data-num'))];
    deleteDatas(deleteID, '/api/infoEdit/delete', setIsLoading, setFrash);
  };

  return (
    <>
      <FrashMessage frash={frash} setFrash={setFrash} />
      <h1 className="font-bold text-2xl mb-8">
        {title} <span className={(searchResult == '' && 'hidden ') + ' text-base'}>&nbsp;&nbsp;検索ワード：{searchResult}</span>
      </h1>
      <div className="relative overflow-x-auto">
        <div className="pb-2 flex items-center justify-between">
          <div className="mt-1 flex items-center">
            <div>
              <Link href="/admin/info/create" className="text-white bg-blue-400 hover:bg-blue-500 mt-3 rounded p-2 pr-4 text-center inline-flex items-center duration-75">
                <PlusIcon className="h-5 w-5 mr-2 -mt-0.5 text-white" />
                新規作成
              </Link>
            </div>
            <div className="mx-4">
              <button
                onClick={bulkDeleteRequest}
                type="button"
                className={(isLoading ? '' : '') + ' text-white bg-gray-400 hover:bg-gray-500 mt-3 rounded p-2 px-4 text-center inline-flex items-center duration-75'}
              >
                {selectChecks.length}件：削除
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2 relative  text-gray-600">
            <select
              onChange={(e) => {
                handleSelect(Number(e.target.value), search.order, search.sort);
              }}
              className="bg-whitw border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-[100px] p-3"
              required
            >
              <option value="20">20件</option>
              <option value="50">50件</option>
              <option value="100">100件</option>
            </select>
            <form onSubmit={submitSearch}>
              <input
                value={search.keyword}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                className="md:w-[300px] border-2 border-gray-200 bg-white h-12 px-5 pr-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                type="search"
              />
              <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
              </button>
            </form>
          </div>
        </div>

        {isLoading && <Loading />}

        <div className={isLoading ? 'hidden' : ''}>
          <Pagination route={'/api/infoEdit/index'} search={search} data={blogs} setData={setBlogs} setIsLoading={setIsLoading} />
          <table className="w-full text-left text-gray-500">
            <thead className="text-gray-700 uppercase border-b">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        handleBulkChecked(e.target.checked);
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-400 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label className="sr-only">checkbox</label>
                  </div>
                </th>
                <th
                  onClick={() => {
                    handleSelect(search.paginate, 'infos.title', search.sort == 'desc' ? 'asc' : 'desc');
                  }}
                  scope="col"
                  className="px-6 py-3 md:w-[70%] flex items-center whitespace-nowrap hover:opacity-60 cursor-pointer"
                >
                  ページタイトル
                  {search.sort == 'desc' ? <ChevronDownIcon className="h-4 w-4 ml-2 -mt-0.5 font-bold" /> : <ChevronUpIcon className="h-4 w-4 ml-2 -mt-0.5" />}
                </th>
                <th
                  onClick={() => {
                    handleSelect(search.paginate, 'tags.name', search.sort == 'desc' ? 'asc' : 'desc');
                  }}
                  scope="col"
                  className="px-6 py-3 whitespace-nowrap hover:opacity-60 cursor-pointer"
                >
                  <span className="px-2 whitespace-nowrap flex items-center">
                    登録タグ
                    {search.sort == 'desc' ? <ChevronDownIcon className="h-4 w-4 ml-2 -mt-0.5 font-bold" /> : <ChevronUpIcon className="h-4 w-4 ml-2 -mt-0.5" />}
                  </span>
                </th>
                <th
                  onClick={() => {
                    handleSelect(search.paginate, 'infos.public', search.sort == 'desc' ? 'asc' : 'desc');
                  }}
                  scope="col"
                  className="px-6 py-3 whitespace-nowrap hover:opacity-60 cursor-pointer"
                >
                  <span className="px-2 whitespace-nowrap flex items-center">
                    公開
                    {search.sort == 'desc' ? <ChevronDownIcon className="h-4 w-4 ml-2 -mt-0.5 font-bold" /> : <ChevronUpIcon className="h-4 w-4 ml-2 -mt-0.5" />}
                  </span>
                </th>
                <th
                  onClick={() => {
                    handleSelect(search.paginate, 'infos.updated_at', search.sort == 'desc' ? 'asc' : 'desc');
                  }}
                  scope="col"
                  className="px-6 py-3 text-center whitespace-nowrap hover:opacity-60 cursor-pointer"
                >
                  <span className="px-2 whitespace-nowrap flex items-center">
                    更新日時
                    {search.sort == 'desc' ? <ChevronDownIcon className="h-4 w-4 ml-2 -mt-0.5 font-bold" /> : <ChevronUpIcon className="h-4 w-4 ml-2 -mt-0.5" />}
                  </span>
                </th>
                <th scope="col" className="px-10 py-3 text-right whitespace-nowrap">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {blogs.data &&
                blogs.data.map((blog, index) => (
                  <tr className="bg-white border-b hover:bg-gray-50" key={blog.id}>
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={checks.length > 0 && checks[index] != undefined && checks[index].checked}
                          onChange={() => {
                            handleChecked(index);
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-400 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <th scope="row" className="px-6 py-4 text-gray-900 font-normal">
                      <Link href={'/admin/info/' + blog.id} className="underline">
                        {blog.title}
                      </Link>
                    </th>
                    <th className="px-6 py-4">
                      <span className="py-1 px-2 rounded bg-gray-200 font-normal text-gray-900 text-sm whitespace-nowrap">{blog.tag}</span>
                    </th>
                    <td className="px-6 py-4">
                      <span className="py-1 px-2 whitespace-nowrap">{blog.public == 1 ? '公開' : '非公開'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="py-1 px-2">{blog.updated_at}</span>
                    </td>
                    <td className="px-10 py-4 flex justify-end">
                      <Dropdown inline label={<EllipsisVerticalIcon className="h-5 w-6 text-gray-500 my-auto" />} arrowIcon={false}>
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                          <li>
                            <Link href={'/admin/info/' + blog.id} className="px-4 py-2 hover:bg-gray-100 flex items-center">
                              <PencilIcon className="h-4 w-4 mr-2 text-gray-500" />
                              編集
                            </Link>
                          </li>
                          <li>
                            <button onClick={deleteRequest} data-num={blog.id} type="button" className="px-4 py-2 hover:bg-gray-100 flex items-center">
                              <TrashIcon className="h-4 w-4 mr-2 text-gray-500" />
                              削除
                            </button>
                          </li>
                        </ul>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Pagination route={'/api/infoEdit/index'} search={search} data={blogs} setData={setBlogs} setIsLoading={setIsLoading} />
        </div>
      </div>
    </>
  );
}
