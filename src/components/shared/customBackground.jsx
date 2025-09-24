import Image from 'next/image'
import React from 'react'

const CustomBackground = ({
  lightImage,
  darkImage,
  children,
  className = '',
  priority = true,
  quality = 100
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Dark mode background */}
      <Image
        src={darkImage}
        alt="Background"
        fill
        priority={priority}
        quality={quality}
        className="absolute inset-0 object-cover object-center opacity-0 transition-opacity duration-300 ease-in-out dark:opacity-100"
        sizes="100vw"
        loading="eager"
      />

      {/* Light mode background */}
      <Image
        src={lightImage}
        alt="Background"
        fill
        priority={priority}
        quality={quality}
        className="absolute inset-0 object-cover object-center opacity-100 transition-opacity duration-300 ease-in-out dark:opacity-0"
        sizes="100vw"
        loading="eager"
      />

      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default CustomBackground