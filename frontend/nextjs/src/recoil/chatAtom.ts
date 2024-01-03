import { atom } from "recoil";

const init = {
  isUser: true,
  message: "",
};
export const chatState = atom({
  key: "chatState",
  default: [init],
});

const initRequest = {
  name: "",
  answer: "",
  sentence: "",
};

export const requestState = atom({
  key: "requestState",
  default: initRequest,
});
