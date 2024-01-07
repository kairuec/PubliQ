import { useState } from 'react';
import { z } from 'zod';

//画像アップロード
export const useImage = () => {
  const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg'];
  // const IMAGE_TYPES = ['image/svg'];

  // zodバリデーション
  const RequestSchema = z.object({
    name: z.string().min(1, 'ファイル名は1文字以上で入力してください'),
    size: z.number().max(500000, '1ファイルの最大サイズは5メガバイトです。'),
    type: z.string().refine((fileType) => IMAGE_TYPES.includes(fileType), {
      message: 'アップロードできないデータです。（対応データ: jpg/png/webp/gif/svg）',
    }),
  });

  //validationの戻り値
  const result: {
    success: successInfoImage[];
    successFiles: File[];
    error: errorInfoImage[];
    quantityError: string;
  } = {
    success: [],
    successFiles: [],
    error: [],
    quantityError: '',
  };

  const validation = (fileList: File[]) => {
    for (const file of fileList) {
      let fileObject = file;

      try {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
        };
        RequestSchema.parse(fileData);

        //成功した処理を戻り値のsuccessに格納
        result.success.push({
          fileName: file.name,
          url: window.URL.createObjectURL(fileObject),
        });
        //アップロードするためにfileも格納
        result.successFiles.push(file);
      } catch (err) {
        if (err instanceof z.ZodError) {
          //失敗した処理を戻り値のerrorに格納
          result.error.push({
            fileName: file.name,
            url: window.URL.createObjectURL(fileObject),
            errors: err.flatten().fieldErrors,
          });
        }
      }
    }

    if (fileList.length > 50) {
      result.quantityError = '１度登録できるファイルは最大50件です。 アップロード件数：' + fileList.length + '件';
    }

    return result;
  };

  return { validation };
};
