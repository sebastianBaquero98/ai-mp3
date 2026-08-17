# AI.MP3

AI.MP3 is an AI-powered Spotify playlist generator. Describe what you want to hear in natural language, and the app creates a personalized playlist based on your request and your Spotify listening preferences.

For example:

> “Create an energetic rock and hip-hop playlist for my workout.”

AI.MP3 combines that prompt with your favorite artists, genres, tracks, and listening characteristics to recommend music that fits the moment.

## How it works

1. Sign in securely with Spotify.
2. Describe the music, mood, activity, or artists you want.
3. OpenAI translates your request and Spotify preferences into musical attributes.
4. Spotify data is used to find and filter matching tracks.
5. Preview the generated playlist, rename it, and remove songs you do not want.
6. Save the finished playlist directly to your Spotify account.

## Features

- Natural-language playlist creation
- Personalized recommendations based on Spotify listening history
- Support for moods, activities, genres, and specific artists
- AI-generated playlist titles
- Track previews when available
- Playlist editing before saving
- Direct playlist creation in Spotify
- Mobile-first interface in Spanish

## Built with

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI API](https://platform.openai.com/docs/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)

## Getting started

### Prerequisites

You will need:

- Node.js and npm
- A Spotify Developer application
- An OpenAI API key

### 1. Clone the repository

```bash
git clone https://github.com/sebastianBaquero98/ai-mp3.git
cd ai-mp3
npm install
```

### 2. Configure Spotify

Create an application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

Add the following redirect URI to your Spotify application:

```text
http://localhost:3000/api/callback
```

### 3. Add environment variables

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Do not commit `.env.local` or expose these credentials publicly.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Spotify.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Run the production build
npm run lint     # Check the code with ESLint
npm run ngrok    # Expose the local server through ngrok
```

## Project status

AI.MP3 is an experimental project under active development. The core playlist-generation and Spotify export flow is implemented, while community and discovery functionality is still being developed.
