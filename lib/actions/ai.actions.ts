"use server";

import { AudioFeatures, SpotifyTrack } from "@/types";
// import Groq from "groq-sdk";
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function createAIGeneratedPlaylist(userPrompt: string) {
// const response = await groq.chat.completions.create({
//   messages: [
//     {
//       role: "system",
//       content:
//         "Te han entrenado para generar un playlist de canciones según el input del usuario. Eres muy bueno en esto, siempre logras recomendar canciones dentro de la playlist que logran el objetico del usuario. Pueden ser canciones en ingles o en español, depende de tu punto de vista profesional. Sin",
//     },
//     {
//       role: "user",
//       content: userPrompt,
//     },
//   ],
//   model: "llama-3.1-8b-instant",
// });

//   console.log(response.choices[0]?.message?.content || "");
// }

export async function getExtractedAttributes(
  favoriteArtists: string[],
  favoriteGenres: string[],
  favoritaTracks: string[],
  audioFeatures: AudioFeatures,
  promptInput: string,
  spotifyGenres: string
) {
  try {
    const systemPrompt = `Haces parte de un sistema que crear listas de reproducción musical que considera las preferencias musicales del usuario y su solicitud actual. Tu objetivo es extraer atributos musicales relevantes para crear una lista que se alinee con los gustos y deseos del usuario.
**Instrucciones:**
- **Prioriza la solicitud actual del usuario**, especialmente si es específica, sobre sus preferencias musicales.
- Proporciona los atributos en formato **JSON válido**.
- **NO** incluyas ningún texto fuera del JSON.
- Utiliza **comillas dobles** tanto para las claves como para los valores de texto en el JSON.
- **Atributos a incluir (si corresponde):**
  - **"genres"**: IMPORTANTE: Deben ser de la lista de Genres Validos.
  - **"artists"**: Siempre tratar de incluir artistas. Utiliza los nombres completos de los artistas. Cuando el usuario incluya un genero en el prompt, los artistas que incluyas DEBEN de ser de ese genero asi no este en el listado de artistas favoritos del usuario.
  - **Características de audio**:
    - Para cada característica ("acousticness", "danceability", "energy", "instrumentalness", "liveness", "loudness", "speechiness", "tempo", "valence"), ajusta el valor promedio del usuario hasta en un **20%** según su solicitud actual.
    - Proporciona valores de **"min"** y **"max"** dentro de los rangos aceptados por Spotify (por ejemplo, de 0.0 a 1.0 para la mayoría de las características).
- **Si el usuario incluye artistas específicos**, no incluyas **genres** ni **tracks** en la respuesta.
- **Si el usuario pide musica similar a la de un artista** retorna unicamente los generos asociados al artista y del listado de artistas favoritos del usuario los que esten asociados a ese genero. **Los generos deben ser del listado de Genres Validos** Si no encuentras retorna generes vacio.
- **Si el usuario pide musica similar a una canción** retorna el artista de la canción y los generos asociados a la canción. **Los generos deben ser de la lista de Genres Validos**

"Genres Validos": ${spotifyGenres}
**Ejemplos de salidas:**

*Ejemplo 1:*
_Solicitud del usuario:_ "Quiero canciones pop animadas para una fiesta."
{
  "genres": ["rap"],
  "artists": ["Drake"],
  "tracks": ["No Digas Lo Siento"],
  "danceability": {"min": 0.8, "max": 1.0},
  "energy": {"min": 0.8, "max": 1.0},
  "valence": {"min": 0.7, "max": 1.0},
  "tempo": {"min": 120, "max": 150}
}
*Ejemplo 2:*
_Solicitud del usuario:_ "Ponme música acústica relajante."
{
  "genres": ["acoustic"],
  "artist": ["Novo Amor", "Billie Eilish"],
  "tracks": ["Anchor", "TV"],
  "acousticness": {"min": 0.8, "max": 1.0},
  "energy": {"min": 0.0, "max": 0.3},
  "tempo": {"min": 60, "max": 80}
}

*Ejemplo 3:*
_Solicitud del usuario:_ "Quiero canciones de Coldplay"
{
  "artists": ["Coldplay"],
}
  
*Ejemplo 4:*
_Solicitud del usuario:_ "Quiero una playlist de canciones parecidas a las de Drake"
{
  "artists":["J.Cole"],
  "genres": ["rap", "hip-hop"],
}

*Ejemplo 5:*
_Solicitud del usuario:_ "Quiero una playlist de canciones parecidas a viva la vida"
{
  "artists":["Coldplay"],
  "genres": ["pop"],
}
`;

    const userPrompt = `
**Preferencias del usuario:**
- Canciones favoritas: "${favoritaTracks.join(", ")}"
- Características de audio promedio: ${JSON.stringify(audioFeatures)}
- Artistas favoritos: "${favoriteArtists.join(", ")}"
- Géneros favoritos: "${favoriteGenres.join(", ")}"

**Solicitud del usuario:**
"${promptInput}"
`;

    // console.log(systemPrompt);
    // console.log(combinedPrompt);
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });
    const attributes = response.choices[0]?.message?.content || "";
    return attributes;
  } catch (error) {
    console.error("Error getting audio features:", error);
    throw error;
  }
}

export async function createTitle(playlist: SpotifyTrack[], prompt: string) {
  // The objective of this method is to creat a name for the playlisy based on the songs that are in it.
  // console.log("playlist", playlist);
  try {
    const userPrompt = `
    **Songs in the playlist:** ${playlist.join(", ")}
    **Prompt:** ${prompt}
    `;
    // console.log(userPrompt);
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "Your job is to create a playlist title based on the songs that are in it and the prompt used be the suer to produce it. It has to be catchy and relevant. It could be in spanish or english, depending on the songs in the playlist. Title should not be long maximum 4 words",
        },
        { role: "user", content: userPrompt },
      ],

      max_tokens: 200,
      temperature: 0.7,
    });
    const title = response.choices[0]?.message?.content || "";
    return title;
  } catch (error) {
    console.error("Error creating playlist title:", error);
    throw error;
  }
}
