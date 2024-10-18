// import SongItem from "@/components/SongItem";
import Image from "next/image";
export default function Playlist() {
  return (
    <div className="flex flex-col">
      <div className="mt-[50px] flex h-[56px] items-center justify-center border-y-2 border-y-black bg-sky-blue">
        <h1 className="font-bungee text-[18px]">El más duro del pedazo</h1>
      </div>
      <div className="mt-[16px] flex items-center justify-evenly">
        <Image
          src="/images/album_cover_2.svg"
          height={185}
          width={180}
          alt=""
        />
        <div className="flex flex-col">
          <p className="font-sans text-[10px]">
            Cantidad de veces reproducida{" "}
            <span className="font-bungee">3298</span>
          </p>
          <p className="font-sans text-[10px]">
            Creado por <span className="font-bungee">KOGNITO</span>
          </p>
          <p className="font-sans text-[10px]">
            Duración <span className="font-bungee">1H 3MIN</span>
          </p>
          <p className="font-sans text-[10px]">
            Me gusta <span className="font-bungee">1839</span>
          </p>
          <h3 className="mt-[10px] font-bungee text-[11px]">PROMPT</h3>
          <div className="h-[75px] w-[176px] rounded-sm border-2 border-black bg-light-pink p-1 text-[10px] focus:outline-none">
            Crea una playlist de música de maleanteo que me haga sentir
            empoderado y me de un subidon de energía{" "}
          </div>
        </div>
      </div>
      <div className="mt-[25px] flex flex-col gap-1">
        {/* <SongItem />
        <SongItem />
        <SongItem />
        <SongItem />
        <SongItem />
        <SongItem />
        <SongItem />
        <SongItem />
        <SongItem /> */}
        <div className="mt-[60px] flex w-full justify-center gap-4">
          <Image
            src="/images/agregar_btn.svg"
            height={35}
            width={122}
            alt="agregar_btn"
          />
          <Image
            src="/images/like_btn_2.svg"
            height={35}
            width={90}
            alt="editar_btn"
          />
        </div>
      </div>
    </div>
  );
}
