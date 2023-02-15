import { atom } from "recoil";

export const searchSelectedShowState = atom({
  key: "searchSelectedShowState",
  default: {} as SpotifyApi.SingleShowResponse,
});

export const showSearchOpenState = atom({
  key: "showSearchOpenState",
  default: false,
});
