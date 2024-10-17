import { generateRandomString } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  console.log("clientId", clientId);
  // const redirectUri = encodeURIComponent(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`
  // );
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`;
  const state = generateRandomString(16);
  const scope =
    "user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private";

  const params = new URLSearchParams({
    show_dialog: "true",
    response_type: "code",
    client_id: clientId!,
    scope,
    redirect_uri: redirectUri!,
    state,
  });

  console.log("params", params.toString());

  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
  response.cookies.set("spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
