'use client';
import { useCountText } from '@/hooks/CounstText';
import axios, { csrf } from '@/lib/axios';
import Send from '@mui/icons-material/Send';
import { chatState } from '@/recoil/chatAtom';
import { useRecoilState } from 'recoil';
import { isLoadingState } from '@/recoil/isLoadingAtom';
import { isFailState } from '@/recoil/questionAtom';
import { useQuestion } from '@/hooks/Question';
import { useSendChatForm } from '@/validation/sendChatForm';
import { useChat } from '@/hooks/Chat';
import { useRecapcha } from '@/hooks/Recapcha';

export const SendForm = () => {
  const { request, setRequest, handleEdit, errors, isVaridateError } = useSendChatForm();
  const { isQuestionLoading, tryChanceCount, setTryChaceCount } = useQuestion();
  const { chats, setChats } = useChat();
  const [isFail, setIsFail] = useRecoilState(isFailState);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const { isContainsFailWord } = useQuestion();
  const { isRecapchaCheck, handleRecapcha } = useRecapcha();

  const addChats = (reqMessage: string, reqIsUser: boolean) => {
    const newChat = { isUser: reqIsUser, message: reqMessage };
    setChats((prev) => [...prev, newChat]);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    addChats(request.sentence, true);
    //地雷ワードチェック
    // if (isContainsFailWord(request.sentence)) {
    //   setIsFail(true);
    // }
    setIsLoading(true);
    e.preventDefault();

    const post = async () => {
      await csrf();
      const res = await axios.post(`/api/question/store`, request);
      setRequest((prev) => ({ ...prev, sentence: '' }));
      addChats(res.data.result, false);

      // 違っていたら回答挑戦回数を１減らす
      if (res.data.result === '違う！') {
        setTryChaceCount((prev) => prev - 1);
      }
      setIsLoading(false);
    };

    //リキャプチャのチェックを通過していたらそのままpost まだの場合はリキャプチャのチェック後にpost
    if (isRecapchaCheck || (await handleRecapcha())) {
      await post();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 md:bottom-4 p-2 bg-gray-100 opacity-95 mx-auto w-full xl:w-[1280px]">
      <p className="text-red-700 text-sm">{errors.sentence}</p>
      {!isLoading && !isQuestionLoading && (
        <div className="flex items-center justify-center gap-4 mx-auto">
          <input
            name="sentence"
            onChange={handleEdit}
            value={request.sentence}
            type="text"
            placeholder="できるだけ詳しく質問をして下さい。"
            required
            className={`text-sm w-full p-3 border border-gray-200 rounded duration-100 placeholder-gray-300`}
          />
          {!isVaridateError && (
            <button onClick={handleRecapcha}>
              <Send className="mr-1 -mt-1 text-amber-500" />
            </button>
          )}
          {isVaridateError && <Send className="mr-1" />}
        </div>
      )}
    </form>
  );
};
