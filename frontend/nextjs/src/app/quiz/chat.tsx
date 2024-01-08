'use client';

import { useEffect, useRef, useState } from 'react';
import axios, { csrf } from '@/lib/axios';
import { Loading } from '@/components/Loading';
import { useQuestion } from '@/hooks/Question';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { isLoadingState } from '@/recoil/isLoadingAtom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAlt from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAlt from '@mui/icons-material/ThumbDownOffAlt';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import { CreateForm } from './createForm';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useChat } from '@/hooks/Chat';
import { questionState } from '@/recoil/questionAtom';
import useSound from 'use-sound';

export const Chat = () => {
  const { question, isQuestionLoading, regenerateQuestion, tryChanceCount } = useQuestion();
  const { chats, setChats, request, setRequest } = useChat();

  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);

  //チャットがある度に下にスクロール
  useEffect(() => {
    if (chats.length > 1) {
      const scrollToBottom = () => {
        if (contentRef.current) {
          contentRef.current.scrollIntoView({
            behavior: 'smooth',
          });
        }
      };
      scrollToBottom();
    }
  }, [chats]);

  return (
    <article>
      {isQuestionLoading ? (
        <div className="py-7">
          <Loading />
        </div>
      ) : (
        <>
          <h2 className="flex items-center justify-center text-xl md:text-2xl text-center font-bold p-4 bg-neutral-100 sticky top-0 z-50">
            お題：{question.genre}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AutorenewOutlinedIcon onClick={regenerateQuestion} className="w-6 h-6 -mt-1 mx-4 text-gray-400 hover:text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>お題を変える</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h2>
          <section className="flex items-center justify-center gap-4 mb-6 mr-4">
            {/* <div className="text-gray-400">123 Play</div> */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-gray-400 cursor-default">
                    <ThumbUpOffAlt className="h-8 w-8 mr-1" />
                    {question.good}
                  </span>
                </TooltipTrigger>
                <TooltipContent>お題の高評価</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-gray-400 cursor-default">
                    <ThumbDownOffAlt className="h-8 w-8 mr-1" />
                    {question.bad}
                  </span>
                </TooltipTrigger>
                <TooltipContent>お題の低評価</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </section>
        </>
      )}
      <section className="p-4">
        <ul className="space-y-10 mb-[300px]">
          <li className="zoomIn p-6 space-y-2 rounded-md bg-white shadow-xl w-[320px] md:w-[500px]">
            <h3 className="flex items-center gap-2">
              <Image src="/publiq.png" alt="logo" width={30} height={30} />
              <b className="text-lg">システム</b>
            </h3>
            <p>私に質問をして正解を当てて下さい。</p>
            <p>なお、質問には「はい」か「いいえ」でしか答えません。</p>
          </li>
          <li className="zoomIn p-6 space-y-2 rounded-md bg-white shadow-xl w-[320px] md:w-[500px]">
            <h3 className="flex items-center gap-2">
              <Image src="/publiq.png" alt="logo" width={30} height={30} />
              <b className="text-lg">システム</b>
            </h3>
            <p>正解を回答する場合は「正解は〇〇？」と聞いてください。</p>
            <p>なお、3回間違えるとゲームオーバーです。</p>
          </li>
          <li className="zoomIn p-6 space-y-2 rounded-md bg-white shadow-xl w-[320px] md:w-[500px]">
            <h3 className="flex items-center gap-2">
              <Image src="/publiq.png" alt="logo" width={30} height={30} />
              <b className="text-lg">システム</b>
            </h3>
            <p>各お題にはチャット内に含まれていたら即ゲームオーバーになる「地雷ワード」が複数ございます。お気をつけ下さい。</p>
            <p>例：お題「麺類」</p>
            <p>正解：そば</p>
            <p>地雷ワード：うどん,ラーメン,パスタ</p>
          </li>
          {chats.map((chat, index) => {
            return (
              <li className={`${chat.isUser && 'ml-auto'} ${chat.message == '' && 'hidden'} zoomIn p-6 space-y-2 rounded-md bg-white shadow-xl w-[320px] md:w-[500px]`} key={index}>
                {chat.isUser && (
                  <>
                    <h3 className="flex items-center gap-2">
                      <b className="text-lg">あなた</b>
                    </h3>
                    <p>{chat.message}</p>
                  </>
                )}
                {!chat.isUser && (
                  <>
                    <h3 className="flex items-center gap-2">
                      <Image src="/publiq.png" alt="logo" width={30} height={30} />
                      <b className="text-lg">システム</b>
                    </h3>

                    <p>{chat.message}</p>
                    {chat.message.includes('違う') && <p>残り{tryChanceCount}回間違えるとゲームオーバーです。</p>}
                    {!chat.message.includes('正解') && <Hint />}
                    {chat.message.includes('正解') && (
                      <>
                        <p>正解ワード：{question.answer}</p>
                        <p>
                          地雷ワード：
                          {question.failWord1 != '' && `${question.failWord1}`}
                          {question.failWord2 != '' && `,${question.failWord2}`}
                          {question.failWord3 != '' && `,${question.failWord3}`}
                        </p>
                        <Review />
                        <section className="flex items-center gap-4">
                          <button onClick={regenerateQuestion} className="px-4 py-2 rounded-md  bg-gray-900 text-white hover:text-amber-500 duration-150">
                            別の問題に挑戦
                          </button>
                          <CreateForm />
                        </section>
                      </>
                    )}
                  </>
                )}
                <ChatSound result={chat.message} />
              </li>
            );
          })}
          {isLoading && <Loading />}
        </ul>
        <div ref={contentRef}></div>
      </section>
    </article>
  );
};

export function ChatSound(props: { result: string }) {
  const { result } = props;
  const [playSuccess] = useSound('/sounds/クイズ正解2.mp3');
  const [playChat] = useSound('/sounds/決定ボタンを押す.mp3');

  useEffect(() => {
    if (result == '正解！') {
      playSuccess();
    } else if (result != '') {
      playChat();
    }
  }, [playSuccess, playChat, result]);
  return <></>;
}

export function Hint() {
  const [question, setQuestion] = useRecoilState(questionState);
  const { chats, setChats, request, setRequest } = useChat();

  const hintWord = () => {
    const newChat = {
      isUser: false,
      message: `ヒント：${question.hint}`,
    };
    setChats((prev) => [...prev, newChat]);
  };

  const hintFirstWord = () => {
    const newChat = {
      isUser: false,
      message: `ヒント：最初のワード「${question.answer[0]}」`,
    };
    setChats((prev) => [...prev, newChat]);
  };

  const hintWordCount = () => {
    const newChat = {
      isUser: false,
      message: `ヒント「${question.answer.length}文字」`,
    };
    setChats((prev) => [...prev, newChat]);
  };

  const giveUp = () => {
    const newChat = {
      isUser: false,
      message: `正解`,
    };
    setChats((prev) => [...prev, newChat]);
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <span className="text-gray-300 mx-2">ヒント</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {question.hint != '' && (
            <DropdownMenuItem>
              <button onClick={hintWord} className="py-2">
                出題者が作ったヒント
              </button>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <button onClick={hintFirstWord} className="py-2">
              正解の最初のワード
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button onClick={hintWordCount} className="py-2">
              正解ワードの文字数
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button onClick={giveUp} className="text-gray-300 mx-2">
        ギブアップ
      </button>
    </div>
  );
}

export function Review() {
  const [isGood, setIsGood] = useState(false);
  const sendGood = () => {
    if (!isBad) {
      setIsGood(true);
      sendReview('good');
    }
  };

  const [isBad, setIsBad] = useState(false);
  const sendBad = () => {
    if (!isGood) {
      setIsBad(true);
      sendReview('bad');
    }
  };

  const [question] = useRecoilState(questionState);

  const sendReview = async (request: string) => {
    await csrf();
    axios.post(`/api/question/review`, { id: question.id, review: request }).catch((error) => {
      if (error.response.status !== 422) throw error;
    });
  };

  return (
    <div className="flex items-center gap-4 pb-6">
      お題の評価：
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{isGood ? <ThumbUpAltIcon className="h-7 w-7" /> : <ThumbUpOffAlt onClick={sendGood} className="h-7 w-7 cursor-pointer" />}</TooltipTrigger>
          <TooltipContent>高評価</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{isBad ? <ThumbDownAltIcon className="h-7 w-7" /> : <ThumbDownOffAlt onClick={sendBad} className="h-7 w-7 cursor-pointer" />}</TooltipTrigger>
          <TooltipContent>低評価</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
