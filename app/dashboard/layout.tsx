"use client"

import type React from "react"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { GamepadIcon as GameController, Home, Plus, Trophy, Wallet, LogOut } from "lucide-react"

import { useAuth } from "@/lib/auth-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "New Bet", href: "/dashboard/new-bet", icon: Plus },
    { name: "My Bets", href: "/dashboard/my-bets", icon: Trophy },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <GameController className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold text-white">Epic Jam</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">${user.balance.toFixed(2)}</span>
            <button
              onClick={handleLogout}
              className="ml-2 rounded-full p-2 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 z-10 w-full border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-around px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center ${
                  isActive ? "text-purple-500" : "text-gray-400 hover:text-white"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="mt-1 text-xs">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom padding to account for mobile navigation */}
      <div className="h-16"></div>
    </div>
  )
}
