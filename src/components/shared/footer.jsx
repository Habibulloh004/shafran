"use client"

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Separator } from '../ui/separator'
import { usePathname } from 'next/navigation'
import { getData } from '../../../actions/get'
import { DEFAULT_LOCALE, useTranslation } from "@/i18n"

export default function Footer() {
  const pathname = usePathname()
  const [settings, setSettings] = useState(null)
  const { t, locale } = useTranslation()

  const fetchFooter = async () => {
    try {
      const data = await getData({
        endpoint: "/api/footer",
        tag: "footer",
        revalidate: 0,
        throwOnError: false,
        ignoreStatuses: [401, 403, 404],
      })
      setSettings(data?.data || data || null)
    } catch (error) {
      console.error("Footer yuklashda xatolik:", error)
    }
  }

  useEffect(() => {
    fetchFooter()
  }, [pathname, locale])

  useEffect(() => {
    const handleFooterUpdated = () => {
      fetchFooter()
    }

    window.addEventListener("footer:updated", handleFooterUpdated)
    return () => window.removeEventListener("footer:updated", handleFooterUpdated)
  }, [])

  if (pathname == "/login" || pathname == "/register" || pathname == "/forgot-password") {
    return <></>
  }

  const socialLinks = []
  if (settings?.facebook_enabled && settings?.facebook) {
    socialLinks.push({ href: settings.facebook, icon: "/icons/facebook.svg", alt: "Facebook" })
  }
  if (settings?.instagram_enabled && settings?.instagram) {
    socialLinks.push({ href: settings.instagram, icon: "/icons/instagram.svg", alt: "Instagram" })
  }
  if (settings?.twitter_enabled && settings?.twitter) {
    socialLinks.push({ href: settings.twitter, icon: "/icons/twitter.svg", alt: "Twitter" })
  }
  if (settings?.telegram_enabled && settings?.telegram) {
    socialLinks.push({ href: settings.telegram, icon: "/icons/telegram.svg", alt: "Telegram" })
  }
  if (settings?.youtube_enabled && settings?.youtube) {
    socialLinks.push({ href: settings.youtube, icon: "/icons/youtube.svg", alt: "YouTube" })
  }
  if (settings?.tiktok_enabled && settings?.tiktok) {
    socialLinks.push({ href: settings.tiktok, icon: "/icons/tiktok.svg", alt: "TikTok" })
  }

  const getLocalizedSetting = (baseKey, fallback) => {
    const localizedKey = `${baseKey}_${locale}`;
    const defaultKey = `${baseKey}_${DEFAULT_LOCALE}`;
    return (
      (settings && settings[localizedKey]) ||
      (settings && settings[defaultKey]) ||
      fallback
    );
  };
  const address = getLocalizedSetting("address", settings?.address || "")
  const phone = settings?.phone || ""
  const phone2 = settings?.phone2 || ""
  const email = settings?.email || ""
  const workingHours = getLocalizedSetting("working_hours", settings?.working_hours || "")
  const workingHoursTitle = getLocalizedSetting("working_hours_title", t("footer.workingHours"));
  const subscribeTitle = getLocalizedSetting("subscribe_title", t("footer.subscribe"));
  const defaultCopyright = `© ${new Date().getFullYear()} SHAFRAN. All Rights Reserved.`
  const copyrightText =
    getLocalizedSetting("copyright_text", settings?.copyright_text || defaultCopyright)

  return (
    <footer className='text-xs sm:text-sm md:text-md relative bg-[#F9F9F9] dark:bg-[#272727] w-full h-auto before:bg-neutral-200 dark:before:bg-[#CBCBCB] before:absolute before:-top-1 before:w-full before:h-[2px]'>
      <main className='pt-12 pb-4 space-y-5'>
        <section className='max-w-[1440px] w-11/12 mx-auto flex flex-wrap gap-5 justify-between'>
          <div className='flex flex-col gap-3'>
            <div className="relative h-16 w-32 flex-shrink-0">
              <Image
                loading="eager"
                src="/img/logoDark.svg"
                alt="light mode"
                width={128}
                height={64}
                className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
              />
              <Image
                loading="eager"
                src="/img/logoLight.svg"
                alt="dark mode"
                width={128}
                height={64}
                className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
              />
            </div>
            <ul className='text-neutral-500 dark:text-[#7C7C7C]'>
              {address && <li>{t("footer.address")}: {address}</li>}
              {phone && <li>{t("footer.phone")}: {phone}</li>}
              {phone2 && <li>{t("footer.phone2")}: {phone2}</li>}
              {email && <li>{t("footer.mail")}: {email}</li>}
            </ul>
          </div>
          {workingHours && (
            <div>
            <h1>{workingHoursTitle}</h1>
              <ul className='text-neutral-500 dark:text-[#7C7C7C]'>
                <li>{workingHours}</li>
              </ul>
            </div>
          )}
          <div>
            <h1>{subscribeTitle}</h1>
            <ul className='text-neutral-500 dark:text-[#7C7C7C]'>
              {phone && <li>{phone}</li>}
              {socialLinks.length > 0 && (
                <li className='flex justify-start items-center gap-2 mt-2'>
                  {socialLinks.map((link) => (
                    <a key={link.alt} href={link.href} target="_blank" rel="noopener noreferrer">
                      <Image src={link.icon} alt={link.alt} width={44} height={44} />
                    </a>
                  ))}
                </li>
              )}
            </ul>
          </div>
        </section>
        <Separator className={"border-[1px] bg-neutral-200 dark:bg-[#CBCBCB] w-full"} />
        <section className='flex flex-wrap justify-between items-center max-w-[1440px] w-11/12 mx-auto text-neutral-400 dark:text-[#888888]'>
          <h1>{copyrightText}</h1>
        </section>
      </main>
    </footer>
  )
}
