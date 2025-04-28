"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, GamepadIcon as GameController, Clock } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { useData, type Bet } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  const { user } = useAuth()
  const { bets, games, friends } = useData()
  const [activeBets, setActiveBets] = useState<Bet[]>([])
  const [pendingBets, setPendingBets] = useState<Bet[]>([])

  useEffect(() => {
    if (bets) {
      // Filter active bets
      setActiveBets(bets.filter((bet) => bet.status === "accepted").slice(0, 3))

      // Filter pending bets
      setPendingBets(bets.filter((bet) => bet.status === "pending" && bet.opponentId === user?.id).slice(0, 3))
    }
  }, [bets, user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}</h1>
        <p className="text-gray-300">Ready to place some bets?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/new-bet">
          <Button className="h-20 w-full bg-purple-600 hover:bg-purple-700">
            <div className="flex flex-col items-center">
              <GameController className="mb-1 h-6 w-6" />
              <span>New Bet</span>
            </div>
          </Button>
        </Link>
        <Link href="/dashboard/wallet">
          <Button className="h-20 w-full border-gray-700 bg-gray-800 hover:bg-gray-700">
            <div className="flex flex-col items-center">
              <span className="mb-1 text-lg font-bold">${user?.balance.toFixed(2)}</span>
              <span>Wallet</span>
            </div>
          </Button>
        </Link>
      </div>

      {/* Pending Bets */}
      {pendingBets.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Pending Requests</h2>
          </div>
          <div className="space-y-3">
            {pendingBets.map((bet) => (
              <PendingBetCard key={bet.id} bet={bet} />
            ))}
          </div>
        </div>
      )}

      {/* Active Bets */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Active Bets</h2>
          <Link href="/dashboard/my-bets">
            <Button variant="ghost" className="text-sm text-purple-400 hover:text-purple-300">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {activeBets.length > 0 ? (
          <div className="space-y-3">
            {activeBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        ) : (
          <Card className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-6 text-center">
              <p className="text-gray-300">No active bets. Create a new bet to get started!</p>
              <Link href="/dashboard/new-bet" className="mt-4 inline-block">
                <Button className="bg-purple-600 hover:bg-purple-700">Create New Bet</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Popular Games */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Popular Games</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {games.slice(0, 6).map((game) => (
            <Link key={game.id} href={`/dashboard/new-bet?gameId=${game.id}`}>
              <Card className="border-gray-700 bg-gray-800/50 hover:border-purple-500/50">
                <CardContent className="p-4">
                  <GameController className="mb-2 h-6 w-6 text-purple-500" />
                  <h3 className="text-sm font-medium text-white">{game.name}</h3>
                  <p className="text-xs text-gray-400">{game.platform}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function BetCard({ bet }: { bet: Bet }) {
  const { user } = useAuth()
  const isCreator = bet.creatorId === user?.id
  const opponent = isCreator ? bet.opponentName : "You"
  const creator = isCreator ? "You" : bet.opponentName

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">{bet.gameName}</h3>
            <p className="text-sm text-gray-400">
              {creator} vs {opponent}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-white">${bet.amount.toFixed(2)}</p>
            <p className="flex items-center text-xs text-gray-400">
              <Clock className="mr-1 h-3 w-3" />
              {formatDate(bet.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PendingBetCard({ bet }: { bet: Bet }) {
  const { acceptBet, rejectBet } = useData()

  const handleAccept = () => {
    acceptBet(bet.id)
  }

  const handleReject = () => {
    rejectBet(bet.id)
  }

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">{bet.gameName}</h3>
            <p className="text-sm text-gray-400">{bet.opponentName} challenged you</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-white">${bet.amount.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
            onClick={handleReject}
          >
            Decline
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()

  // If today
  if (date.toDateString() === now.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  // If yesterday
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  // Otherwise
  return date.toLocaleDateString()
}
