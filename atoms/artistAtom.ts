import { atom } from "recoil";

export const artistComponentOpenState = atom({
  key: "artistComponentOpenState",
  default: false,
});

export const selectedArtistId = atom({
  key: "selectedArtistIdState",
  default: "",
});
