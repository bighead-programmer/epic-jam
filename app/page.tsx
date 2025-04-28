import type React from "react"
import Link from "next/link"
import { GamepadIcon as GameController, Trophy, Users, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GameController className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold text-white">Epic Jam</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-1 flex-col items-center justify-center px-4 py-20 text-center md:py-32">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          Bet on Your <span className="text-purple-500">Gaming Skills</span>
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-gray-300">
          Challenge friends and other players to friendly bets on your favorite mobile and console games. Connect,
          compete, and win!
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              How It Works
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-800/50 py-16">
        <div className="container px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Users className="h-10 w-10 text-purple-500" />}
              title="Connect with Players"
              description="Find and challenge other gamers to friendly bets on your favorite games."
            />
            <FeatureCard
              icon={<GameController className="h-10 w-10 text-purple-500" />}
              title="Multiple Game Support"
              description="Works with your favorite mobile and console games across different platforms."
            />
            <FeatureCard
              icon={<Wallet className="h-10 w-10 text-purple-500" />}
              title="Flexible Payments"
              description="Support for multiple payment methods including mobile money and online payments."
            />
            <FeatureCard
              icon={<Trophy className="h-10 w-10 text-purple-500" />}
              title="Fair Verification"
              description="Secure result submission and verification system to ensure fair play."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-purple-500" />}
              title="Online & Offline"
              description="Place bets and track results even when you're offline."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-purple-500" />}
              title="Performance Analytics"
              description="Track your betting history and gaming performance over time."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="mx-auto max-w-3xl rounded-lg border border-purple-500/20 bg-purple-500/5 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Ready to Start Betting?</h2>
          <p className="mb-6 text-gray-300">
            Join Epic Jam today and start challenging friends to bets on your favorite games.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-8">
        <div className="container px-4 text-center text-gray-400">
          <p>© 2024 Epic Jam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-purple-500/50 hover:bg-gray-800">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}
