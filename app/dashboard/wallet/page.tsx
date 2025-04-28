"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Plus } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { useData, type Transaction } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WalletPage() {
  const { user } = useAuth()
  const { transactions, addFunds, withdrawFunds } = useData()
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeposit = () => {
    setError(null)
    const amount = Number.parseFloat(depositAmount)

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsDepositing(true)

    // Simulate API call
    setTimeout(() => {
      addFunds(amount)
      setDepositAmount("")
      setIsDepositing(false)
    }, 1000)
  }

  const handleWithdraw = () => {
    setError(null)
    const amount = Number.parseFloat(withdrawAmount)

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (user && amount > user.balance) {
      setError("Insufficient balance")
      return
    }

    setIsWithdrawing(true)

    // Simulate API call
    setTimeout(() => {
      withdrawFunds(amount)
      setWithdrawAmount("")
      setIsWithdrawing(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="text-gray-300">Manage your funds and payment methods</p>
      </div>

      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">Available Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">${user?.balance.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            onClick={() => setDepositAmount("10")}
            variant="outline"
            className="flex-1 border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
          >
            $10
          </Button>
          <Button
            onClick={() => setDepositAmount("25")}
            variant="outline"
            className="flex-1 border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
          >
            $25
          </Button>
          <Button
            onClick={() => setDepositAmount("50")}
            variant="outline"
            className="flex-1 border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
          >
            $50
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="add-funds" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="add-funds" className="data-[state=active]:bg-purple-600">
            Add Funds
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="data-[state=active]:bg-purple-600">
            Withdraw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-funds" className="mt-6">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Add Funds to Your Wallet</CardTitle>
              <CardDescription className="text-gray-300">Enter the amount you want to add</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="rounded-md bg-red-500/20 p-3 text-sm text-red-500">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-200">
                  Amount
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-400">$</span>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="border-gray-700 bg-gray-700/50 pl-8 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-500">
                <p className="text-sm">This is a demo app. In a real app, this would connect to a payment processor.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleDeposit}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isDepositing}
              >
                {isDepositing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Funds
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="mt-6">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Withdraw Funds</CardTitle>
              <CardDescription className="text-gray-300">
                Withdraw your winnings to your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="rounded-md bg-red-500/20 p-3 text-sm text-red-500">{error}</div>}
              <div className="rounded-md border border-gray-700 bg-gray-700/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Available for withdrawal</span>
                  <span className="font-bold text-white">${user?.balance.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-amount" className="text-gray-200">
                  Amount
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-400">$</span>
                  </div>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="border-gray-700 bg-gray-700/50 pl-8 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-500">
                <p className="text-sm">This is a demo app. In a real app, this would connect to a payment processor.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleWithdraw}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isWithdrawing}
              >
                {isWithdrawing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Withdraw Funds
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction History */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white">Transaction History</h2>
        <Card className="border-gray-700 bg-gray-800/50">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-700">
              {transactions.length > 0 ? (
                transactions.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} />)
              ) : (
                <div className="p-4 text-center text-gray-300">No transactions yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const icons = {
    deposit: <ArrowDown className="h-5 w-5 text-green-500" />,
    withdrawal: <ArrowUp className="h-5 w-5 text-red-500" />,
    bet_win: <Plus className="h-5 w-5 text-green-500" />,
    bet_loss: <ArrowUp className="h-5 w-5 text-red-500" />,
    refund: <ArrowDown className="h-5 w-5 text-blue-500" />,
  }

  const titles = {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    bet_win: "Bet Win",
    bet_loss: "Bet Loss",
    refund: "Refund",
  }

  const amountColors = {
    deposit: "text-green-500",
    withdrawal: "text-red-500",
    bet_win: "text-green-500",
    bet_loss: "text-red-500",
    refund: "text-blue-500",
  }

  const amountPrefix = {
    deposit: "+",
    withdrawal: "",
    bet_win: "+",
    bet_loss: "",
    refund: "",
  }

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/50">
        {icons[transaction.type]}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-white">{titles[transaction.type]}</p>
          <p className={`font-bold ${amountColors[transaction.type]}`}>
            {amountPrefix[transaction.type]}${Math.abs(transaction.amount).toFixed(2)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">{transaction.description}</p>
          <p className="text-xs text-gray-400">{formatDate(transaction.createdAt)}</p>
        </div>
      </div>
    </div>
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
