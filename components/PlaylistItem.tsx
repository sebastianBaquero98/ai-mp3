import React from "react";
import Image from "next/image";
import Link from "next/link";

interface props {
  name: string;
  numSongs: number;
  duration: number;
  playlistCover: string;
  id: string;
  playlistDescription: string;
}
const PlaylistItem = ({
  name,
  numSongs,
  duration,
  playlistCover,
  id,
  playlistDescription,
}: props) => {
  const cleanPlaylistDescription = playlistDescription.includes("&quot;")
    ? playlistDescription.replace("&quot;", "")
    : playlistDescription;
  // const replaceSong = (id: string) => {};
  return (
    <Link
      href={`playlist/${id}?name=${name}&numbersongs=${numSongs}&playlistcover=${playlistCover}&playlistdescription=${cleanPlaylistDescription}`}
      className="relative  w-full text-white"
    >
      {/* Main Content Container */}
      <div className="relative z-10 flex h-[55px] w-full items-center ps-[28px]">
        <Image
          src={playlistCover}
          height={47}
          width={47}
          alt="album_cover.svg"
          className="rounded-lg border-2 border-black"
        />
        <div className="ms-[23px] flex w-3/5 flex-col">
          <h1
            className={`font-bungee ${
              name.replace(/\s*\(.*?\)/, "").split(" ").length >= 4
                ? "text-[10px]"
                : "text-[15px]"
            }`}
          >
            {name.includes("-")
              ? name.split("-")[0].replace(/\s*\(.*?\)/, "")
              : name.replace(/\s*\(.*?\)/, "")}
          </h1>
          <p className="mt-[-2px] font-sans text-[10px] font-extralight">
            {numSongs} Songs | {duration}H
          </p>
        </div>
      </div>

      {/* Graffiti Strip Image Positioned Below */}
      <div className="absolute inset-x-0 -bottom-0 left-[55px] z-0">
        <Image
          src="/images/grafiti_strip.png"
          height={16}
          width={297}
          alt="grafiti_strip"
        />
      </div>
    </Link>
  );
};

export default PlaylistItem;
