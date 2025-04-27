"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Plus, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WalletPage() {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("ecocash")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Wallet</h1>
        <p className="text-gray-300">Manage your funds and payment methods</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">$120.50</span>
              <span className="text-sm text-green-500">+$25.00 this week</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Funds
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Pending Bets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">$50.00</span>
              <span className="text-sm text-yellow-500">3 active bets</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700">
              View Bets
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Total Winnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">$350.75</span>
              <span className="text-sm text-green-500">All time</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700">
              View History
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="add-funds" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="add-funds" className="data-[state=active]:bg-purple-600">
            Add Funds
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="data-[state=active]:bg-purple-600">
            Withdraw
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
            Transaction History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-funds" className="mt-6">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Add Funds to Your Wallet</CardTitle>
              <CardDescription className="text-gray-300">
                Choose your payment method and enter the amount
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border-gray-700 bg-gray-700/50 pl-8 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="ecocash" id="ecocash-add" className="peer sr-only" />
                    <Label
                      htmlFor="ecocash-add"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-800 p-4 hover:bg-gray-700 hover:text-white peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <span className="mb-1 text-lg font-bold">EcoCash</span>
                      <span className="text-xs text-gray-400">Mobile Money</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="paypal" id="paypal-add" className="peer sr-only" />
                    <Label
                      htmlFor="paypal-add"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-800 p-4 hover:bg-gray-700 hover:text-white peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <span className="mb-1 text-lg font-bold">PayPal</span>
                      <span className="text-xs text-gray-400">Online Payment</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "ecocash" && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-200">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+263 7X XXX XXXX"
                    className="border-gray-700 bg-gray-700/50 text-white placeholder:text-gray-400"
                  />
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">
                    PayPal Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="border-gray-700 bg-gray-700/50 text-white placeholder:text-gray-400"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!amount || Number.parseFloat(amount) <= 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Funds
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
              <div className="rounded-md border border-gray-700 bg-gray-700/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Available for withdrawal</span>
                  <span className="font-bold text-white">$120.50</span>
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
                    className="border-gray-700 bg-gray-700/50 pl-8 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">Withdrawal Method</Label>
                <RadioGroup defaultValue="ecocash" className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="ecocash" id="ecocash-withdraw" className="peer sr-only" />
                    <Label
                      htmlFor="ecocash-withdraw"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-800 p-4 hover:bg-gray-700 hover:text-white peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <span className="mb-1 text-lg font-bold">EcoCash</span>
                      <span className="text-xs text-gray-400">Mobile Money</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="paypal" id="paypal-withdraw" className="peer sr-only" />
                    <Label
                      htmlFor="paypal-withdraw"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-800 p-4 hover:bg-gray-700 hover:text-white peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <span className="mb-1 text-lg font-bold">PayPal</span>
                      <span className="text-xs text-gray-400">Online Payment</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-withdraw" className="text-gray-200">
                  Phone Number
                </Label>
                <Input
                  id="phone-withdraw"
                  type="tel"
                  placeholder="+263 7X XXX XXXX"
                  className="border-gray-700 bg-gray-700/50 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-500">
                <p className="text-sm">
                  Withdrawals are processed within 24 hours. A 2% processing fee applies to all withdrawals.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <ArrowUp className="mr-2 h-4 w-4" />
                Withdraw Funds
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
              <CardDescription className="text-gray-300">View all your past transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TransactionItem type="deposit" amount="$50.00" method="PayPal" date="Yesterday" status="completed" />
                <TransactionItem
                  type="bet-win"
                  amount="$20.00"
                  method="Call of Duty: Mobile vs Chris Evans"
                  date="2 days ago"
                  status="completed"
                />
                <TransactionItem
                  type="bet-loss"
                  amount="$10.00"
                  method="FIFA 24 vs James Wilson"
                  date="3 days ago"
                  status="completed"
                />
                <TransactionItem
                  type="withdrawal"
                  amount="$100.00"
                  method="EcoCash"
                  date="Last week"
                  status="completed"
                />
                <TransactionItem type="deposit" amount="$75.00" method="EcoCash" date="Last week" status="completed" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TransactionItem({
  type,
  amount,
  method,
  date,
  status,
}: {
  type: "deposit" | "withdrawal" | "bet-win" | "bet-loss"
  amount: string
  method: string
  date: string
  status: "pending" | "completed" | "failed"
}) {
  const icons = {
    deposit: <ArrowDown className="h-5 w-5 text-green-500" />,
    withdrawal: <ArrowUp className="h-5 w-5 text-red-500" />,
    "bet-win": <Trophy className="h-5 w-5 text-yellow-500" />,
    "bet-loss": <Trophy className="h-5 w-5 text-gray-500" />,
  }

  const titles = {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    "bet-win": "Bet Win",
    "bet-loss": "Bet Loss",
  }

  const amountColors = {
    deposit: "text-green-500",
    withdrawal: "text-red-500",
    "bet-win": "text-green-500",
    "bet-loss": "text-red-500",
  }

  const amountPrefix = {
    deposit: "+",
    withdrawal: "-",
    "bet-win": "+",
    "bet-loss": "-",
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/50">{icons[type]}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-white">{titles[type]}</p>
          <p className={`font-bold ${amountColors[type]}`}>
            {amountPrefix[type]}
            {amount}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">{method}</p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>
    </div>
  )
}
