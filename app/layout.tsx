import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techlynk.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Techlynk",
    template: "%s | Techlynk",
  },
  description:
    "Transform your business with Techlynk's cutting-edge software solutions and expert consulting services.",
  icons: {
    icon: [
      {
        url: "/icon.png?v=2",
      },
    ],
    apple: "/icon.png?v=2",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Techlynk",
    title: "Techlynk | Enterprise Software Solutions",
    description:
      "Transform your business with Techlynk's cutting-edge software solutions and expert consulting services.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Techlynk | Enterprise Software Solutions",
    description:
      "Transform your business with Techlynk's cutting-edge software solutions and expert consulting services.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
