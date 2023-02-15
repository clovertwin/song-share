import { atom } from "recoil";

export const albumComponentOpenState = atom({
  key: "albumComponentOpenState",
  default: false,
});

export const selectedAlbumIdState = atom({
  key: "selectedAlbumIdState",
  default: "",
});
