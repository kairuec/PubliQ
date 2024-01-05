import { atom } from "recoil";

const init = {
  id: 0,
  genre: "",
  answer: "",
  hint: "",
  failWord1: "",
  failWord2: "",
  failWord3: "",
  good: 0,
  bad: 0,
};

export const questionState = atom({
  key: "questionState",
  default: init,
});

export const createUrlState = atom({
  key: "createUrlState",
  default: "",
});

export const isFailState = atom({
  key: "isFailState",
  default: false,
});

export const tryChanceStateCount = atom({
  key: "tryChanceStateCount",
  default: 3,
});
