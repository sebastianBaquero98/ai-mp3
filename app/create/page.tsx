"use client";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import { createTitle, getExtractedAttributes } from "@/lib/actions/ai.actions";
import { usePlaylist } from "@/context/PlaylistContext";
import {
  getAudioFeatures,
  getTopArtistsInfo,
  getUserTopTrackNames,
} from "@/lib/actions/user_profile.actions";
import { getAvailableGenreSeeds, makeRecomendation } from "@/lib/spotify";
import { useRouter } from "next/navigation";
import { msToHours } from "@/lib/utils";
// import { placeholderPrompts } from "@/constants";
// import { Button } from "@/components/ui/button";

export default function Create() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isPending, startTransition] = useTransition();
  const { setPlaylist } = usePlaylist();
  // const [placeholder, setPlaceholder] = useState("");

  // useEffect(() => {
  //   const randomIndex = Math.floor(Math.random() * placeholderPrompts.length);
  //   setPlaceholder(placeholderPrompts[randomIndex]);
  // }, []);

  const handleClick = async () => {
    startTransition(async () => {
      const { favoriteArtists, favoriteGenres } = await getTopArtistsInfo();

      // console.log(favoriteArtists);
      // console.log(favoriteGenres);
      const topTracks = await getUserTopTrackNames();
      // console.log(topTracks);
      const audioFeatures = await getAudioFeatures();
      const spotifyGenres = await getAvailableGenreSeeds();
      const nameString = spotifyGenres.join(", ");
      const extractedAttributes = await getExtractedAttributes(
        favoriteArtists,
        favoriteGenres,
        topTracks,
        audioFeatures,
        prompt,
        nameString
      );
      console.log(extractedAttributes);

      try {
        // extractedAttributes = extractedAttributes.replace("json", "");
        // extractedAttributes = extractedAttributes.replace("`", "");
        // extractedAttributes = extractedAttributes.replace("`", "");
        // extractedAttributes = extractedAttributes.replace("`", "");
        // extractedAttributes = extractedAttributes.replace("`", "");
        // extractedAttributes = extractedAttributes.replace("`", "");
        // extractedAttributes = extractedAttributes.replace("`", "");
        const attributes = JSON.parse(extractedAttributes);
        const { filteredTracks, playlistDuracion } =
          await makeRecomendation(attributes);
        const title = await createTitle(filteredTracks, prompt);
        setPlaylist(filteredTracks);
        const durationInMinutes = msToHours(playlistDuracion);
        router.push(
          `/create/result?prompt=${prompt}&title=${title}&duration=${durationInMinutes}`
        );
      } catch (error) {
        console.log(error);
        router.push(
          `/create/result?prompt=${prompt}&title=No PLaylist}&duration=0`
        );
      }
    });
  };
  return (
    <div
      className={`flex h-screen flex-col items-center  ${isPending ? "justify-center" : ""} px-4`}
    >
      <div
        className={`flex items-center justify-center ${isPending ? "mb-8" : "h-screen"}`}
      >
        <h1 className="primary-text-gradient text-center font-sans text-4xl text-white">
          ¿Qué quieres escuchar hoy?
        </h1>
      </div>
      {!isPending ? (
        <div className="mb-8 flex  h-[100px] w-full  rounded-2xl bg-electric-green">
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Escribe lo que quieras escuchar"
            className="size-full resize-none overflow-hidden rounded-2xl bg-electric-green p-2 text-base opacity-90 placeholder:text-black focus:outline-none"
          />
          {prompt.length > 0 ? (
            <Image
              src="/images/send_icon.svg"
              height={26}
              width={26}
              alt=""
              className="me-2"
              onClick={handleClick}
            />
          ) : (
            <Image
              src="/images/mic_icon.svg"
              height={26}
              width={26}
              alt=""
              className="me-2"
            />
          )}
        </div>
      ) : (
        <div className="spinner">
          <div className="spinner1"></div>
        </div>
      )}
    </div>
    // <div className="flex h-screen flex-col items-center justify-center">
    //   <h1 className=" text-center font-sans text-[36px] text-white">
    //     ¿Qué quieres escuchar hoy?
    //   </h1>
    //   <div className="relative w-full max-w-md">
    //     <Image
    //       src="/images/blur_prompt.png"
    //       height={118}
    //       width={439}
    //       alt=""
    //       className="absolute inset-0 object-cover"
    //     />
    //     <div className="relative z-10 mt-[20px] px-5">
    //       <textarea
    //         onChange={(e) => setPrompt(e.target.value)}
    //         value={prompt}
    //         placeholder={placeholder}
    //         className="h-[130px] w-full  bg-transparent  p-3 text-[16px] opacity-80 focus:outline-none"
    //       />
    //     </div>
    //   </div>

    // </div>
    // <div className="flex flex-col items-center">
    //   <div className="mb-[26px] mt-[40px] flex h-[52px] w-full items-center justify-center border-y-2 border-y-black bg-sky-blue">
    //     <Image
    //       src="/images/ai_mp3.svg"
    //       width={131}
    //       height={32}
    //       alt="comunidad"
    //       className="drop-shadow-lg"
    //       onClick={() => router.push("/community")}
    //     />
    //   </div>
    //   <div className="hide-scrollbar mb-[11px] flex w-full max-w-4xl items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
    //     <span className="font-bungee text-[12px] opacity-15">
    //       INGRESA UN PROMPT{"  "}
    //     </span>

    //     <h1 className="font-bungee text-[20px]">INGERSA UN PROMPT</h1>
    //     <span className="font-bungee text-[12px] opacity-15">
    //       INGRESA UN PROMPT{"  "}
    //     </span>
    //   </div>
    // <textarea
    //   onChange={(e) => setPrompt(e.target.value)}
    //   value={prompt}
    //   placeholder={placeholder}
    //   className="h-[130px] w-[322px] border-2 border-black bg-light-pink p-3 text-[16px]  focus:outline-none"
    // />
    //   <div className="me-[50px] mt-[13px] flex w-full justify-end">
    //     {!isPending ? (
    //       <Image
    //         src="/images/enviar_btn.svg"
    //         height={37}
    //         width={103}
    //         alt="enviar_btn"
    //         onClick={handleClick}
    //       />
    //     ) : (
    //       <Image
    //         src="/images/enviando_btn.svg"
    //         height={37}
    //         width={126}
    //         alt="enviar_btn"
    //         onClick={handleClick}
    //       />
    //     )}
    //   </div>
    // </div>
  );
}
