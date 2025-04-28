"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  phoneNumber: string
  name: string
  balance: number
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (phoneNumber: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("epicJamUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (phoneNumber: string) => {
    // In a real app, this would validate the phone number with an API
    // For this demo, we'll create a user with the phone number

    // Generate a random user ID
    const userId = Math.random().toString(36).substring(2, 15)

    // Create a new user
    const newUser: User = {
      id: userId,
      phoneNumber,
      name: `User ${phoneNumber.slice(-4)}`,
      balance: 100, // Start with $100 for demo purposes
    }

    // Save user to localStorage
    localStorage.setItem("epicJamUser", JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("epicJamUser")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
