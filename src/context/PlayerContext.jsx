import { createContext, useContext } from "react";

export const PlayerContext = createContext(null);

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("react-modern-video-player: components must be used inside <VideoPlayer>.");
  }

  return context;
}
