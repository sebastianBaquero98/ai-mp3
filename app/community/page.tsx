"use client";
import Filter from "@/components/Filter";
import PlaylistItem from "@/components/PlaylistItem";
import { lowerFilters, topFilters } from "@/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Community() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center">
      <div className="mt-[50px] flex h-[52px] w-full items-center justify-center border-y-2 border-y-black bg-sky-blue">
        <Image
          src="/images/comunidad.svg"
          width={219}
          height={32}
          alt="comunidad"
          className="drop-shadow-lg"
          onClick={() => router.push("/create")}
        />
      </div>
      <div className="mx-auto w-full max-w-4xl p-4">
        <div className="my-3 flex gap-2">
          {topFilters.map((filter, index) => (
            <Filter key={index} isActive={index === 0} name={filter} />
          ))}
        </div>
        <div className="hide-scrollbar -mx-4 overflow-x-auto whitespace-nowrap px-4">
          <div className="inline-flex space-x-4">
            {lowerFilters.map((filter, index) => (
              <Filter key={index} isActive={false} name={filter} />
            ))}
          </div>
        </div>
      </div>
      <div className="hide-scrollbar mb-[11px] flex w-full max-w-4xl items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="font-bungee text-[12px] opacity-15">
          TRENDING PLAYLISTS{"  "}
        </span>

        <h1 className="font-bungee text-[16px]">TRENDING PLAYLIST</h1>
        <span className="font-bungee text-[12px] opacity-15">
          TRENDING PLAYLISTS{"  "}
        </span>
      </div>
      <div className="flex w-full flex-col gap-1">
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
      </div>
    </div>
  );
}
