import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  default: "",
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});

export const currentPlayingTypeState = atom({
  key: "currentPlayingTypeState",
  default: "track" as "track" | "episode",
});
