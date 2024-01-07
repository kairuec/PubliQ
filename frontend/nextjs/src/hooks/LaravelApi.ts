import useSWR from 'swr';
import axios, { csrf } from '@/lib/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

//laravelのAPIを叩く際に使う汎用的なメソッド
export const useLaravelApi = () => {
  //URLパラメータの値の取得
  const params = useSearchParams();
  const paramKey = params.get('keyword');

  //一覧
  const getIndex = async (route: string, search: SearchData, setData: React.Dispatch<React.SetStateAction<any>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsLoading(true);
    await csrf();
    axios
      .post(route + `&paramKey=${paramKey}`, search)
      .then((res) => {
        setData(res.data);
        setIsLoading(false); // データが反映された後にローディングを終了
      })
      .catch((error) => {
        if (error.response.status !== 409) throw error;
        setIsLoading(false); // エラーの場合もローディングを終了
      });
  };

  //1ページだけ取得
  const getData = async (route: string, setData: React.Dispatch<React.SetStateAction<any>>, setIsloading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsloading(true);
    await csrf();
    axios
      .post(route)
      .then((res) => {
        setData(res.data.data);
        setIsloading(false);
      })
      .catch((error) => {});
  };

  //削除機能機能
  const deleteDatas = async (ids: number[], route: string, setIsloading: React.Dispatch<React.SetStateAction<boolean>>, setFrash: (frash: frashMessage) => void) => {
    setIsloading(true);
    await csrf();
    axios
      .post(route, ids)
      .then((res) => {
        setIsloading(false);
        setFrash(res.data);
      })
      .catch((error) => {});
  };

  //送信
  const postData = async (args: any, route: string, setIsloading: React.Dispatch<React.SetStateAction<boolean>>, setFrash: (frash: frashMessage) => void) => {
    await csrf();
    axios
      .post(route, args)
      .then((res) => {
        setIsloading(false);
        setFrash(res.data);
      })
      .catch((error) => {
        // console.log(error);
        // if (error.response.status !== 422) throw error;
      });
  };

  return {
    getIndex,
    getData,
    deleteDatas,
    postData,
  };
};
