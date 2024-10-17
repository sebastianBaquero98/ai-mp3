import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { usePlaylist } from "@/context/PlaylistContext";

interface props {
  name: string;
  id: string;
  artists: string;
  playlistCover: string;
  previewUrl: string;
  isEdit: boolean;
  index: number;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  onEnded: (id: string) => void;
}
const SongItem = ({
  name,
  id,
  artists,
  playlistCover,
  previewUrl,
  isEdit,
  index,
  isPlaying,
  onPlay,
  onEnded,
}: props) => {
  const { removeTrack } = usePlaylist();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => onEnded(id);
      audio.addEventListener("ended", handleEnded);
      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [id, onEnded]);

  const togglePlay = () => {
    onPlay(id);
  };

  const removeSong = () => {
    removeTrack(index);
  };

  // const replaceSong = (id: string) => {};
  return (
    <div className="mb-1 flex h-[40px] w-full items-center border-y-2 border-y-black bg-light-yellow ps-[28px]">
      <Image
        src={playlistCover}
        height={30}
        width={30}
        alt="album_cover.svg"
        className="rounded-lg border-2 border-black"
      />
      <div className="ms-[23px] flex w-3/5 flex-col">
        <h1
          className={`font-bungee ${name.replace(/\s*\(.*?\)/, "").split(" ").length >= 4 ? "text-[10px]" : "text-[15px]"} `}
        >
          {name.includes("-")
            ? name.split("-")[0].replace(/\s*\(.*?\)/, "")
            : name.replace(/\s*\(.*?\)/, "")}
        </h1>
        {artists.split(",").length > 4 ? (
          <p className="mt-[-5px] font-sans text-[10px]">
            {artists.split(",").slice(0, 4).join(", ") + ", ..."}
          </p>
        ) : (
          <p className="mt-[-5px] font-sans text-[10px]">{artists}</p>
        )}
      </div>
      {!isEdit ? (
        previewUrl ? (
          <div>
            <audio ref={audioRef} src={previewUrl} />
            {isPlaying ? (
              <Image
                src="/images/stop_btn.svg"
                height={15}
                width={55}
                alt="stop_btn.svg"
                onClick={togglePlay}
              />
            ) : (
              <Image
                src="/images/play_btn.svg"
                height={15}
                width={55}
                alt="play_btn.svg"
                onClick={togglePlay}
              />
            )}
          </div>
        ) : (
          <p></p>
        )
      ) : (
        <div className=" flex gap-1">
          <Image
            src="/images/remove.svg"
            height={15}
            width={53}
            alt="remove.svg"
            onClick={removeSong}
          />
          {/* <Image
            src="/images/replace.svg"
            height={15}
            width={53}
            alt="replace.svg"
            onClick={togglePlay}
          /> */}
        </div>
        // <p>Preview not available</p>
      )}
      {/* */}
    </div>
  );
};

export default SongItem;
