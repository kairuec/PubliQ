import { useState } from 'react';
import axios, { csrf } from '@/lib/axios';
import * as z from 'zod';
import { Loading } from '@/components/Loading';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FacebookShareButton, LineShareButton, TwitterShareButton } from 'react-share';

import { FacebookIcon, LineIcon, XIcon } from 'react-share';
import Link from 'next/link';
import { useQuestion } from '@/hooks/Question';
import { useCreateQuestionForm } from '@/validation/createQuestionForm';
import { useRecoilState } from 'recoil';
import { createUrlState } from '@/recoil/questionAtom';
import { useRecapcha } from '@/hooks/Recapcha';
import { configAtoms } from '@/recoil/configAtoms';

export const CreateForm = () => {
  const [createUrl, setCreateUrl] = useRecoilState(createUrlState);

  return (
    <Dialog>
      <DialogTrigger>
        <div className="px-4 py-2 rounded-md  bg-gray-900 text-white hover:text-amber-500 duration-150">問題を作る</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{createUrl == '' ? '問題を作る' : '問題を作成しました'}</DialogTitle>
          <DialogDescription>{createUrl == '' ? <Create /> : <Result />}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

//入力ここから
export function Create() {
  const { formVal, formSchema, countFull1half05 } = useCreateQuestionForm();
  const [isLoading, setIsLoading] = useState(false);
  const [createUrl, setCreateUrl] = useRecoilState(createUrlState);
  const [config] = useRecoilState(configAtoms);
  const { isRecapchaCheck, handleRecapcha } = useRecapcha();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const post = async () => {
      await csrf();
      axios
        .post(`/api/question/createQuestion`, { values })
        .then((res) => {
          // console.log(res.data);
          setCreateUrl(`${config.originalUrl}?id=${res.data.id}`);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response.status !== 422) throw error;
        });
    };

    //リキャプチャのチェックを通過していたらそのままpost まだの場合はリキャプチャのチェック後にpost
    if (isRecapchaCheck || (await handleRecapcha())) {
      await post();
    }
  };

  return (
    <Form {...formVal}>
      <form onSubmit={formVal.handleSubmit(handleSubmit)} className="space-y-8 mt-10 mx-6">
        <FormField
          control={formVal.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>お題</FormLabel>
                <p className="text-sm">{countFull1half05(formVal.watch('genre'))} / 20</p>
              </div>
              <FormControl>
                <Input placeholder="麺類　できるだけ具体的に" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formVal.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>正解</FormLabel>
                <p className="text-sm">{countFull1half05(formVal.watch('answer'))} / 20</p>
              </div>
              <FormControl>
                <Input placeholder="そば" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formVal.control}
          name="hint"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                ヒント
                <span className="text-[10px] mx-2 p-1 mt-0.5 bg-gray-200 rounded-md">任意</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="和食" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formVal.control}
          name="failWord1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                地雷ワード1
                <span className="text-[10px] mx-2 p-1 mt-0.5 bg-gray-200 rounded-md">任意</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="うどん" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formVal.control}
          name="failWord2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                地雷ワード2
                <span className="text-[10px] mx-2 p-1 mt-0.5 bg-gray-200 rounded-md">任意</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="ラーメン" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formVal.control}
          name="failWord3"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                地雷ワード3
                <span className="text-[10px] mx-2 p-1 mt-0.5 bg-gray-200 rounded-md">任意</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="パスタ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          {isLoading && <Loading />}
          {!isLoading && <button className="p-4 rounded-md bg-gray-900 text-white hover:text-amber-500 duration-150">出題する</button>}
        </div>
      </form>
    </Form>
  );
}

export function Result() {
  const [createUrl, setCreateUrl] = useRecoilState(createUrlState);
  const { question } = useQuestion();
  const QUOTE = `【PubliQ】AIにチャットして名前当てクイズ\n\nお題：${question.genre}\n`;

  return (
    <section className="space-y-8 px-4">
      <div className="mt-10 space-y-2">
        <p>作成した問題のURL</p>
        <Link href={createUrl} className="p-4 rounded-md bg-neutral-200 hover:text-amber-500 duration-150 block">
          {createUrl}
        </Link>
      </div>
      <div className="space-y-4 pb-6">
        <p className="mt-10">作った問題をSNSでシェア</p>
        <div className="flex items-center justify-center gap-6">
          <TwitterShareButton url={createUrl} title={QUOTE}>
            <XIcon className="w-12 h-12" />
          </TwitterShareButton>
          <LineShareButton url={createUrl} title={QUOTE}>
            <LineIcon className="w-12 h-12" />
          </LineShareButton>
          <FacebookShareButton url={createUrl} title={QUOTE}>
            <FacebookIcon className="w-12 h-12" />
          </FacebookShareButton>
        </div>
      </div>
      <section className="flex justify-center">
        <button onClick={() => setCreateUrl('')} className="p-4 rounded-md bg-gray-900 text-white hover:text-amber-500 duration-150">
          別の問題を作る
        </button>
      </section>
    </section>
  );
}
