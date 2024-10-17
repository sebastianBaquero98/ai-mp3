"use server";

import { AudioFeatures } from "@/types";
import { console } from "inspector";
import { cookies } from "next/headers";

// ================= TRACK INFO =================
export async function getUserTopTrackIds() {
  // console.log("this is getUserTopTrackIds");
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("spotify_access_token")?.value;
    // console.log("accessToken", accessToken);

    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Log all headers to the console
    // for (const [key, value] of response.headers.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    // // You can also log the response status and status text
    // console.log("Status:", response.status);
    // console.log("Status Text:", response.statusText);

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        `Failed to fetch top tracks: ${response.status} - ${errorDetails}`
      );
      throw new Error(`Failed to fetch top tracks: ${response.status}`);
    }

    const data = await response.json();
    // console.log("this is data", data);
    const trackIds = data.items.map((track: any) => track.id);

    return trackIds;
  } catch (error) {
    console.error("Error getting top track ids:", error);
    throw error;
  }
}

export async function getUserTopTrackNames() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("spotify_access_token")?.value;
    // console.log("accessToken", accessToken);

    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        `Failed to fetch top tracks: ${response.status} - ${errorDetails}`
      );
      throw new Error(`Failed to fetch top tracks: ${response.status}`);
    }

    const data = await response.json();
    const trackNames = data.items.map((track: any) => track.name);

    return trackNames;
  } catch (error) {
    console.error("Error getting top track names:", error);
    throw error;
  }
}

export async function extractTracksFeatures(trackIds: string[]) {
  // console.log("this is trackIds", trackIds);
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("spotify_access_token")?.value;

    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch track features");
    }

    const data = await response.json();

    return data.audio_features;
  } catch (error) {
    console.error("Error fetching track features:", error);
    throw error;
  }
}

export async function extractTrackFeatures(trackIds: string[]) {
  const joinedTrackIds = trackIds.join(",");
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("spotify_access_token")?.value;

    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${joinedTrackIds}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      // throw new Error("Failed to fetch track features");
      console.log("Failed to fetch track features");
    }

    const data = await response.json();

    return data.audio_features;
  } catch (error) {
    console.error("Error fetching track features:", error);
    throw error;
  }
}

export async function aggregateTrackInformation(audioFeatures: any) {
  const featureColumns: (keyof AudioFeatures)[] = [
    "danceability",
    "energy",
    "key",
    "loudness",
    "mode",
    "speechiness",
    "acousticness",
    "instrumentalness",
    "liveness",
    "valence",
    "tempo",
  ];

  const userProfile: Partial<AudioFeatures> = {};

  featureColumns.forEach((column) => {
    const sum = audioFeatures.reduce(
      (acc: any, feature: any) => acc + feature[column],
      0
    );
    userProfile[column] = sum / audioFeatures.length;
  });

  return userProfile as AudioFeatures;
}

export async function getAudioFeatures() {
  // console.log("hola");
  try {
    // const trackNames = getUserTopTrackNames();
    const trackIds = await getUserTopTrackIds();
    // console.log("this is trackIds antes", trackIds);
    const audioFeatures = await extractTracksFeatures(trackIds);
    // console.log("this is audio featurees", audioFeatures);
    const aggregateAudioFeatures =
      await aggregateTrackInformation(audioFeatures);

    // return trackNames;
    return aggregateAudioFeatures;
  } catch (error) {
    console.error("Error getting audio features:", error);
    throw error;
  }
}

// export async function getAudioFeaturesv2(trackId:string) {
//   try {
//     // const trackNames = getUserTopTrackNames();
//     const trackIds = await getUserTopTrackIds();
//     // console.log("this is trackIds", trackIds);
//     const audioFeatures = await extractTrackFeatures(trackIds);
//     // console.log("this is audio featurees", audioFeatures);
//     const aggregateAudioFeatures =
//       await aggregateTrackInformation(audioFeatures);

//     // return trackNames;
//     return aggregateAudioFeatures;
//   } catch (error) {
//     console.error("Error getting audio features:", error);
//     throw error;
//   }
// }

// ================= ARTIST INFO =================
export async function getTopArtistsInfo() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("spotify_access_token")?.value;

    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/top/artists?limit=50&range=short_term",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        `Failed to fetch top tracks: ${response.status} - ${errorDetails}`
      );
      throw new Error(`Failed to fetch top tracks: ${response.status}`);
    }

    const data = await response.json();
    // Creates a list of favorite aritists names
    const favoriteArtists = data.items.map((artist: any) => artist.name);

    // Create a unique array of genres from the favorite artists
    // Set -> Makes them unique
    const favoriteGenres: string[] = Array.from(
      new Set(data.items.flatMap((artist: any) => artist.genres))
    );
    return { favoriteArtists, favoriteGenres };
  } catch (error) {
    console.error("Error getting top artists:", error);
    throw error;
  }
}
