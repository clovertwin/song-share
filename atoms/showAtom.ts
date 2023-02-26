import { atom } from "recoil";

export const showComponentOpenState = atom({
  key: "showComponentOpenState",
  default: false,
});

export const selectedShowIdState = atom({
  key: "selectedShowIdState",
  default: "",
});
