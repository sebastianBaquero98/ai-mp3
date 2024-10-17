"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function ConfirmationPage() {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-screen  w-full flex-col items-center justify-center">
        <Image
          src="/images/playlist_confirmation.svg"
          height={270}
          width={237}
          alt="confirmation"
        />
      </div>
      <div className="mb-[50px] flex flex-col items-center gap-2">
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
      </div>
    </div>
  );
}
