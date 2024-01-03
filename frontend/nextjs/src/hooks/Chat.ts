import axios, { csrf } from "@/lib/axios";
import { chatState, requestState } from "@/recoil/chatAtom";
import { questionState } from "@/recoil/questionAtom";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export const useChat = () => {
  //問題の状態
  const [question, setQuestion] = useRecoilState(questionState);
  //ユーザーが送信する内容
  const [request, setRequest] = useRecoilState(requestState);
  //チャットログ
  const [chats, setChats] = useRecoilState(chatState);

  //お題と正解を状態に入れる
  useEffect(() => {
    setRequest((prev) => ({
      ...prev,
      genre: question.genre,
      answer: question.answer,
    }));
  }, [question, setRequest]);

  return {
    chats,
    setChats,
    request,
    setRequest,
  };
};
