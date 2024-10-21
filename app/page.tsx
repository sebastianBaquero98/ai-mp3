"use client";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mb-[21px] flex h-[52px] w-full items-center justify-center border-y-2 border-y-black bg-sky-blue">
        {/* <h1 className="header_text">AI.MP3</h1> */}
        <Image
          src="/images/ai_mp3.svg"
          width={120}
          height={35}
          alt="title"
          className="drop-shadow-lg"
        />
        {/* <Image src="/icons/app-icon.jpg" width={25} height={25} alt="icon" /> */}
      </div>
      {/* <Link href="/api/login">Login with Spotify</Link> */}
      {!session ? (
        <Image
          src="/images/btn_inicio_sesion.svg"
          width={179}
          height={35}
          alt="title"
          className="mb-[10px]"
          onClick={() => signIn("spotify")}
        />
      ) : (
        <p>Ya estas logeado</p>
      )}

      <Image
        src="/images/btn_crear_cuenta.svg"
        width={157}
        height={35}
        alt="title"
      />
    </div>
  );
}
