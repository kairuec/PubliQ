import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

export function useLoginForm() {
  const formSchema = z.object({
    name: z.string().nonempty("名前は必須です"),
    password: z
      .string()
      .nonempty("必須項目です")
      .min(8, "パスワードは8文字以上で入力してください")
      .refine(
        (val) => {
          return /^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/.test(val);
        },
        { message: "入力できるのは英数字記号です" }
      ),
    remember: z.boolean(),
  });

  const formVal = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      remember: false,
    },
  });

  return { formVal, formSchema };
}
