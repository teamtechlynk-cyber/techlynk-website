import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techlynk.co"

const title = "Techlynk | Oracle Fusion Staff Augmentation & Consulting"
const description =
  "Techlynk connects you with pre-vetted, certified Oracle Fusion specialists across Finance, SCM, HCM, EPM, CX, and WMS. Flexible engagement models, deployed in 24-48 hours."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Techlynk",
  },
  description,
  keywords: [
    "Oracle Fusion staff augmentation",
    "Oracle Fusion consultants",
    "Oracle Fusion implementation services",
    "Oracle EBS implementation",
    "Oracle EPM implementation",
    "Oracle HCM implementation",
    "Oracle SCM implementation",
    "Oracle Cloud services",
    "OIC integration services",
    "Oracle Fusion staffing agency",
  ],
  authors: [{ name: "Techlynk" }],
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      {
        url: "/icon.png?v=2",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Techlynk",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Techlynk",
  url: siteUrl,
  logo: `${siteUrl}/techlynk-logo.png`,
  image: `${siteUrl}/techlynk-logo.png`,
  description,
  telephone: "+91-95737-87824",
  email: "support@techlynk.co",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "Oracle Fusion",
    "Oracle EBS",
    "Oracle EPM",
    "Oracle HCM",
    "Oracle SCM",
    "Oracle Cloud",
    "OIC Integrations",
    "VBCS",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        {/* Isolated in its own boundary: Analytics bails out of static
            prerendering, and sharing a boundary with `children` was hiding
            the entire page behind a client-only loading shell. */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
