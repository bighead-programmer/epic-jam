import { ArrowDown, ArrowUp, Trophy } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">History</h1>
        <p className="text-gray-300">View your betting history and performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Total Bets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">42</div>
            <p className="text-sm text-gray-400">All time</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">68%</div>
            <p className="text-sm text-gray-400">28 wins, 14 losses</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Total Winnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">+$350.75</div>
            <p className="text-sm text-gray-400">Net profit</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Biggest Win</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$75.00</div>
            <p className="text-sm text-gray-400">vs. Alex Johnson</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
            All
          </TabsTrigger>
          <TabsTrigger value="wins" className="data-[state=active]:bg-purple-600">
            Wins
          </TabsTrigger>
          <TabsTrigger value="losses" className="data-[state=active]:bg-purple-600">
            Losses
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600">
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">All Activity</CardTitle>
              <CardDescription className="text-gray-300">Your complete betting and transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <HistoryItem
                  type="bet-win"
                  title="Won bet against Chris Evans"
                  description="Call of Duty: Mobile • $20.00"
                  time="2 days ago"
                  opponent="Chris Evans"
                />
                <HistoryItem
                  type="deposit"
                  title="Added funds to wallet"
                  description="PayPal • $50.00"
                  time="3 days ago"
                />
                <HistoryItem
                  type="bet-loss"
                  title="Lost bet against James Wilson"
                  description="FIFA 24 • $10.00"
                  time="4 days ago"
                  opponent="James Wilson"
                />
                <HistoryItem
                  type="bet-win"
                  title="Won bet against Maria Garcia"
                  description="PUBG Mobile • $15.00"
                  time="1 week ago"
                  opponent="Maria Garcia"
                />
                <HistoryItem
                  type="withdrawal"
                  title="Withdrew funds"
                  description="EcoCash • $100.00"
                  time="2 weeks ago"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wins" className="mt-6">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Wins</CardTitle>
              <CardDescription className="text-gray-300">Your winning bets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <HistoryItem
                  type="bet-win"
                  title="Won bet against Chris Evans"
                  description="Call of Duty: Mobile • $20.00"
                  time="2 days ago"
                  opponent="Chris Evans"
                />
                <HistoryItem
                  type="bet-win"
                  title="Won bet against Maria Garcia"
                  description="PUBG Mobile • $15.00"
                  time="1 week ago"
                  opponent="Maria Garcia"
                />
                <HistoryItem
                  type="bet-win"
                  title="Won bet against Alex Johnson"
                  description="Fortnite • $75.00"
                  time="3 weeks ago"
                  opponent="Alex Johnson"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="losses" className="mt-6">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Losses</CardTitle>
              <CardDescription className="text-gray-300">Your lost bets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <HistoryItem
                  type="bet-loss"
                  title="Lost bet against James Wilson"
                  description="FIFA 24 • $10.00"
                  time="4 days ago"
                  opponent="James Wilson"
                />
                <HistoryItem
                  type="bet-loss"
                  title="Lost bet against Sarah Williams"
                  description="Call of Duty: Mobile • $25.00"
                  time="3 weeks ago"
                  opponent="Sarah Williams"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Transactions</CardTitle>
              <CardDescription className="text-gray-300">Your deposits and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <HistoryItem
                  type="deposit"
                  title="Added funds to wallet"
                  description="PayPal • $50.00"
                  time="3 days ago"
                />
                <HistoryItem
                  type="withdrawal"
                  title="Withdrew funds"
                  description="EcoCash • $100.00"
                  time="2 weeks ago"
                />
                <HistoryItem
                  type="deposit"
                  title="Added funds to wallet"
                  description="EcoCash • $75.00"
                  time="3 weeks ago"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function HistoryItem({
  type,
  title,
  description,
  time,
  opponent,
}: {
  type: "bet-win" | "bet-loss" | "deposit" | "withdrawal"
  title: string
  description: string
  time: string
  opponent?: string
}) {
  const icons = {
    "bet-win": <Trophy className="h-5 w-5 text-yellow-500" />,
    "bet-loss": <Trophy className="h-5 w-5 text-gray-500" />,
    deposit: <ArrowDown className="h-5 w-5 text-green-500" />,
    withdrawal: <ArrowUp className="h-5 w-5 text-red-500" />,
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/50">{icons[type]}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-white">{title}</p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      {opponent && (
        <Avatar className="h-8 w-8 border border-gray-700">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt={opponent} />
          <AvatarFallback className="bg-purple-600 text-white">
            {opponent
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
