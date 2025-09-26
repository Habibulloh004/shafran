"use client"

import * as React from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"

const images = [
  "/background/home1.webp",
  "/img/sauvage.webp",
  "/img/res3.webp",
]

export default function ImageGallery() {
  const [active, setActive] = React.useState(images[0])
  const [hovered, setHovered] = React.useState(null)

  return (
    <div className="flex gap-4">
      {/* Asosiy rasm */}
      <div className="relative group">
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-zoom-in relative w-[120px] h-[200px] sm:w-[250px] sm:h-[350px] md:w-[350px] md:h-[450px] rounded-xl overflow-hidden">
              <Image
                src={active}
                alt="Main"
                fill
                className="object-contain"
              />
            </div>
          </DialogTrigger>
          <DialogContent mark="true" className="max-w-full w-[calc(98vw)] h-[calc(97vh)] bg-black/70 p-0 z-[9999]">
            <DialogHeader>
              <DialogTitle className="hidden" />
              <DialogDescription className="hidden" />
            </DialogHeader>
            <div className="relative w-full h-[600px]">
              <Image src={active} alt="Zoom" fill className="object-contain" />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnail rasmlar */}
      <div className="flex flex-col justify-center items-center gap-3">
        {images.map((img) => (
          <div
            key={img}
            className={cn(
              "relative w-10 md:w-16 h-10 md:h-16 rounded-md cursor-pointer overflow-hidden",
              active === img ? "border bg-primary/10" : ""
            )}
            onClick={() => setActive(img)}
            onMouseEnter={() => setHovered(img)}
            onMouseLeave={() => setHovered(null)}
          >
            <Image src={img} alt="thumb" fill className="object-contain p-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
