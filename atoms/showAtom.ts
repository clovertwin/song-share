import { atom } from "recoil";

export const showComponentOpenState = atom({
  key: "showComponentOpenState",
  default: false,
});

export const selectedShowId = atom({
  key: "selectedShowIdState",
  default: "",
});
