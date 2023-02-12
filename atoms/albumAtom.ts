import { atom } from "recoil";

export const albumComponentOpenState = atom({
  key: "albumComponentOpenState",
  default: false,
});

export const selectedAlbumId = atom({
  key: "selectedAlbumIdState",
  default: "",
});
