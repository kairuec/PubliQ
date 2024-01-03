import { useState, useCallback, useEffect } from 'react';

//文字数カウント
export const useCountText = () => {
  //全角2半角1カウント
  const countFull2half1 = (str: string) => {
    if (str) {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        str[i].match(/[ -~]/) ? (len += 1) : (len += 2);
      }
      return len;
    } else {
      return 0;
    }
  };
  //全角1半角0.5カウント
  const countFull1half05 = (str: string) => {
    if (str) {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        str[i].match(/[ -~]/) ? (len += 0.5) : (len += 1);
      }
      return len;
    } else {
      return 0;
    }
  };

  return { countFull2half1, countFull1half05 };
};
