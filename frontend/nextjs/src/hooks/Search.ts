import { useState, useCallback, useEffect } from 'react';

//引数はデータベースのテーブル名とカラム例：images.updeted_at
export const useSearch = (requestOrder: string) => {
  //検索
  const [search, setSearch] = useState({
    paginate: 20,
    order: requestOrder,
    sort: 'desc',
    keyword: '',
    element: '',
  });

  const handleSearch = useCallback((requestWord: string) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      keyword: requestWord,
    }));
  }, []);

  //並び順変更
  const handleSelect = (requestPaginate: number, requestOrder: string, requestSort: string) => {
    setSearch({ ...search, paginate: requestPaginate, order: requestOrder, sort: requestSort });
    setSearchResult(search.keyword);
  };

  //検索結果
  const [searchResult, setSearchResult] = useState('');

  return { search, handleSearch, handleSelect, searchResult, setSearchResult };
};
