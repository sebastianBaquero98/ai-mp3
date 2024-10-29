"use client";
import SongItem from "@/components/SongItem";
import { SpotifyTrack } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { addSongsToPlaylist, createPlaylist, getProfile } from "@/lib/spotify";
import { usePlaylist } from "@/context/PlaylistContext";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function Result() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [isEdit, setIsEdit] = useState(false);
  const { playlist } = usePlaylist();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [playlistName, setPlaylistName] = useState(searchParams.get("title"));
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

  const addPlaylist = async () => {
    startTransition(async () => {
      const profile = await getProfile();
      const userId = profile.id;

      if (!userId) {
        console.error("User ID is undefined");
        return;
      }
      // console.log("userId", userId);
      try {
        const playlistId = await createPlaylist(
          userId,
          playlistName || "Test Title",
          prompt || "AI.MP3"
        );
        // console.log("playlistId", playlistId);
        await addSongsToPlaylist(playlistId, playlist);
      } catch (error) {
        console.error("Error creating playlist:", error);
      }
      router.push("/confirmation");
    });
    // console.log("playlistId", playlistId);
  };

  // Get the 'items' parameter from the URL
  // const itemsParam = searchParams.get("items");
  const prompt = searchParams.get("prompt");
  // const title = searchParams.get("title");
  const duration = parseFloat(searchParams.get("duration") || "0");

  return (
    <div className="flex w-full flex-col items-center justify-center px-3">
      <Image
        src="/images/formato2.jpg"
        height={200}
        width={200}
        alt="play_btn.svg"
        className="mt-10 border-2 border-white"
      />
      {/* <div className="mt-10 w-full rounded-xl bg-electric-green p-3">
        <p className="text-center">{prompt}</p>
      </div> */}
      <p className="mt-4 font-bungee text-[16px] text-white opacity-90">
        {duration.toFixed(1)}
        {"H"}
        {/* {parseFloat(duration.toFixed(1)) === 1 ? "hora" : "horas"} */}
      </p>
      <h3 className="primary-text-gradient w-full text-center font-bungee text-[25px] text-white ">
        <input
          // ref={inputRef}
          className="primary-text-gradient w-full border-none bg-background p-0  text-center text-white outline-none"
          value={playlistName || ""}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
      </h3>

      <p className="px-10 text-center text-[12px] text-white opacity-80">
        {`"${prompt}" - AI.MP3`}
      </p>
      <div className="mt-2 flex w-full flex-col items-center gap-1">
        <ScrollArea className="flex h-[550px] w-full ">
          {playlist.map((track: SpotifyTrack, index: number) => (
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
        {/* {Object.keys(recommendedTracks).map(
          (track: SpotifyTrack, index: number) => (
            <SongItem key={index} name={track.trackName} />
          )
        )} */}
      </div>
      <div className=" mt-[15px] flex gap-4">
        {!isPending && (
          <>
            <Button
              className="h-[30px] bg-electric-green px-5 text-background"
              onClick={() => setIsEdit(!isEdit)}
            >
              Editar
            </Button>
            <Button
              className="mb-3 h-[30px] bg-electric-green px-5 py-0 text-background"
              onClick={addPlaylist}
            >
              Agregar
            </Button>
            {/* <Image
              src="/images/agregar_btn.svg"
              height={35}
              width={122}
              alt="agregar_btn"
              onClick={addPlaylist}
            /> */}
          </>
        )}
      </div>
    </div>
    // <div className="flex w-full flex-col items-center">
    //   <div className="mb-[26px] mt-[50px] flex h-[52px] w-full items-center justify-center border-y-2 border-y-black bg-sky-blue">
    //     <Link href="/create">
    //       <Image
    //         src="/images/ai_mp3.svg"
    //         width={131}
    //         height={32}
    //         alt="comunidad"
    //         className="drop-shadow-lg"
    //       />
    //     </Link>
    //   </div>
    //   <div className="hide-scrollbar mb-[11px] flex w-full max-w-4xl items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
    //     <span className="font-bungee text-[12px] opacity-15">
    //       PROMPT{"  "}PROMPT PROMPT
    //     </span>

    //     <h1 className="font-bungee text-[20px]">PROMPT</h1>
    //     <span className="font-bungee text-[12px] opacity-15">
    //       PROMPT{"  "}PROMPT PROMPT
    //     </span>
    //   </div>
    //   <div className="mb-[20px] w-[322px] border-2 border-black bg-light-pink p-3  font-sans text-[14px] focus:outline-none">
    //     <p>{prompt}</p>
    //   </div>
    //   <div className="mb-[10px] flex w-full items-center justify-between px-[30px]">
    // <h3 className=" font-bungee text-[16px] opacity-80">
    //   <input
    //     ref={inputRef}
    //     className=" m-0 w-auto min-w-[1em] border-none bg-background p-0 outline-none"
    //     value={playlistName || ""}
    //     onChange={(e) => setPlaylistName(e.target.value)}
    //   />
    // </h3>
    // <p className="ms-[30px] font-bungee text-[14px] opacity-80">
    //   {duration.toFixed(1)}
    //   {"H"}
    //   {/* {parseFloat(duration.toFixed(1)) === 1 ? "hora" : "horas"} */}
    // </p>
    //     {/* <p className="ms-[30px] font-bungee text-[12px] opacity-80">
    //       {Math.round(duration)} {Math.round(duration) === 1 ? "hora" : "horas"}
    //     </p> */}
    //   </div>
    // <div className="flex w-full flex-col items-center gap-1">
    //   <ScrollArea className="flex h-[480px] w-full">
    //     {playlist.map((track: SpotifyTrack, index: number) => (
    //       <SongItem
    //         key={index}
    //         name={track.trackName}
    //         id={track.trackId}
    //         playlistCover={track.playlistCover}
    //         previewUrl={track.previewUrl}
    //         artists={track.artists}
    //         isEdit={isEdit}
    //         index={index}
    //         isPlaying={track.trackId === currentlyPlayingId}
    //         onPlay={handlePlay}
    //         onEnded={handleEnded}
    //       />
    //     ))}
    //   </ScrollArea>
    //   {/* {Object.keys(recommendedTracks).map(
    //     (track: SpotifyTrack, index: number) => (
    //       <SongItem key={index} name={track.trackName} />
    //     )
    //   )} */}
    // </div>
    // <div className="mt-[21px] flex gap-4">
    //   {!isPending && (
    //     <>
    //       <Image
    //         src="/images/editar_btn.svg"
    //         height={35}
    //         width={113}
    //         alt="editar_btn"
    //         onClick={() => setIsEdit(!isEdit)}
    //       />
    //       <Image
    //         src="/images/agregar_btn.svg"
    //         height={35}
    //         width={122}
    //         alt="agregar_btn"
    //         onClick={addPlaylist}
    //       />
    //     </>
    //   )}
    // </div>
    // </div>
  );
}
