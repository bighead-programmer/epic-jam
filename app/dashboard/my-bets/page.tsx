"use client"

import { useState } from "react"
import { Check, Clock, GamepadIcon as GameController, Trophy, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MyBetsPage() {
  const [activeTab, setActiveTab] = useState("active")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">My Bets</h1>
        <p className="text-gray-300">Manage and track all your bets</p>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="active" className="data-[state=active]:bg-purple-600">
            Active
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600">
            Pending
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-purple-600">
            Completed
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <BetCard
              game="Call of Duty: Mobile"
              opponent="Alex Johnson"
              amount="$15.00"
              date="Today, 5:00 PM"
              status="accepted"
              type="active"
            />
            <BetCard
              game="PUBG Mobile"
              opponent="Sarah Williams"
              amount="$25.00"
              date="Tomorrow, 7:30 PM"
              status="accepted"
              type="active"
            />
            <BetCard
              game="FIFA 24"
              opponent="Mike Thompson"
              amount="$10.00"
              date="Today, 9:00 PM"
              status="accepted"
              type="active"
            />
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <BetCard
              game="Fortnite"
              opponent="Emily Davis"
              amount="$20.00"
              date="Pending acceptance"
              status="pending"
              type="pending"
            />
            <BetCard
              game="Apex Legends"
              opponent="Chris Evans"
              amount="$30.00"
              date="Pending acceptance"
              status="pending"
              type="pending"
            />
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <BetCard
              game="Call of Duty: Mobile"
              opponent="Chris Evans"
              amount="$20.00"
              date="Yesterday"
              status="won"
              type="completed"
            />
            <BetCard
              game="FIFA 24"
              opponent="James Wilson"
              amount="$10.00"
              date="2 days ago"
              status="lost"
              type="completed"
            />
            <BetCard
              game="PUBG Mobile"
              opponent="Maria Garcia"
              amount="$15.00"
              date="Last week"
              status="won"
              type="completed"
            />
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <BetCard
              game="Call of Duty: Mobile"
              opponent="Alex Johnson"
              amount="$15.00"
              date="Today, 5:00 PM"
              status="accepted"
              type="active"
            />
            <BetCard
              game="Fortnite"
              opponent="Emily Davis"
              amount="$20.00"
              date="Pending acceptance"
              status="pending"
              type="pending"
            />
            <BetCard
              game="Call of Duty: Mobile"
              opponent="Chris Evans"
              amount="$20.00"
              date="Yesterday"
              status="won"
              type="completed"
            />
            <BetCard
              game="PUBG Mobile"
              opponent="Sarah Williams"
              amount="$25.00"
              date="Tomorrow, 7:30 PM"
              status="accepted"
              type="active"
            />
            <BetCard
              game="FIFA 24"
              opponent="James Wilson"
              amount="$10.00"
              date="2 days ago"
              status="lost"
              type="completed"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BetCard({
  game,
  opponent,
  amount,
  date,
  status,
  type,
}: {
  game: string
  opponent: string
  amount: string
  date: string
  status: "pending" | "accepted" | "won" | "lost"
  type: "active" | "pending" | "completed"
}) {
  return (
    <Card className="border-gray-700 bg-gray-800/50 hover:border-purple-500/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GameController className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg text-white">{game}</CardTitle>
          </div>
          <StatusBadge status={status} />
        </div>
        <CardDescription className="flex items-center text-gray-400">
          <Clock className="mr-1 h-3 w-3" /> {date}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-gray-700">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={opponent} />
            <AvatarFallback className="bg-purple-600 text-white">
              {opponent
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-white">{opponent}</p>
            <p className="text-xs text-gray-400">Opponent</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">{amount}</p>
          <p className="text-xs text-gray-400">Bet Amount</p>
        </div>
        {type === "active" && (
          <Button size="sm" variant="outline" className="border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700">
            Submit Result
          </Button>
        )}
        {type === "pending" && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500">
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" className="h-8 w-8 bg-green-600 p-0 hover:bg-green-700">
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}
        {type === "completed" && (
          <div className={`flex items-center gap-1 ${status === "won" ? "text-green-500" : "text-red-500"}`}>
            {status === "won" ? (
              <>
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-medium">Won</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4" />
                <span className="text-sm font-medium">Lost</span>
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

function StatusBadge({ status }: { status: "pending" | "accepted" | "won" | "lost" }) {
  const colors = {
    pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
    accepted: "bg-green-500/20 text-green-500 border-green-500/50",
    won: "bg-green-500/20 text-green-500 border-green-500/50",
    lost: "bg-red-500/20 text-red-500 border-red-500/50",
  }

  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    won: "Won",
    lost: "Lost",
  }

  return <span className={`rounded-full border px-2 py-1 text-xs font-medium ${colors[status]}`}>{labels[status]}</span>
}
