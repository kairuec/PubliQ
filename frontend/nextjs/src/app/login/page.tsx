"use client";

import * as z from "zod";
import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import axios, { csrf } from "@/lib/axios";
import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLoginForm } from "@/validation/loginForm";
import { Loading } from "@/components/Loading";
import { useRecapcha } from "@/hooks/Recapcha";
import { useRecoilState } from "recoil";
import { loginErrorState } from "@/recoil/userAtoms";
import { isLoadingState } from "@/recoil/isLoadingAtom";

export default function Login() {
  const title: string = "ログイン画面";

  //バリデーション関連
  const { formVal, formSchema } = useLoginForm();

  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/admin",
  });

  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const { isRecapchaCheck, handleRecapcha } = useRecapcha();
  const [loginError, setLoginError] = useRecoilState(loginErrorState);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    //リキャプチャのチェックを通過していたらそのままpost まだの場合はリキャプチャのチェック後にpost
    if (isRecapchaCheck || (await handleRecapcha())) {
      login(values);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="bg-gray-100">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="mb-8 mr-4">
            <Logo />
          </div>
          <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0">
            <Form {...formVal}>
              <form
                onSubmit={formVal.handleSubmit(handleSubmit)}
                className="space-y-8 my-10 mx-6"
              >
                <FormField
                  control={formVal.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>ユーザー名</FormLabel>
                      </div>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      {loginError != "" && (
                        <p className="text-sm text-red-500">{loginError}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formVal.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>パスワード</FormLabel>
                      </div>
                      <FormControl>
                        <Input type="password" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" space-y-4">
                  <FormField
                    control={formVal.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-4 space-y-0 py-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>ログイン状態を保持する</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Link href="" className="text-sm block hover:underline">
                    パスワードを忘れた方
                  </Link>
                </div>

                <div className="flex justify-center">
                  {isLoading && <Loading />}
                  {!isLoading && (
                    <button className="p-4 rounded-md bg-gray-900 text-white hover:text-amber-500 duration-150">
                      ログイン
                    </button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
