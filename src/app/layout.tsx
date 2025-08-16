import type { Metadata } from "next"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "FanFuel - Where Fans Fuel the Future",
  description: "Transform your everyday purchases into athlete support. Every tap, swipe, and purchase automatically sends a percentage to your chosen athletes.",
  keywords: ["NIL", "athlete support", "blockchain", "fan engagement", "sports technology"],
  authors: [{ name: "FanFuel Team" }],
  openGraph: {
    title: "FanFuel - Where Fans Fuel the Future",
    description: "Transform your everyday purchases into athlete support.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} antialiased`}
        style={{ cursor: 'none' }}
      >
        {children}
      </body>
    </html>
  );
}
