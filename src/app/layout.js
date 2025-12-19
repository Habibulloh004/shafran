import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Montserrat_Alternates } from "next/font/google"
import MainLayout from "@/components/shared/MainLayout";

const montserratAlt = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // kerakli og‘irliklarni yozasiz
  variable: "--font-montserrat-alt",   // CSS custom property
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // kerakli og‘irliklarni yozasiz
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
  title: "Shafran | Парфюмерия, Цветы и Подарки",
  description: "Shafran – магазин парфюмерии, изысканных цветов и стильных подарков. Лучший выбор для того, чтобы порадовать близких и подчеркнуть особые моменты.",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="icon" href="/logo.svg" />
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
          <MainLayout>
            {children}
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
