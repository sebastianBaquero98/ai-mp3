"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function ConfirmationPage() {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="primary-text-gradient w-full text-center font-sans text-[36px] text-white">
        ¡Playlist creado!
      </h1>
      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          className="h-[30px] bg-electric-green px-5 text-background"
          onClick={() => router.push("/community")}
        >
          Ir al inicio
        </Button>
        <Button
          className=" h-[30px] bg-electric-green px-5 py-0 text-background"
          onClick={() => router.push("/create")}
        >
          Crear Otra
        </Button>
      </div>

      {/* <div className="flex h-screen  w-full flex-col items-center justify-center">
        <Image
          src="/images/playlist_confirmation.svg"
          height={270}
          width={237}
          alt="confirmation"
        />
      </div> */}
      {/* <div className="mb-[50px] flex flex-col items-center gap-2">
        <Image
          src="/images/hacer_publico_btn.svg"
          height={48}
          width={208}
          alt="confirmation"
        />
        <Image
          src="/images/inicio_btn.svg"
          height={48}
          width={105}
          alt="confirmation"
          onClick={() => router.push("/community")}
        />
      </div> */}
    </div>
  );
}
