"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GamepadIcon as GameController } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate phone number format
      if (!phoneNumber.match(/^\+?[0-9]{10,15}$/)) {
        throw new Error("Please enter a valid phone number")
      }

      // Login with phone number
      await login(phoneNumber)
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <GameController className="h-6 w-6 text-purple-500" />
        <span className="text-xl font-bold text-white">Epic Jam</span>
      </Link>

      <Card className="w-full max-w-md border-gray-700 bg-gray-800/90">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Log in</CardTitle>
          <CardDescription className="text-gray-300">Enter your phone number to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="rounded-md bg-red-500/20 p-3 text-sm text-red-500">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-200">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="border-gray-700 bg-gray-700/50 text-white placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400">Enter your phone number with country code (e.g., +1234567890)</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
