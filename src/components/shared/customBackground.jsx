"use client"


import Image from 'next/image'
import React, { useState } from 'react'


const CustomBackground = ({
  lightImage,
  darkImage,
  children,
  className = '',
  priority = true,
  quality = 75,
  preload = true
}) => {
  const [lightLoaded, setLightLoaded] = useState(false)
  const [darkLoaded, setDarkLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Preload hint for critical images */}
      {preload && (
        <>
          <link rel="preload" as="image" href={lightImage} />
          <link rel="preload" as="image" href={darkImage} />
        </>
      )}

      {/* Fallback background color */}
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900" />

      {/* Dark mode background */}
      <Image
        src={darkImage}
        alt=""
        fill
        priority={priority}
        quality={quality}
        unoptimized={false}
        placeholder="empty"
        onLoad={() => setDarkLoaded(true)}
        className={`absolute inset-0 object-cover transition-opacity duration-500 ease-out ${darkLoaded ? 'opacity-100' : 'opacity-0'
          } dark:block hidden`}
        sizes="100vw"
      />

      {/* Light mode background */}
      <Image
        src={lightImage}
        alt=""
        fill
        priority={priority}
        quality={quality}
        unoptimized={false}
        placeholder="empty"
        onLoad={() => setLightLoaded(true)}
        className={`absolute inset-0 object-cover transition-opacity duration-500 ease-out ${lightLoaded ? 'opacity-100' : 'opacity-0'
          } dark:hidden block`}
        sizes="100vw"
      />

      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default CustomBackground