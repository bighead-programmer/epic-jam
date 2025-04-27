import type React from "react"
import Link from "next/link"
import { ArrowRight, Clock, DollarSign, GamepadIcon as GameController, Trophy, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Welcome back, John</h1>
          <p className="text-gray-300">Here's what's happening with your bets today.</p>
        </div>
        <Link href="/dashboard/new-bet">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            New Bet
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Bets"
          value="5"
          description="2 pending results"
          icon={<Trophy className="h-5 w-5 text-purple-500" />}
        />
        <StatCard
          title="Total Winnings"
          value="$120.50"
          description="+$25.00 this week"
          icon={<DollarSign className="h-5 w-5 text-green-500" />}
        />
        <StatCard
          title="Win Rate"
          value="68%"
          description="Last 30 days"
          icon={<Trophy className="h-5 w-5 text-yellow-500" />}
        />
        <StatCard
          title="Connected Players"
          value="12"
          description="3 online now"
          icon={<Users className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Active Bets */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Active Bets</h2>
          <Link href="/dashboard/my-bets">
            <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <BetCard
            game="Call of Duty: Mobile"
            opponent="Alex Johnson"
            amount="$15.00"
            date="Today, 5:00 PM"
            status="pending"
          />
          <BetCard
            game="PUBG Mobile"
            opponent="Sarah Williams"
            amount="$25.00"
            date="Tomorrow, 7:30 PM"
            status="accepted"
          />
          <BetCard game="FIFA 24" opponent="Mike Thompson" amount="$10.00" date="Today, 9:00 PM" status="pending" />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <Link href="/dashboard/history">
            <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card className="border-gray-700 bg-gray-800/50">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-700">
              <ActivityItem
                title="Won bet against Chris Evans"
                description="Call of Duty: Mobile • $20.00"
                time="2 hours ago"
                icon={<Trophy className="h-5 w-5 text-yellow-500" />}
              />
              <ActivityItem
                title="New bet request from Maria Garcia"
                description="PUBG Mobile • $15.00"
                time="5 hours ago"
                icon={<GameController className="h-5 w-5 text-purple-500" />}
              />
              <ActivityItem
                title="Added funds to wallet"
                description="PayPal • $50.00"
                time="Yesterday"
                icon={<DollarSign className="h-5 w-5 text-green-500" />}
              />
              <ActivityItem
                title="Lost bet against James Wilson"
                description="FIFA 24 • $10.00"
                time="2 days ago"
                icon={<Trophy className="h-5 w-5 text-gray-500" />}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Plus({ className, ...props }: React.ComponentProps<typeof ArrowRight>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function StatCard({
  title,
  value,
  description,
  icon,
}: { title: string; value: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-gray-400">{description}</p>
      </CardContent>
    </Card>
  )
}

function BetCard({
  game,
  opponent,
  amount,
  date,
  status,
}: { game: string; opponent: string; amount: string; date: string; status: "pending" | "accepted" | "completed" }) {
  return (
    <Card className="border-gray-700 bg-gray-800/50 hover:border-purple-500/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white">{game}</CardTitle>
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
        <StatusBadge status={status} />
      </CardFooter>
    </Card>
  )
}

function StatusBadge({ status }: { status: "pending" | "accepted" | "completed" }) {
  const colors = {
    pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
    accepted: "bg-green-500/20 text-green-500 border-green-500/50",
    completed: "bg-blue-500/20 text-blue-500 border-blue-500/50",
  }

  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    completed: "Completed",
  }

  return <span className={`rounded-full border px-2 py-1 text-xs font-medium ${colors[status]}`}>{labels[status]}</span>
}

function ActivityItem({
  title,
  description,
  time,
  icon,
}: { title: string; description: string; time: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/50">{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-white">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="text-xs text-gray-400">{time}</div>
    </div>
  )
}
