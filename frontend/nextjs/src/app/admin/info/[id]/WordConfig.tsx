import { useState, useContext, useEffect } from 'react';
import { CheckCircleIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'flowbite-react';
import { Loading } from '@/components/Loading';
import { FrashMessage } from '@/components/FrashMessage';
import { Pagination } from '@/components/Pagination';
import Link from 'next/link';
import { configAtoms } from '@/recoil/configAtoms';
import { useRecoilState } from 'recoil';
import { useLaravelApi } from '@/hooks/laravelApi';
import { useSearch } from '@/hooks/Search';

interface WordConfigItem {
  id: number | null;
  word: string;
  substituteWord: string;
  configTag: string;
}

interface WordConfigIndex {
  current_page: number;
  data: WordConfigItem[];
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

interface WordConfigProps {
  setOpenModal: any;
}

export default function WordConfig(props: any) {
  const { setOpenModal } = props;
  // blogs ステートの初期値を設定
  const initialData: WordConfigIndex = {
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

  const [wordConfigs, setWordConfigs] = useState<WordConfigItem[]>([]);

  const [wordConfigIndex, setWordConfigIndex] = useState<WordConfigIndex>(initialData);

  //読み込み中
  const [isLoading, setIsLoading] = useState(false);

  //フラッシュメッセージ
  const [frash, setFrash] = useState({ element: '', message: '' });

  //検索関連
  const { search, handleSearch, handleSelect, searchResult, setSearchResult } = useSearch('word_configs.updated_at');
  //検索実行
  const submitSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    getIndex('/api/infoEdit/wordConfigIndex?page=1', search, setWordConfigIndex, setIsLoading);
    setSearchResult(search.keyword);
  };

  const { getIndex, postData } = useLaravelApi();

  useEffect(() => {
    if (frash.element != 'excution') {
      getIndex('/api/infoEdit/wordConfigIndex?page=1', search, setWordConfigIndex, setIsLoading);
    }
  }, [frash, search.paginate, search.order, search.sort]); // eslint-disable-line

  useEffect(() => {
    if (wordConfigIndex.data.length > 0) {
      setWordConfigs(wordConfigIndex.data);
    }
  }, [wordConfigIndex]); // eslint-disable-line

  const [config] = useRecoilState(configAtoms);
  const tags = config.wordConfigTag;

  //入力
  const handleChange = (indexId: number, requestWordConfig: WordConfigItem) => {
    const editWordConfigs = wordConfigs.map((wordConfig, index) => {
      if (index === indexId) {
        wordConfig.id = wordConfig.id;
        wordConfig.word = requestWordConfig.word;
        wordConfig.substituteWord = requestWordConfig.substituteWord;
        wordConfig.configTag = requestWordConfig.configTag;
      }
      return wordConfig;
    });
    setWordConfigs(editWordConfigs);
  };

  //タグ編集
  const handleTag = (indexId: number, requestTag: string) => {
    const editWordConfigs = wordConfigs.map((wordConfig, index) => {
      if (index === indexId) {
        wordConfig.configTag = requestTag;
      }
      return wordConfig;
    });
    setWordConfigs(editWordConfigs);
  };

  //コンテンツ追加
  const handleAdd = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // 新しいコンテンツ
    const createWordConfig: WordConfigItem = {
      id: null,
      word: '',
      substituteWord: '',
      configTag: '',
    };
    setWordConfigs([...wordConfigs, createWordConfig]);
  };

  //子コンテンツ削除;
  const handleDelete = (indexId: number) => {
    const deleteWordConfigs = wordConfigs.filter((wordConfig, index) => index !== indexId);
    setWordConfigs(deleteWordConfigs);
  };

  //コピー
  const handleCopy = async (copyWord: string) => {
    await global.navigator.clipboard.writeText('{{' + copyWord + '}}');
    setOpenModal(undefined);
  };

  //送信関連
  // console.log("result:", BlogValue, childBlogValues, tag);
  const submitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    postData(wordConfigs, '/api/infoEdit/wordConfigStore', setIsLoading, setFrash);
  };

  // スケルトンスクリーン6回繰り返すための配列を生成
  const skeltonItems = Array(6)
    .fill(undefined)
    .map((_, index) => index);

  return (
    <>
      <FrashMessage frash={frash} setFrash={setFrash} />
      <section className="h-[70vh]">
        <div className="flex items-center justify-between gap-4 pt-2  text-gray-600 mb-8">
          <h2 className={(searchResult == '' && 'hidden ') + ' text-base'}>&nbsp;&nbsp;検索ワード：{searchResult}</h2>
          <div className={(searchResult !== '' && 'hidden') + ' text-base'}></div>
          <div className="flex items-start gap-4">
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
            <form onSubmit={submitSearch} className="relative">
              <input
                value={search.keyword}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                className="md:w-[300px] border-2 border-gray-200 bg-white h-12 px-5 pr-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                type="search"
              />
              <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
              </button>
            </form>
          </div>
        </div>
        <Pagination route={'/api/infoEdit/wordConfigIndex'} search={search} data={wordConfigs} setData={setWordConfigs} setIsLoading={setIsLoading} />
        <div className={isLoading ? '' : 'hidden'}>
          <table cellPadding={0} className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-2 border-gray-200 p-4 w-2/6">&#123;&#123;&nbsp;定形文&nbsp;&#125;&#125;</th>
                <th className="border-2 border-gray-200 p-4 w-2/6">ページ上で表示される文</th>
                <th className="border-2 border-gray-200 p-4 w-1/6">タグ</th>
                <th className="border-2 border-gray-200 p-4 w-1/6">操作</th>
              </tr>
            </thead>
            <tbody>
              {skeltonItems.map((index) => (
                <tr key={index}>
                  <td className="border-2 border-gray-200 relative">
                    <div className="h-2 bg-gray-200 rounded-full  m-6 animate-pulse"></div>
                  </td>
                  <td className="border-2 border-gray-200 relative">
                    <div className="h-2 bg-gray-200 rounded-full  m-6 animate-pulse"></div>
                  </td>
                  <td className="border-2 border-gray-200">
                    <div className="h-2 bg-gray-200 rounded-full  m-6 animate-pulse"></div>
                  </td>
                  <td className="border-2 border-gray-200">
                    <div className="flex items-center justify-center">
                      <button type="button" className="py-1 px-4 bg-gray-200 hover:bg-gray-300 duration-75 rounded-md">
                        コピー
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-4">
            <button type="submit" className="p-3 my-6 flex items-center text-white bg-gray-400 hover:bg-gray-500 duration-100 rounded shadow">
              <PlusIcon className="w-6 h-6 mr-2 text-white" />
              追加
            </button>
            <button type="submit" className="p-3 my-6 flex items-center text-white bg-blue-400 hover:bg-blue-500 duration-100 rounded shadow">
              <CheckCircleIcon className="w-6 h-6 mr-2 text-white" />
              保存する
            </button>
          </div>
        </div>
        <div className={isLoading ? 'hidden' : ''}>
          <form onSubmit={submitForm}>
            <table cellPadding={0} className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-2 border-gray-200 p-4 w-2/6">&#123;&#123;&nbsp;定形文&nbsp;&#125;&#125;</th>
                  <th className="border-2 border-gray-200 p-4 w-2/6">ページ上で表示される文</th>
                  <th className="border-2 border-gray-200 p-4 w-1/6">タグ</th>
                  <th className="border-2 border-gray-200 p-4 w-1/6">操作</th>
                </tr>
              </thead>
              <tbody>
                {wordConfigs &&
                  wordConfigs.map((wordConfig, index) => (
                    <tr key={index}>
                      <td className="border-2 border-gray-200 relative">
                        {wordConfig.id === null ? (
                          <>
                            <PencilSquareIcon className="w-5 h-5 mr-2 text-gray-500 absolute top-4 left-2" />
                            <input
                              value={wordConfig.word}
                              onChange={(e) => {
                                handleChange(index, {
                                  ...wordConfig,
                                  word: e.target.value,
                                });
                              }}
                              type="text"
                              required
                              className="border-0 py-4 pl-8 w-full focus:ring-2 focus:ring-blue-400"
                            />
                          </>
                        ) : (
                          <span className="pl-6">{wordConfig.word}</span>
                        )}
                      </td>
                      <td className="border-2 border-gray-200 relative">
                        <PencilSquareIcon className="w-5 h-5 mr-2 text-gray-500 absolute top-4 left-2" />
                        <input
                          value={wordConfig.substituteWord}
                          onChange={(e) => {
                            handleChange(index, {
                              ...wordConfig,
                              substituteWord: e.target.value,
                            });
                          }}
                          type="text"
                          required
                          className="border-0 py-4 pl-8 w-full focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="border-2 border-gray-200">
                        <div className="flex items-center justify-center">
                          <select
                            onChange={(e) => {
                              handleTag(index, e.target.value);
                            }}
                            className="border-0 focus:ring-blue-400 focus:ring-2 w-full p-4"
                            required
                          >
                            <option value={wordConfig.configTag}>{wordConfig.configTag}</option>
                            {tags.map((tag, index) => (
                              <option value={tag} key={index}>
                                {tag}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="border-2 border-gray-200">
                        <div className="flex items-center justify-center">
                          {wordConfig.id === null ? (
                            <Tooltip content="削除">
                              <TrashIcon onClick={() => handleDelete(index)} className="w-5 h-5 text-gray-500 hover:text-red-400 duration-75 cursor-pointer" />
                            </Tooltip>
                          ) : (
                            <button onClick={() => handleCopy(wordConfig.word)} type="button" className="py-1 px-4 bg-gray-200 hover:bg-gray-300 duration-75 rounded-md">
                              コピー
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="flex items-center gap-4">
              <button onClick={handleAdd} type="submit" className="p-3 my-6 flex items-center text-white bg-gray-400 hover:bg-gray-500 duration-100 rounded shadow">
                <PlusIcon className="w-6 h-6 mr-2 text-white" />
                追加
              </button>
              <button type="submit" className="p-3 my-6 flex items-center text-white bg-blue-400 hover:bg-blue-500 duration-100 rounded shadow">
                保存する
              </button>
              <Link
                href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/infoEdit/wordConfigCommon`}
                target="_blank"
                className="p-3 my-6 flex items-center text-white bg-blue-400 hover:bg-blue-500 duration-100 rounded shadow"
              >
                コンフィグ取込
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
