import Image from "next/image";
import React from "react";
import Link from "next/link";

const PlaylistItem = () => {
  return (
    <Link href="/playlist/1">
      <div className="flex h-[51px] w-full  items-center justify-between border-y-2 border-y-black bg-light-yellow px-[28px]">
        <div className="flex">
          <Image
            src="/images/album_cover.svg"
            width={40}
            height={40}
            alt="album_image"
          />
          {/* Titulo y info */}
          <div className="ms-[18px] flex flex-col">
            <h1 className="font-bungee text-[16px]">Golden Hour</h1>
            <div className="flex items-center justify-center gap-2">
              <p className="font-sans text-[8px] font-thin">
                Duración <span className="font-bungee">1H 3MIN</span>
              </p>
              <p className="font-sans text-[8px] font-thin">
                Creado por <span className="font-bungee">KOGNITO</span>
              </p>
            </div>
          </div>
        </div>
        {/* Likes */}
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/images/like_icon.svg"
            height={28}
            width={27}
            alt="like_btn"
            className="mt-3"
          />
          <p className="mt-1 font-bungee text-[11px]">5000</p>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistItem;
