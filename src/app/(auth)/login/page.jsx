import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="
      w-full min-h-screen
      bg-scroll
      bg-[url(/img/login.webp)]
      bg-no-repeat
      bg-cover
      bg-[center_70%]
      brightness-150
      flex justify-center items-start
    ">
      <main className="max-w-[1440px] mx-auto flex flex-wrap w-full gap-3 justify-center items-start py-20 px-10">

        <div className="gap-10 flex-col flex-1 flex justify-center items-center">
          <Image
            src={"/img/logoB.webp"}
            alt="Logo"
            width={300}
            height={300}
            loading="eager"
            sizes="(max-width: 768px) 75vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="w-2/3 rounded-[10px] p-2 min-h-20 bg-[#151515BF] backdrop-blur-sm">
            Login form
          </div>
        </div>
        <div className="flex-1 flex justify-center items-start">
          <Image
            src={"/img/logoDark.svg"}
            alt="logo"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            width={400}
            height={400}
            className=""
            loading="eager"

          />
        </div>
      </main>
    </div>
  )
}
