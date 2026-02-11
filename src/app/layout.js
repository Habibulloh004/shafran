import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthSyncProvider } from "@/providers/auth-sync-provider";
import { I18nProvider } from "@/i18n";
import { Montserrat_Alternates } from "next/font/google"
import MainLayout from "@/components/shared/MainLayout";
import ServiceWorkerRegistration from "@/components/shared/ServiceWorkerRegistration";
import { Toaster } from "sonner";

const montserratAlt = Montserrat_Alternates({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat-alt",
})

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shafran | Parfyumeriya, Gullar va Sovg'alar",
  description: "Shafran – parfyumeriya, nafis gullar va zamonaviy sovg'alar do'koni.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shafran",
  },
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="uz">
      <head>
        <link rel="icon" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserratAlt.variable} ${montserrat?.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <AuthSyncProvider>
              <MainLayout>
                {children}
              </MainLayout>
              <Toaster position="top-right" richColors closeButton />
              <ServiceWorkerRegistration />
            </AuthSyncProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
