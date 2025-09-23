import Image from "next/image";

export default function RegisterPage() {
  return (
    <div
      className="
        relative
        w-full min-h-screen
        flex justify-center items-start
        overflow-hidden
        before:absolute before:inset-0
        before:bg-[url(/img/gul.webp)]
        before:bg-no-repeat before:bg-cover before:bg-[center_70%]
        before:brightness-150
        before:blur-[5px]
        before:scale-105
        before:z-0
      "
    >
      {/* Content */}
      <main className="relative z-10 max-w-[1440px] mx-auto flex flex-wrap w-full gap-3 justify-center items-start py-20 px-10">
        <div className="gap-10 flex-col flex-1 flex justify-center items-center">
          <Image
            src={'/img/logoB.webp'}
            alt="Logo"
            width={300}
            height={300}
            loading="eager"
            sizes="(max-width: 768px) 75vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="backdrop-blur-sm shadow-[0px_0px_21.6px_-7px_#966877] w-2/3 rounded-[10px] p-2 min-h-56 bg-[#151515BF]">
            Register form
          </div>
        </div>
        <div className="flex-1 flex justify-center items-start">
          <Image
            src={"/img/logoDark.svg"}
            alt="logo"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            width={400}
            height={400}
            loading="eager"
          />
        </div>
      </main>
    </div>
  )
}
