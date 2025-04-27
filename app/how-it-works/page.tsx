import type React from "react"
import Link from "next/link"
import { ArrowRight, Check, GamepadIcon as GameController, Shield, Trophy, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <GameController className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold text-white">Epic Jam</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl">How Epic Jam Works</h1>
            <p className="mb-10 text-xl text-gray-300">
              Epic Jam makes it easy to challenge friends and other players to friendly bets on your favorite games.
              Here's how it works:
            </p>
          </div>

          {/* Steps */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                  1
                </div>
                <CardTitle className="text-xl text-white">Create an Account</CardTitle>
                <CardDescription className="text-gray-300">
                  Sign up and set up your profile to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <div className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-purple-500" />
                  <p>Create a free account with your email or social media</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-purple-500" />
                  <p>Set up your gaming profile with your favorite games</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-purple-500" />
                  <p>Add payment methods to fund your wallet</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/signup" className="w-full">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Create Account</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                  2
                </div>
                <CardTitle className="text-xl text-white">Create or Accept Bets</CardTitle>
                <CardDescription className="text-gray-300">
                  Challenge friends or accept incoming challenges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <div className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-purple-500" />
                  <p>Select a game from your device that you want to bet on</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-purple-500" />
                  <p>Choose an opponent from your friends list or find new players</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-purple-500" />
                  <p>Set the bet amount and terms of the challenge</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/signup" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
                  >
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                  3
                </div>
                <CardTitle className="text-xl text-white">Play and Get Paid</CardTitle>
                <CardDescription className="text-gray-300">
                  Play your game, submit results, and collect winnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <div className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-purple-500" />
                  <p>Play your game and track your performance</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-purple-500" />
                  <p>Submit your results through our secure verification system</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-purple-500" />
                  <p>Collect your winnings instantly in your Epic Jam wallet</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/signup" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
                  >
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-800/50 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Key Features</h2>
              <p className="mb-12 text-xl text-gray-300">
                Epic Jam is packed with features to make your gaming bets fun, fair, and rewarding
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<GameController className="h-10 w-10 text-purple-500" />}
                title="Multiple Game Support"
                description="Works with your favorite mobile and console games across different platforms."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-purple-500" />}
                title="Secure Verification"
                description="Our advanced result verification system ensures fair play and prevents disputes."
              />
              <FeatureCard
                icon={<Wallet className="h-10 w-10 text-purple-500" />}
                title="Flexible Payments"
                description="Support for multiple payment methods including EcoCash and PayPal."
              />
              <FeatureCard
                icon={<Trophy className="h-10 w-10 text-purple-500" />}
                title="Performance Tracking"
                description="Track your betting history and gaming performance over time."
              />
              <FeatureCard
                icon={<GameController className="h-10 w-10 text-purple-500" />}
                title="Online & Offline"
                description="Place bets and track results even when you're offline."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-purple-500" />}
                title="Secure Escrow"
                description="All bet amounts are held in secure escrow until results are verified and confirmed."
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Frequently Asked Questions</h2>
            <p className="mb-12 text-xl text-gray-300">Got questions? We've got answers</p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            <FaqCard
              question="How does Epic Jam verify game results?"
              answer="Epic Jam uses a combination of screenshot verification, game API integration where available, and peer confirmation to verify results. Both players must confirm the outcome, and our system has built-in dispute resolution for any disagreements."
            />
            <FaqCard
              question="What payment methods are supported?"
              answer="We currently support EcoCash for mobile money transfers and PayPal for online payments. We're working on adding more payment options in the future."
            />
            <FaqCard
              question="Is there a minimum or maximum bet amount?"
              answer="The minimum bet amount is $1.00, and the maximum bet amount is $500.00 per game. These limits help ensure responsible gaming."
            />
            <FaqCard
              question="What games are supported?"
              answer="Epic Jam supports most popular mobile and console games. As long as both players have access to the same game, you can create a bet for it. Our platform is constantly expanding its game compatibility."
            />
            <FaqCard
              question="How quickly can I withdraw my winnings?"
              answer="Withdrawals are processed within 24 hours. Once processed, the time it takes for funds to reach your account depends on your payment method (typically instant for EcoCash and 1-3 business days for PayPal)."
            />
          </div>

          <div className="mt-12 text-center">
            <Link href="/signup">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-12">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <GameController className="h-6 w-6 text-purple-500" />
              <span className="text-xl font-bold text-white">Epic Jam</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white">
                Responsible Gaming
              </Link>
              <Link href="#" className="hover:text-white">
                Contact Us
              </Link>
            </div>
            <div className="text-sm text-gray-400">© 2024 Epic Jam. All rights reserved.</div>
          </div>
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

function FaqCard({ question, answer }: { question: string; answer: string }) {
  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-lg text-white">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{answer}</p>
      </CardContent>
    </Card>
  )
}
