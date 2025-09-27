"use client"

import React, { useEffect, useRef, useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { Button } from "../ui/button"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePathname } from "next/navigation"

gsap.registerPlugin(ScrollTrigger)

export default function Header() {
  const headerRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  console.log(pathname)
  useEffect(() => {
    if (!headerRef.current) return

    let lastScroll = 0
    const header = headerRef.current

    // Background toggle
    ScrollTrigger.create({
      start: "top 0",
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    })

    // Scroll direction
    const handleScroll = () => {
      const currentScroll = window.scrollY

      if (currentScroll > lastScroll && currentScroll > 80) {
        // pastga scroll
        gsap.to(header, { y: -100, duration: 0.4, ease: "power2.out" })
      } else {
        // yuqoriga scroll
        gsap.to(header, { y: 0, duration: 0.4, ease: "power2.out" })
      }
      lastScroll = currentScroll
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  if (pathname == "/login" || pathname == "/register") {
    return <></>
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 z-[999] w-full  h-20 md:h-24 flex justify-center items-center border-b border-transparent transition-colors duration-300`}
    >
      <main className={`max-w-[1440px] flex justify-between items-center gap-2 sm:gap-3 w-11/12 mx-auto h-16 md:h-18 px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl
        ${scrolled
          ? "bg-white/70 dark:bg-black/25 backdrop-blur-sm border-b-gray-200 dark:border-b-gray-800"
          : "bg-transparent"
        }`}>

        {/* Left side - Burger + Logo */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Burger Menu */}
          <Button variant="icon" size="icon" className="md:hidden w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
            <svg className="w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>

          {/* Logo */}
          <div className="relative w-16 sm:w-24 md:w-32 h-8 sm:h-12 md:max-h-16">
            <Image
              loading="eager"
              src="/img/logoDark.svg"
              alt="light mode"
              width={0}
              height={0}
              className="absolute h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            />
            <Image
              loading="eager"
              src="/img/logoLight.svg"
              alt="dark mode"
              width={0}
              height={0}
              className="h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            />
          </div>
        </div>

        {/* Right side - Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="icon" size="icon" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
            <Image
              loading="eager"
              src="/icons/searchDark.svg"
              alt="light mode"
              width={0}
              height={0}
              className="absolute h-[1.1rem] w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            />
            <Image
              loading="eager"
              src="/icons/searchLight.svg"
              alt="dark mode"
              width={0}
              height={0}
              className="h-[1.1rem] w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            />
          </Button>

          <Button variant="icon" size="icon" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
            <Image
              loading="eager"
              src="/icons/cartDark.svg"
              alt="light mode"
              width={0}
              height={0}
              className="absolute h-[1.1rem] w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            />
            <Image
              loading="eager"
              src="/icons/cartLight.svg"
              alt="dark mode"
              width={0}
              height={0}
              className="h-[1.1rem] w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            />
          </Button>

          <Button variant="icon" size="icon" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
            <Image
              loading="eager"
              src="/icons/profileDark.svg"
              alt="light mode"
              width={0}
              height={0}
              className="absolute h-[1.1rem] w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            />
            <Image
              loading="eager"
              src="/icons/profileLight.svg"
              alt="dark mode"
              width={0}
              height={0}
              className="h-[1.1rem] w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            />
          </Button>

          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
            <ModeToggle />
          </div>
        </div>
      </main>
    </header>
  )
}