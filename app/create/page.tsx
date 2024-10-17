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
import { makeRecomendation } from "@/lib/spotify";
import { useRouter } from "next/navigation";
import { msToHours } from "@/lib/utils";

export default function Create() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isPending, startTransition] = useTransition();
  const { setPlaylist } = usePlaylist();

  const handleClick = async () => {
    startTransition(async () => {
      const { favoriteArtists, favoriteGenres } = await getTopArtistsInfo();
      // console.log(favoriteArtists);
      // console.log(favoriteGenres);
      const topTracks = await getUserTopTrackNames();
      // console.log(topTracks);
      const audioFeatures = await getAudioFeatures();
      let extractedAttributes = await getExtractedAttributes(
        favoriteArtists,
        favoriteGenres,
        topTracks,
        audioFeatures,
        prompt
      );

      try {
        extractedAttributes = extractedAttributes.replace("json", "");
        extractedAttributes = extractedAttributes.replace("`", "");
        extractedAttributes = extractedAttributes.replace("`", "");
        extractedAttributes = extractedAttributes.replace("`", "");
        extractedAttributes = extractedAttributes.replace("`", "");
        extractedAttributes = extractedAttributes.replace("`", "");
        extractedAttributes = extractedAttributes.replace("`", "");
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

      // console.log(extractedAttributes);

      // console.log(attributes);

      // // console.log(recommendedTracks);
      // console.log("duracion", playlistDuracion);

      // console.log(recommendedTracks);
      // router.push({
      //   pathname: "/create/result",
      //   query: { items: JSON.stringify(recommendedTracks) },
      // });
    });
  };
  return (
    <div className="flex flex-col items-center">
      <div className="mb-[26px] mt-[50px] flex h-[52px] w-full items-center justify-center border-y-2 border-y-black bg-sky-blue">
        <Image
          src="/images/ai_mp3.svg"
          width={131}
          height={32}
          alt="comunidad"
          className="drop-shadow-lg"
          onClick={() => router.push("/community")}
        />
      </div>
      <div className="hide-scrollbar mb-[11px] flex w-full max-w-4xl items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="font-bungee text-[12px] opacity-15">
          INGRESA UN PROMPT{"  "}
        </span>

        <h1 className="font-bungee text-[16px]">INGERSA UN PROMPT</h1>
        <span className="font-bungee text-[12px] opacity-15">
          INGRESA UN PROMPT{"  "}
        </span>
      </div>
      <textarea
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        placeholder="Quiero un playlist para poder manejar por la noche con las ventanas abajo y a todo volumen. Que dure mínimo una hora y que vaya de menos a más"
        className="h-[120px] w-[322px] border-2 border-black bg-light-pink p-3 text-[14px]  focus:outline-none"
      />
      <div className="me-[50px] mt-[13px] flex w-full justify-end">
        {!isPending ? (
          <Image
            src="/images/enviar_btn.svg"
            height={37}
            width={103}
            alt="enviar_btn"
            onClick={handleClick}
          />
        ) : (
          <Image
            src="/images/enviando_btn.svg"
            height={37}
            width={126}
            alt="enviar_btn"
            onClick={handleClick}
          />
        )}
      </div>
    </div>
  );
}
