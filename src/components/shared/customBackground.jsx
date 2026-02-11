"use client"
import { cn } from "@/lib/utils"
import Image from "next/image"
import React from "react"

const CustomBackground = ({
  lightImage,
  darkImage,
  singleImage,
  children,
  className = "",
  priority = true,
  classNameImage = "",
  quality = 75,
  type = "multi"
}) => {
  if (type == "single" && singleImage) {
    return (
      <div className={`w-full relative ${className}`}>
        {/* Fallback rang */}
        <div className="absolute  inset-0 bg-white dark:bg-black" />

        {/* Dark mode background */}
        <Image
          src={singleImage}
          alt="dark background"
          fill
          priority={priority}
          quality={quality}
          
          placeholder="blur"
          className={cn("absolute inset-0 object-cover", classNameImage)}
          sizes="100vw"
        />
        {/* Overlay content */}
        <div className="relative z-10">{children}</div>
      </div>
    )
  } else return (
    <div className={`w-full relative overflow-hidden ${className}`}>
      {/* Fallback rang */}
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* Dark mode background */}
      <Image
        src={darkImage}
        alt="dark background"
        fill
        priority={priority}
        quality={quality}
        
        placeholder="blur"
        className={cn("absolute inset-0 object-cover hidden dark:block", classNameImage)}
        sizes="100vw"
      />

      {/* Light mode background */}
      <Image
        src={lightImage}
        alt="light background"
        fill
        priority={priority}
        quality={quality}
        
        placeholder="blur"
        className={cn("absolute inset-0 object-cover block dark:hidden", classNameImage)}
        sizes="100vw"
      />

      {/* Overlay content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default CustomBackground
