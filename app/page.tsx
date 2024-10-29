import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-[url('/images/background_image.png')] bg-cover bg-no-repeat px-4">
      <div className="mt-[25%] h-[60px] w-[214px] bg-black">
        <h1 className="text-center font-sans text-[47px] font-black text-white">
          AI.MP3
        </h1>
      </div>
      <div className="mt-[30%] text-end font-sans text-[36px] text-black">
        {" "}
        <p>Empoderando</p>
        <p>Artistas</p>
        <p>Creadores</p>
      </div>
      <div className="mt-[5%] flex flex-col items-start gap-1 text-[20px] font-black">
        <Link href="/api/login">
          <p>Iniciar Sesion</p>{" "}
        </Link>
        <button>Crear Cuenta</button>
      </div>
      <p className="mt-[55%] text-end">v2.0-2024</p>

      {/* <div className="mb-[21px] flex h-[52px] w-full items-center justify-center border-y-2 border-y-black bg-sky-blue">
        <Image
          src="/images/ai_mp3.svg"
          width={120}
          height={35}
          alt="title"
          className="drop-shadow-lg"
        />
      </div>
      <Link href="/api/login">
        <Image
          src="/images/btn_inicio_sesion.svg"
          width={179}
          height={35}
          alt="title"
          className="mb-[10px]"
        />
      </Link>
      <Image
        src="/images/btn_crear_cuenta.svg"
        width={157}
        height={35}
        alt="title"
      /> */}
    </div>
  );
}
