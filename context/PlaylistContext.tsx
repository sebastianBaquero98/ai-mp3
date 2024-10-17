import { SpotifyTrack } from "@/types";
import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context
interface PlaylistContextType {
  playlist: SpotifyTrack[];
  setPlaylist: React.Dispatch<React.SetStateAction<SpotifyTrack[]>>;
  removeTrack: (index: number) => void;
}

// Create the context with undefined as the default value
const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

// Create a provider component
export const PlaylistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playlist, setPlaylist] = useState<SpotifyTrack[]>([]);

  const removeTrack = (index: number) => {
    setPlaylist((prevPlaylist) => prevPlaylist.filter((_, i) => i !== index));
  };

  return (
    <PlaylistContext.Provider value={{ playlist, setPlaylist, removeTrack }}>
      {children}
    </PlaylistContext.Provider>
  );
};

// Custom hook to use the PlaylistContext
export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};
