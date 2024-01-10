import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCountText } from '@/hooks/CounstText';
import { useEffect, useState } from 'react';
import axios, { csrf } from '@/lib/axios';

export function useCreateQuestionForm() {
  const { countFull1half05 } = useCountText();
  const lengthValidation = () =>
    z
      .string()
      .refine(
        (val) => countFull1half05(val) <= 20,
        (val) => ({
          message: countFull1half05(val) > 20 ? '文字数オーバー' : '',
        })
      )
      .refine((val) => val.length >= 1, {
        message: '必須項目です。',
      });

  const failWordValidation = () =>
    z.string().refine(
      (val) => !val.includes(answer),
      (val) => ({
        message: !val.includes(answer) ? '' : '正解のワードは含めることができません。',
      })
    );

  const formSchema = z.object({
    genre: lengthValidation(),
    answer: lengthValidation(),
    hint: failWordValidation(),
    failWord1: failWordValidation(),
    failWord2: failWordValidation(),
    failWord3: failWordValidation(),
    isPublic: z.string(),
  });

  const formVal = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genre: '',
      answer: '',
      hint: '',
      failWord1: '',
      failWord2: '',
      failWord3: '',
      isPublic: 'true',
    },
  });

  //地雷ワードに正解が含まれているか判別するため定義
  const [answer, setAnswer] = useState('');
  const watchAnswer = formVal.watch('answer');

  useEffect(() => {
    setAnswer(watchAnswer);
  }, [watchAnswer]);

  return { formVal, formSchema, countFull1half05 };
}
