import axios, { csrf } from "@/lib/axios";
import { chatState, requestState } from "@/recoil/chatAtom";
import {
  isFailState,
  questionState,
  tryChanceStateCount,
} from "@/recoil/questionAtom";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export const useQuestion = () => {
  const [question, setQuestion] = useRecoilState(questionState);
  const [chats, setChats] = useRecoilState(chatState);
  const [isFail, setIsFail] = useRecoilState(isFailState);

  const [tryChanceCount, setTryChaceCount] =
    useRecoilState(tryChanceStateCount);

  useEffect(() => {
    if (tryChanceCount == 0) {
      setIsFail(true);
    }
  }, [setIsFail, setQuestion, tryChanceCount]);

  const router = useRouter();
  const searchParams = useSearchParams();

  //問題をフェッチする処理
  const {
    data,
    error: questionError,
    isLoading: isQuestionLoading,
  } = useSWR(
    searchParams.get("id") == null
      ? "/api/question/random"
      : `/api/question/show?id=${searchParams.get("id")}`,
    fetcher
  );

  useEffect(() => {
    if (data != undefined) {
      setQuestion(data);
    }
  }, [data, setQuestion]);

  // 404 エラー時のエラーハンドリング
  useEffect(() => {
    if (questionError?.response?.status === 404) {
      // 404 エラーが発生した場合の処理をここに追加
      // 例: リダイレクトやエラーメッセージの表示など
      router.push("404");
    }
  }, [questionError, router]);

  //別の問題に変更
  const regenerateQuestion = () => {
    if (searchParams.get("id") != null) {
      router.push("/quiz");
    }
    mutate("/api/question/random");
    setChats([
      {
        isUser: true,
        message: "",
      },
    ]);
  };

  const failWords = [
    question.failWord1,
    question.failWord2,
    question.failWord3,
  ];

  //地雷ワードが含まれているかチェック
  const isContainsFailWord = (word: string): boolean =>
    failWords.includes(word);

  return {
    question,
    setQuestion,
    isQuestionLoading,
    questionError,
    mutate,
    isContainsFailWord,
    regenerateQuestion,
    tryChanceCount,
    setTryChaceCount,
  };
};
