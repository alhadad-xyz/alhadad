import type { Metadata } from "next"
import { rosseta, wremena } from "./fonts"
import "./globals.css"
import { ConditionalFooter } from "./ConditionalFooter"
import { GlobalErrorHandler } from "@/components/ErrorBoundary"
import { DynamicColorProvider } from "@/components/DynamicColorProvider"

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settingsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/settings`,
      { cache: 'no-store' }
    )
    const settings = await settingsResponse.json()

    return {
      title: settings.siteTitle || "Cura Futuri - Interaction Designer",
      description: settings.siteDescription || "Interaction Designer based in Toronto, specializing in web animations and immersive digital experiences.",
      icons: {
        icon: settings.siteIcon?.url || "/favicon.ico",
      },
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    // Fallback metadata
    return {
      title: "Mohammad Khalid Alhadad - Full Stack Developer",
      description: "Full Stack Developer based in Pasuruan, specializing in web animations and immersive digital experiences.",
      icons: {
        icon: "/favicon.ico",
      },
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${rosseta.variable} ${wremena.variable}`}>
      <body className={wremena.className}>
        <GlobalErrorHandler>
          <DynamicColorProvider>
            {children}
            <ConditionalFooter />
          </DynamicColorProvider>
        </GlobalErrorHandler>
      </body>
    </html>
  )
} 