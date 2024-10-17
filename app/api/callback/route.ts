import { exchangeCodeForTokens, getProfile } from "@/lib/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = request.cookies.get("spotify_auth_state")?.value;

  if (state === null || state !== storedState) {
    return NextResponse.redirect(
      new URL("/?error=state_mismatch", request.url)
    );
  }
  // TODO Falla aca en inicio de sesion por alguna razón
  try {
    // console.log("code", code);
    // eslint-disable-next-line camelcase
    const { access_token, refresh_token } = await exchangeCodeForTokens(code!);
    // console.log("access_token", access_token);
    // console.log("refresh_token", refresh_token);
    const profile = await getProfile(access_token);
    const response = NextResponse.redirect(new URL("/create", request.url));
    response.cookies.set("spotify_access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
    });
    response.cookies.set("spotify_refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    response.cookies.set("spotify_user_id", profile.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.redirect(
      new URL("/?error=token_exchange_failed", request.url)
    );
  }
}
