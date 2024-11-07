import PlaylistItem from "@/components/PlaylistItem";
import { getUsersPlaylist } from "@/lib/spotify";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Image from "next/image";

export default async function UserProfile() {
  const playlists = await getUsersPlaylist();
  // console.log(playlists);
  return (
    <div className="flex flex-col items-center px-5">
      <Image
        src="/images/profile_imagev2.png"
        width={355}
        height={355}
        alt=""
        className="mt-5 rounded-[20px]"
      />
      <div className="mt-[-50px] flex h-[95px] w-[95%] items-center justify-around rounded-[10px] bg-electric-green">
        <div className="flex flex-col items-center">
          <h1 className="font-bungee text-[30px]">50</h1>
          <p className="mt-[-5px] text-[12px]">Playlist</p>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-bungee text-[30px]">150.4</h1>
          <p className="mt-[-5px] text-[12px]">Horas</p>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-bungee text-[30px]">300</h1>
          <p className="mt-[-5px] text-[12px]">Follows</p>
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-1">
        <ScrollArea className="flex h-[550px] w-full flex-col ">
          {playlists.map((e: any) => (
            <PlaylistItem
              key={e}
              id={e.id}
              name={e.name}
              numSongs={e.tracks.total}
              duration={13.7}
              playlistCover={e.images[0].url}
              playlistDescription={e.description}
            />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
