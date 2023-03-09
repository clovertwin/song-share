import { atom } from "recoil";

export const libraryComponentOpenState = atom({
  key: "libraryComponentOpenState",
  default: false,
});

export const likedSongsOpenState = atom({
  key: "likedSongsOpenState",
  default: false,
});

export const playlistOpenState = atom({
  key: "playlistOpenState",
  default: true,
});
