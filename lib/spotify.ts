"use server";
import {
  SpotifyProfile,
  SpotifyTokens,
  ExtractedAttributes,
  SpotifyTrack,
} from "@/types";
import { cookies } from "next/headers";
import { extractTrackFeatures } from "./actions/user_profile.actions";

// Agregar promis return
export async function getQuery(
  accessToken: string,
  track: string,
  artist: string
) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const encodedTrack = encodeURIComponent(track);
  const encodedArtist = encodeURIComponent(artist);
  const query = `track:${encodedTrack} artist:${encodedArtist}`;

  const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;

  const response = await fetch(url, {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Error response:", errorBody);
    throw new Error(
      `Failed to fetch query: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  // console.log(data);
  return data;
}

export async function exchangeCodeForTokens(
  code: string
): Promise<SpotifyTokens> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri!,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for tokens");
  }
  // console.log("response", response);
  return response.json();
}

export async function getProfile(
  accessToken?: string
): Promise<SpotifyProfile> {
  const cookieStore = cookies();

  // Use the accessToken passed as a parameter if available; otherwise, use the token from cookies
  const token = accessToken || cookieStore.get("spotify_access_token")?.value;
  // console.log("token", token);
  if (!token) {
    throw new Error("Access token is missing");
  }

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching profile:", errorData);
    throw new Error(`Failed to fetch profile: ${errorData.error.message}`);
  }

  return response.json();
}

export async function searchTracks(
  extractedAttributes: any,
  favoriteArtists: any,
  favoriteGenres: any
) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  try {
    const queries = [];

    if (extractedAttributes.genres && extractedAttributes.genres.length > 0) {
      queries.push(
        extractedAttributes.genres
          .map((genre: any) => `"${genre}"`)
          .join(" OR ")
      );
    } else {
      queries.push(
        favoriteGenres.map((genre: any) => `"${genre}"`).join(" OR ")
      );
    }

    const query = queries.join(" ");

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Spotify API error:", errorResponse);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const tracks = data.tracks.items;
    return { trackIds: tracks.map((track: any) => track.id) };
  } catch (error) {
    console.error("Error getting track names:", error);
    throw error;
  }
}

async function getArtistId(artistName: string) {
  // Encode the artist name to make it URL-safe
  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  const query = encodeURIComponent(artistName);

  // Make a request to the Spotify Search API
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // Check if the response is successful
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching artist ID:", errorData);
    throw new Error(
      `Failed to fetch artist ID: ${response.status} ${response.statusText}`
    );
  }

  // Parse the JSON response
  const data = await response.json();

  // Check if any artists were found
  if (data.artists.items.length > 0) {
    // Return the ID of the first artist in the search results
    return data.artists.items[0].id;
  } else {
    throw new Error(`Artist "${artistName}" not found.`);
  }
}

export async function getAvailableGenreSeeds(): Promise<string[]> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  const response = await fetch(
    `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  return data.genres;
}

// async function getRecommendationGenre(
//   genres: string,
//   extractedAttributes: ExtractedAttributes
// ) {
//   if (extractedAttributes.genres) delete extractedAttributes.genres;
//   if (extractedAttributes.artists) delete extractedAttributes.artists;

//   // Loop through musical attri. add them to params
//   let params = "";
//   Object.keys(extractedAttributes).forEach((key) => {
//     const attributeKey = key as keyof ExtractedAttributes;
//     params += `min_${attributeKey}=${extractedAttributes[attributeKey].min}&`;
//     params += `max_${key}=${extractedAttributes[key].max}`;
//   });
//   console.log(params);
//   const cookieStore = cookies();
//   const accessToken = cookieStore.get("spotify_access_token")?.value;
//   // console.log(params);
//   const response = await fetch(
//     `https://api.spotify.com/v1/recommendations?seed_genres=${genres}&${params}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );
//   const data = await response.json();
//   const tracks = data.tracks;
//   // console.log(tracks);
// return tracks.map((track: any) => ({
//   trackName: track.name,
//   trackId: track.id,
//   artists: track.artists.map((artist: any) => artist.name).join(", "),
//   playlistCover: track.album.images[0].url,
//   previewUrl: track.preview_url,
// }));
// }

async function getRecommendationGenre(
  genres: string,
  extractedAttributes: ExtractedAttributes
) {
  const { genres: _, artists: __, ...filteredAttributes } = extractedAttributes;

  const params = new URLSearchParams();
  Object.entries(filteredAttributes).forEach(([key, value]) => {
    params.append(`min_${key}`, value.min.toString());
    params.append(`max_${key}`, value.max.toString());
  });
  params.append("seed_genres", genres);

  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken) {
    throw new Error("Spotify access token not found");
  }

  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data.tracks.map((track: any) => ({
    trackName: track.trackName,
    trackId: track.trackId,
    artists: track.artists.map((artist: any) => artist.name).join(", "),
    playlistCover: track.album.images[0].url,
    previewUrl: track.previewUrl,
  }));
}

export async function getArtistTopTracks(artistName: string) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  const artistId = await getArtistId(artistName);
  // console.log(artistName);
  // console.log(artistId);
  if (artistId) {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Spotify API error:", errorResponse);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { tracks } = await response.json();
    // if (artistName === "Taylor Swift") {
    //   console.log(tracks);
    // }
    return tracks.map((track: any) => ({
      trackName: track.name,
      trackId: track.id,
      artists: track.artists.map((artist: any) => artist.name).join(", "),
      playlistCover: track.album.images[0].url,
      previewUrl: track.preview_url,
    }));
  }
}

async function filterByAudioFeatures(
  extractedAttributes: ExtractedAttributes,
  tracks: SpotifyTrack[]
) {
  // console.log("extractedAttributes", extractedAttributes);
  // console.log("tracks before filter", tracks);
  let filteredTracks: SpotifyTrack[] = [];
  let playlistDuracion = 0;

  const trackIds = tracks.map((track) => track.trackId);
  const tracksAudioFeatures = await extractTrackFeatures(trackIds);
  // console.log("tracksAudioFeatures", tracksAudioFeatures);
  // Get Music Attributes of each song
  let index = 0;
  for (const track of tracks) {
    // console.log("track", track.trackId);

    // Quiero que para todos los tracks solo sea un llamdo a la API -> Rate Limit
    // console.log("trackAudioFeatures", trackAudioFeatures);
    const trackAudioFeatures = tracksAudioFeatures[index];
    // if (index === 0) {
    //   console.log("trackAudioFeatures", trackAudioFeatures);
    // }

    if (
      "danceability" in extractedAttributes ||
      "energy" in extractedAttributes ||
      "tempo" in extractedAttributes ||
      "valence" in extractedAttributes ||
      "loudness" in extractedAttributes ||
      "instrumentalness" in extractedAttributes ||
      "liveness" in extractedAttributes ||
      "speechiness" in extractedAttributes ||
      "acousticness" in extractedAttributes
    ) {
      if (
        (trackAudioFeatures?.danceability >
          extractedAttributes.danceability?.min &&
          trackAudioFeatures?.danceability <
            extractedAttributes.danceability?.max) ||
        (trackAudioFeatures?.energy > extractedAttributes.energy?.min &&
          trackAudioFeatures?.energy < extractedAttributes.energy?.max) ||
        (trackAudioFeatures?.tempo > extractedAttributes.tempo?.min &&
          trackAudioFeatures?.tempo < extractedAttributes.tempo?.max) ||
        (trackAudioFeatures?.valence > extractedAttributes.valence?.min &&
          trackAudioFeatures?.valence < extractedAttributes.valence?.max) ||
        (trackAudioFeatures?.loudness > extractedAttributes.loudness?.min &&
          trackAudioFeatures?.loudness < extractedAttributes.loudness?.max) ||
        (trackAudioFeatures?.instrumentalness >
          extractedAttributes.instrumentalness?.min &&
          trackAudioFeatures?.instrumentalness <
            extractedAttributes.instrumentalness?.max) ||
        (trackAudioFeatures?.liveness > extractedAttributes.liveness?.min &&
          trackAudioFeatures?.liveness < extractedAttributes.liveness?.max) ||
        (trackAudioFeatures?.speechiness >
          extractedAttributes.speechiness?.min &&
          trackAudioFeatures?.speechiness <
            extractedAttributes.speechiness?.max) ||
        (trackAudioFeatures?.acousticness >
          extractedAttributes.acousticness?.min &&
          trackAudioFeatures?.acousticness <
            extractedAttributes.acousticness?.max)
      ) {
        // console.log("Track added");
        filteredTracks.push(track);
        playlistDuracion += parseFloat(trackAudioFeatures.duration_ms);
      }
    } else {
      filteredTracks = tracks;
      playlistDuracion += tracksAudioFeatures.map((track: any) =>
        parseFloat(track.duration_ms)
      );
    }

    index++;
  }
  return { filteredTracks, playlistDuracion };
}

export async function makeRecomendation(
  extractedAttributes: ExtractedAttributes
) {
  // RECIBIR OBJETO DE ATRIBUTOS
  const artists = extractedAttributes.artists || [];
  const genres = extractedAttributes.genres || [];
  let tracksGenres = [];
  const query = genres.join(",");
  // For Genres
  // Use spotify recomendation API
  if (genres.length === 0 && artists.length === 0) {
    // Use recomendations api only
    return { filteredTracks: [], playlistDuracion: 0 };
  }

  // For Artists
  const tracksPromise = artists.map((artists) => getArtistTopTracks(artists));
  const tracksArtist = await Promise.all(tracksPromise);
  // console.log(tracksArtist);

  if (genres.length !== 0) {
    tracksGenres = await getRecommendationGenre(query, extractedAttributes);
  }

  const recommendedTracks = tracksArtist.concat(tracksGenres);
  const { filteredTracks, playlistDuracion } = await filterByAudioFeatures(
    extractedAttributes,
    recommendedTracks.flat()
  );

  return { filteredTracks, playlistDuracion };

  // console.log(recommendedTracks);
}

export async function createPlaylist(userId: string, name: string) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify({
          // Add your request body here
          name,
          public: false,
          collaborative: false,
        }),
      }
    );
    const result = await response.json();
    return result.id;
  } catch (error) {
    console.error("Error adding playlist:", error);
  }
}

export async function addSongsToPlaylist(
  playlistId: string,
  tracks: SpotifyTrack[]
) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  const trackIds = tracks.map((track) => "spotify:track:" + track.trackId);
  // console.log("trackIds", trackIds);
  try {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify({
        uris: trackIds,
      }),
    });
    // const result = await response.json();
  } catch (error) {
    console.error("Error adding songs to playlist:", error);
  }
}
