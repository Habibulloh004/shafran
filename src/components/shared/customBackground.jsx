"use client"
import Image from "next/image"
import React from "react"

const CustomBackground = ({
  lightImage,
  darkImage,
  children,
  className = "",
  priority = true,
  quality = 100,
}) => {
  return (
    <div className={`w-full relative overflow-hidden ${className}`}>
      {/* Fallback rang */}
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900" />

      {/* Dark mode background */}
      <Image
        src={darkImage}
        alt="dark background"
        fill
        priority={priority}
        quality={quality}
        placeholder="blur"
        className="absolute inset-0 object-cover hidden dark:block"
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
        className="absolute inset-0 object-cover block dark:hidden"
        sizes="100vw"
      />

      {/* Overlay content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default CustomBackground
