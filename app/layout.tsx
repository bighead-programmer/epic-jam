import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Epic Jam - Gaming Bet Platform",
  description: "Challenge friends to bets on your favorite games",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              {children}
            </ThemeProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
