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
  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  const query = encodeURIComponent(artistName);

  // Make a request to the Spotify Search API with increased limit
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching artist ID:", errorData);
    throw new Error(
      `Failed to fetch artist ID: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (data.artists.items.length > 0) {
    // Find the best match among the returned artists
    const bestMatch = findBestArtistMatch(data.artists.items, artistName);
    if (bestMatch) {
      return bestMatch.id;
    }
  }

  throw new Error(`Artist "${artistName}" not found or no close match.`);
}

function findBestArtistMatch(artists: any[], searchName: string): any | null {
  const normalizedSearchName = normalizeString(searchName);

  // First, try to find an exact match (case-insensitive)
  const exactMatch = artists.find(
    (artist) => normalizeString(artist.name) === normalizedSearchName
  );
  if (exactMatch) return exactMatch;

  // If no exact match, use a scoring system
  let bestMatch = null;
  let highestScore = 0;

  for (const artist of artists) {
    const score = calculateMatchScore(artist.name, searchName);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = artist;
    }
  }

  // Only return a match if the score is above a certain threshold
  return highestScore > 0.8 ? bestMatch : null;
}

function calculateMatchScore(artistName: string, searchName: string): number {
  const normalizedArtistName = normalizeString(artistName);
  const normalizedSearchName = normalizeString(searchName);

  // Check for full inclusion
  if (
    normalizedArtistName.includes(normalizedSearchName) ||
    normalizedSearchName.includes(normalizedArtistName)
  ) {
    return 0.9;
  }

  // Calculate Levenshtein distance
  const distance = levenshteinDistance(
    normalizedArtistName,
    normalizedSearchName
  );
  const maxLength = Math.max(
    normalizedArtistName.length,
    normalizedSearchName.length
  );
  return 1 - distance / maxLength;
}

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
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
  Object.entries(filteredAttributes).forEach(([key, value]: any) => {
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
    trackName: track.name,
    trackId: track.id,
    artists: track.artists.map((artist: any) => artist.name).join(", "),
    playlistCover: track.album.images[0].url,
    previewUrl: track.previewUrl,
    duration_ms: track.duration_ms,
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
      duration_ms: track.duration_ms,
    }));
  }
}

async function filterByAudioFeatures(
  extractedAttributes: ExtractedAttributes,
  tracks: SpotifyTrack[]
) {
  const filteredTracks: SpotifyTrack[] = [];
  let playlistDuracion = 0;

  // Create a Set to store unique track IDs
  const uniqueTrackIds = new Set<string>();

  const trackIds = tracks.map((track) => track.trackId);
  const tracksAudioFeatures = await extractTrackFeatures(trackIds);

  for (let index = 0; index < tracks.length; index++) {
    const track = tracks[index];
    const trackAudioFeatures = tracksAudioFeatures[index];

    // Check if the track ID is already in the Set
    if (uniqueTrackIds.has(track.trackId)) {
      continue; // Skip this track if it's a duplicate
    }

    const shouldAddTrack =
      "danceability" in extractedAttributes ||
      "energy" in extractedAttributes ||
      "tempo" in extractedAttributes ||
      "valence" in extractedAttributes ||
      "loudness" in extractedAttributes ||
      "instrumentalness" in extractedAttributes ||
      "liveness" in extractedAttributes ||
      "speechiness" in extractedAttributes ||
      "acousticness" in extractedAttributes;

    if (shouldAddTrack) {
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
        filteredTracks.push(track);
        playlistDuracion += parseFloat(trackAudioFeatures.duration_ms);
        uniqueTrackIds.add(track.trackId); // Add the track ID to the Set
      }
    } else {
      if (!uniqueTrackIds.has(track.trackId)) {
        filteredTracks.push(track);
        // console.log("track", track);
        playlistDuracion += track.duration_ms;
        // console.log(playlistDuracion);
        uniqueTrackIds.add(track.trackId); // Add the track ID to the Set
      }
    }
  }

  // Shuffle the filtered tracks using Fisher-Yates algorithm
  for (let i = filteredTracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredTracks[i], filteredTracks[j]] = [
      filteredTracks[j],
      filteredTracks[i],
    ];
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
    // console.log("this is trackGenres", tracksGenres);
  }

  const recommendedTracks = tracksArtist.concat(tracksGenres);
  const { filteredTracks, playlistDuracion } = await filterByAudioFeatures(
    extractedAttributes,
    recommendedTracks.flat()
  );

  return { filteredTracks, playlistDuracion };

  // console.log(recommendedTracks);
}

export async function createPlaylist(
  userId: string,
  name: string,
  prompt: string
) {
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
          public: true,
          collaborative: false,
          description: `"${prompt}" - AI.MP3`,
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
