// import { getAudioFeatures } from "@/lib/actions/user_profile.actions";
// import { getQuery } from "@/lib/spotify";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  // const userId = cookieStore.get("spotify_user_id");

  if (!accessToken) {
    redirect("/");
  }

  // const profile = await getProfile(accessToken.value);
  // const search = await getQuery(
  //   accessToken.value,
  //   "Don't Stop Me Now",
  //   "Queen"
  // );
  // console.log(search.tracks.items[0].name);

  // const audioFeatures = await getAudioFeatures();
  // console.log(audioFeatures);

  return (
    <div>
      <h1>Welcome!</h1>
      {/* <p className="text-white">{search.tracks.items[0].name}</p>
      <p className="text-white">{search.tracks.items[0].uri}</p> */}
      {/* <p>{userId?.value}</p> */}
    </div>
  );
}
