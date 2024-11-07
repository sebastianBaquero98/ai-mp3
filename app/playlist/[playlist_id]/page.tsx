import { getTracksByPlaylistId } from "@/lib/spotify";
import Image from "next/image";
import SongsScrolls from "@/components/SongsScrolls";

interface props {
  params: {
    playlist_id: string;
  };
  searchParams: {
    [key: string]: string | undefined;
  };
}
export default async function Playlist({ params, searchParams }: props) {
  const tracks = await getTracksByPlaylistId(params.playlist_id);
  // console.log(tracks);
  const name = searchParams.name;
  const numbersongs = searchParams.numbersongs;
  const playlistcover = searchParams.playlistcover;
  const playlistDescription = searchParams.playlistdescription;
  // console.log(playlistDescription);

  // console.log(tracks);
  return (
    <div className="mt-4 flex flex-col items-center px-4">
      <div className="flex gap-2">
        <Image
          src={playlistcover}
          height={255}
          width={255}
          alt="cover_playlist"
          className="rounded-[20px]"
        />
        <div className="flex h-[251px] w-[88px] flex-col items-center justify-around rounded-[10px] bg-electric-green">
          <div className="flex flex-col items-center">
            <h3 className="font-bungee text-[36px]">{numbersongs}</h3>
            <p className="mt-[-10px] text-[12px]">Canciones</p>
          </div>
          {/* <div className="flex flex-col items-center">
            <h3 className="font-bungee text-[36px]">13.7</h3>
            <p className="mt-[-10px] text-[12px]">Horas</p>
          </div> */}
          {/* <div className="flex flex-col items-center">
            <h3 className="font-bungee text-[36px]">300</h3>
            <p className="mt-[-10px] text-[12px]">Follows</p>
          </div> */}
        </div>
      </div>
      <h1 className="primary-text-gradient mt-2 text-center font-bungee text-[25px]">
        {name}
      </h1>
      <p className="px-8 text-center text-[12px] text-white opacity-80">
        {playlistDescription}
      </p>
      <SongsScrolls tracks={tracks} />
      {/* <div className="mt-2 flex w-full flex-col items-center gap-1">
        <ScrollArea className="flex h-[550px] w-full ">
          {tracks.map((track: SpotifyTrack, index: number) => (
            <SongItem
              key={index}
              name={track.trackName}
              id={track.trackId}
              playlistCover={track.playlistCover}
              previewUrl={track.previewUrl}
              artists={track.artists}
              // isEdit={isEdit}
              // index={index}
              // isPlaying={track.trackId === currentlyPlayingId}
              // onPlay={handlePlay}
              // onEnded={handleEnded}
            />
          ))}
        </ScrollArea>
      </div> */}
    </div>
  );
}
