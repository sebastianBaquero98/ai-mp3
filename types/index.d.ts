export interface SpotifyTokens {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface SpotifyProfile {
  id: string;
  display_name: string;
  email: string;
}

export interface SpotifyTrack {
  trackName: string;
  trackId: string;
  artists: string;
  playlistCover: string;
  previewUrl: string;
  duration_ms: number;
  linkToSong: string;
}

export interface AudioFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
}

export interface ExtractedAttributes {
  genres?: string[];
  artists?: string[];
  tracks?: string[];
  acousticness: {
    min: number;
    max: number;
  };
  danceability: {
    min: number;
    max: number;
  };
  energy: {
    min: number;
    max: number;
  };
  instrumentalness: {
    min: number;
    max: number;
  };
  liveness: {
    min: number;
    max: number;
  };
  loudness: {
    min: number;
    max: number;
  };
  speechiness: {
    min: number;
    max: number;
  };
  tempo: {
    min: number;
    max: number;
  };
  valence: {
    min: number;
    max: number;
  };
}

// export interface UserMusicalProfile {
//   danceability: number;
//   energy: number;
//   key: number;
//   loudness: number;
//   mode: number;
//   speechiness: number;
//   acousticness: number;
//   instrumentalness: number;
//   liveness: number;
//   valence: number;
//   tempo: number;
// }
