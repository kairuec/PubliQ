import { useEffect, useState } from "react";
import { z } from "zod";
import { useRecoilState } from "recoil";
import { chatState, requestState } from "@/recoil/chatAtom";
import { useCountText } from "@/hooks/CounstText";
import { useQuestion } from "@/hooks/Question";
import { useChat } from "@/hooks/Chat";

export function useSendChatForm() {
  const { question, setQuestion } = useQuestion();
  const { chats, setChats, request, setRequest } = useChat();

  const { countFull1half05 } = useCountText();
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  //zodバリデーション
  const RequestSchema = z.object({
    sentence: z.string().refine(
      (val) => {
        if (countFull1half05(val) > 20) {
          return false;
        } else {
          return true;
        }
      },
      (val) => {
        if (countFull1half05(val) > 20) {
          return { message: "文字数オーバー" };
        } else {
          return { message: "入力して下さい" };
        }
      }
    ),
  });

  const validation = () => {
    try {
      RequestSchema.parse(request);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        // console.log(err.flatten().fieldErrors);
        setErrors(err.flatten().fieldErrors as any);
      }
    }
  };

  //入力がある度にチェック
  useEffect(() => {
    validation();
  }, [request]);

  const handleEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedParam = { ...request, [name]: value };
    setRequest(updatedParam);
  };

  const [isVaridateError, setIsVaridateError] = useState(false);
  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setIsVaridateError(true);
    } else {
      setIsVaridateError(false);
    }
  }, [errors]);

  return {
    request,
    setRequest,
    handleEdit,
    errors,
    setErrors,
    isVaridateError,
  };
}
