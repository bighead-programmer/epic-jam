"use client"

import { useState, useEffect } from "react"
import { Clock, GamepadIcon as GameController, Trophy, X } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { useData, type Bet } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MyBetsPage() {
  const { user } = useAuth()
  const { bets, acceptBet, rejectBet, completeBet } = useData()
  const [activeBets, setActiveBets] = useState<Bet[]>([])
  const [pendingBets, setPendingBets] = useState<Bet[]>([])
  const [completedBets, setCompletedBets] = useState<Bet[]>([])
  const [activeTab, setActiveTab] = useState("active")

  useEffect(() => {
    if (bets && user) {
      // Filter active bets
      setActiveBets(bets.filter((bet) => bet.status === "accepted"))

      // Filter pending bets (both sent and received)
      setPendingBets(bets.filter((bet) => bet.status === "pending"))

      // Filter completed bets
      setCompletedBets(bets.filter((bet) => bet.status === "completed"))
    }
  }, [bets, user])

  const handleAccept = (betId: string) => {
    acceptBet(betId)
  }

  const handleReject = (betId: string) => {
    rejectBet(betId)
  }

  const handleSubmitResult = (betId: string, result: "creator_won" | "opponent_won" | "draw") => {
    completeBet(betId, result)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Bets</h1>
        <p className="text-gray-300">Manage and track all your bets</p>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="active" className="data-[state=active]:bg-purple-600">
            Active
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600">
            Pending
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-purple-600">
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeBets.length > 0 ? (
            <div className="space-y-4">
              {activeBets.map((bet) => (
                <ActiveBetCard key={bet.id} bet={bet} onSubmitResult={handleSubmitResult} />
              ))}
            </div>
          ) : (
            <Card className="border-gray-700 bg-gray-800/50">
              <CardContent className="p-6 text-center">
                <p className="text-gray-300">No active bets found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {pendingBets.length > 0 ? (
            <div className="space-y-4">
              {pendingBets.map((bet) => (
                <PendingBetCard key={bet.id} bet={bet} onAccept={handleAccept} onReject={handleReject} />
              ))}
            </div>
          ) : (
            <Card className="border-gray-700 bg-gray-800/50">
              <CardContent className="p-6 text-center">
                <p className="text-gray-300">No pending bets found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedBets.length > 0 ? (
            <div className="space-y-4">
              {completedBets.map((bet) => (
                <CompletedBetCard key={bet.id} bet={bet} />
              ))}
            </div>
          ) : (
            <Card className="border-gray-700 bg-gray-800/50">
              <CardContent className="p-6 text-center">
                <p className="text-gray-300">No completed bets found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ActiveBetCard({
  bet,
  onSubmitResult,
}: {
  bet: Bet
  onSubmitResult: (betId: string, result: "creator_won" | "opponent_won" | "draw") => void
}) {
  const { user } = useAuth()
  const isCreator = bet.creatorId === user?.id
  const opponent = isCreator ? bet.opponentName : "You"
  const creator = isCreator ? "You" : bet.opponentName

  const [showResultOptions, setShowResultOptions] = useState(false)

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GameController className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg text-white">{bet.gameName}</CardTitle>
          </div>
          <StatusBadge status="active" />
        </div>
        <CardDescription className="flex items-center text-gray-400">
          <Clock className="mr-1 h-3 w-3" /> {formatDate(bet.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              {creator} vs {opponent}
            </p>
            <p className="text-xs text-gray-400">Bet Amount: ${bet.amount.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        {!showResultOptions ? (
          <Button onClick={() => setShowResultOptions(true)} className="w-full bg-purple-600 hover:bg-purple-700">
            Submit Result
          </Button>
        ) : (
          <div className="w-full space-y-3">
            <p className="text-sm text-gray-300">Who won the game?</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
                onClick={() => onSubmitResult(bet.id, isCreator ? "creator_won" : "opponent_won")}
              >
                I Won
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
                onClick={() => onSubmitResult(bet.id, "draw")}
              >
                Draw
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
                onClick={() => onSubmitResult(bet.id, isCreator ? "opponent_won" : "creator_won")}
              >
                Opponent Won
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
              onClick={() => setShowResultOptions(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

function PendingBetCard({
  bet,
  onAccept,
  onReject,
}: {
  bet: Bet
  onAccept: (betId: string) => void
  onReject: (betId: string) => void
}) {
  const { user } = useAuth()
  const isCreator = bet.creatorId === user?.id
  const opponent = isCreator ? bet.opponentName : "You"
  const creator = isCreator ? "You" : bet.opponentName

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GameController className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg text-white">{bet.gameName}</CardTitle>
          </div>
          <StatusBadge status="pending" />
        </div>
        <CardDescription className="flex items-center text-gray-400">
          <Clock className="mr-1 h-3 w-3" /> {formatDate(bet.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              {creator} vs {opponent}
            </p>
            <p className="text-xs text-gray-400">Bet Amount: ${bet.amount.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isCreator ? (
          <p className="text-sm text-gray-400">Waiting for opponent to accept...</p>
        ) : (
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1 border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
              onClick={() => onReject(bet.id)}
            >
              Decline
            </Button>
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => onAccept(bet.id)}>
              Accept
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

function CompletedBetCard({ bet }: { bet: Bet }) {
  const { user } = useAuth()
  const isCreator = bet.creatorId === user?.id
  const opponent = isCreator ? bet.opponentName : "You"
  const creator = isCreator ? "You" : bet.opponentName

  let resultText = "Draw"
  let resultColor = "text-yellow-500"

  if (bet.result === "creator_won") {
    resultText = isCreator ? "You Won" : "You Lost"
    resultColor = isCreator ? "text-green-500" : "text-red-500"
  } else if (bet.result === "opponent_won") {
    resultText = isCreator ? "You Lost" : "You Won"
    resultColor = isCreator ? "text-red-500" : "text-green-500"
  }

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GameController className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg text-white">{bet.gameName}</CardTitle>
          </div>
          <StatusBadge status="completed" />
        </div>
        <CardDescription className="flex items-center text-gray-400">
          <Clock className="mr-1 h-3 w-3" /> {formatDate(bet.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              {creator} vs {opponent}
            </p>
            <p className="text-xs text-gray-400">Bet Amount: ${bet.amount.toFixed(2)}</p>
          </div>
          <div className={`flex items-center gap-1 ${resultColor}`}>
            {resultText === "You Won" && <Trophy className="h-4 w-4" />}
            {resultText === "You Lost" && <X className="h-4 w-4" />}
            <span className="font-medium">{resultText}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: "pending" | "active" | "completed" }) {
  const colors = {
    pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
    active: "bg-green-500/20 text-green-500 border-green-500/50",
    completed: "bg-blue-500/20 text-blue-500 border-blue-500/50",
  }

  const labels = {
    pending: "Pending",
    active: "Active",
    completed: "Completed",
  }

  return <span className={`rounded-full border px-2 py-1 text-xs font-medium ${colors[status]}`}>{labels[status]}</span>
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
