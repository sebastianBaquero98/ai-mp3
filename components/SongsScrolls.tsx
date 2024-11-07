"use client";
import { SpotifyTrack } from "@/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import React, { useEffect, useRef, useState } from "react";
import SongItem from "./SongItem";

const SongsScrolls = ({ tracks }: any) => {
  const [isEdit, setIsEdit] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlay = (id: any) => {
    setCurrentlyPlayingId((prevId) => (prevId === id ? null : id));
  };

  const handleEnded = (id: any) => {
    if (currentlyPlayingId === id) {
      setCurrentlyPlayingId(null);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <div className="mt-2 flex w-full flex-col items-center gap-1">
      <ScrollArea className="flex h-[550px] w-full flex-col">
        {tracks.map((track: SpotifyTrack, index: number) => (
          <SongItem
            key={index}
            name={track.trackName}
            id={track.trackId}
            playlistCover={track.playlistCover}
            previewUrl={track.previewUrl}
            artists={track.artists}
            isEdit={isEdit}
            index={index}
            isPlaying={track.trackId === currentlyPlayingId}
            onPlay={handlePlay}
            onEnded={handleEnded}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

export default SongsScrolls;
