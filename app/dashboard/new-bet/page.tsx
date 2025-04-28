"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronDown, GamepadIcon as GameController } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { useData, type Game, type Friend } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function NewBetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { games, friends, addBet } = useData()

  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [gameOpen, setGameOpen] = useState(false)
  const [friendOpen, setFriendOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [betAmount, setBetAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("wallet")

  // Check for gameId in URL params
  useEffect(() => {
    const gameId = searchParams.get("gameId")
    if (gameId) {
      const game = games.find((g) => g.id === gameId)
      if (game) {
        setSelectedGame(game)
      }
    }
  }, [searchParams, games])

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Submit form
      if (!selectedGame || !selectedFriend || !betAmount || !user) return

      const amount = Number.parseFloat(betAmount)

      // Create bet
      addBet({
        gameId: selectedGame.id,
        gameName: selectedGame.name,
        creatorId: user.id,
        opponentId: selectedFriend.id,
        opponentName: selectedFriend.name,
        amount,
        status: "pending",
      })

      // Navigate to my bets page
      router.push("/dashboard/my-bets")
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isNextDisabled = () => {
    if (step === 1) return !selectedGame || !selectedFriend
    if (step === 2) return !betAmount || Number.parseFloat(betAmount) <= 0
    return false
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-white">Create a New Bet</h1>

      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">New Bet</CardTitle>
          <CardDescription className="text-gray-300">Challenge a friend to a game and set your bet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="mb-4 flex justify-between">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      step >= i ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {i}
                  </div>
                  {i < 3 && <div className={`h-1 w-16 ${step > i ? "bg-purple-600" : "bg-gray-700"}`} />}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="game" className="text-gray-200">
                  Select Game
                </Label>
                <Popover open={gameOpen} onOpenChange={setGameOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={gameOpen}
                      className="w-full justify-between border-gray-700 bg-gray-700/50 text-left text-white"
                    >
                      {selectedGame ? selectedGame.name : "Select a game..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full border-gray-700 bg-gray-800 p-0 text-gray-200">
                    <Command>
                      <CommandInput placeholder="Search games..." className="border-gray-700 bg-gray-800" />
                      <CommandList>
                        <CommandEmpty>No game found.</CommandEmpty>
                        <CommandGroup>
                          {games.map((game) => (
                            <CommandItem
                              key={game.id}
                              value={game.id}
                              onSelect={() => {
                                setSelectedGame(game)
                                setGameOpen(false)
                              }}
                              className="hover:bg-gray-700 hover:text-white"
                            >
                              <GameController className="mr-2 h-4 w-4 text-purple-500" />
                              <span>{game.name}</span>
                              <span className="ml-auto text-xs text-gray-400">{game.platform}</span>
                              {selectedGame?.id === game.id && <Check className="ml-2 h-4 w-4 text-purple-500" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="opponent" className="text-gray-200">
                  Select Opponent
                </Label>
                <Popover open={friendOpen} onOpenChange={setFriendOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={friendOpen}
                      className="w-full justify-between border-gray-700 bg-gray-700/50 text-left text-white"
                    >
                      {selectedFriend ? selectedFriend.name : "Select a friend..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full border-gray-700 bg-gray-800 p-0 text-gray-200">
                    <Command>
                      <CommandInput placeholder="Search friends..." className="border-gray-700 bg-gray-800" />
                      <CommandList>
                        <CommandEmpty>No friend found.</CommandEmpty>
                        <CommandGroup>
                          {friends.map((friend) => (
                            <CommandItem
                              key={friend.id}
                              value={friend.id}
                              onSelect={() => {
                                setSelectedFriend(friend)
                                setFriendOpen(false)
                              }}
                              className="hover:bg-gray-700 hover:text-white"
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs text-white">
                                  {friend.name.charAt(0)}
                                </div>
                                <span>{friend.name}</span>
                              </div>
                              <span
                                className={`ml-auto text-xs ${friend.status === "online" ? "text-green-500" : "text-gray-400"}`}
                              >
                                {friend.status}
                              </span>
                              {selectedFriend?.id === friend.id && <Check className="ml-2 h-4 w-4 text-purple-500" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-200">
                  Bet Amount
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-400">$</span>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="border-gray-700 bg-gray-700/50 pl-8 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-4">
                  <div>
                    <RadioGroupItem value="wallet" id="wallet" className="peer sr-only" />
                    <Label
                      htmlFor="wallet"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-800 p-4 hover:bg-gray-700 hover:text-white peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <span className="mb-1 text-lg font-bold">Wallet</span>
                      <span className="text-xs text-gray-400">Current Balance: ${user?.balance.toFixed(2)}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-medium text-white">Bet Summary</h3>
                <div className="rounded-md border border-gray-700 bg-gray-800/50 p-4">
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Game</p>
                      <p className="font-medium text-white">{selectedGame ? selectedGame.name : "Not selected"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Opponent</p>
                      <p className="font-medium text-white">{selectedFriend ? selectedFriend.name : "Not selected"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Bet Amount</p>
                      <p className="font-medium text-white">${betAmount || "0.00"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Payment Method</p>
                      <p className="font-medium text-white">Wallet</p>
                    </div>
                  </div>
                  <Separator className="my-4 bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Service Fee (5%)</p>
                    <p className="font-medium text-white">
                      ${betAmount ? (Number.parseFloat(betAmount) * 0.05).toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-200">Total</p>
                    <p className="text-lg font-bold text-white">
                      ${betAmount ? (Number.parseFloat(betAmount) * 1.05).toFixed(2) : "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-500">
                <p className="text-sm">
                  By creating this bet, you agree to the Epic Jam Terms of Service and Betting Policy. The bet amount
                  will be held in escrow until the game results are verified.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={step === 1}
            className="border-gray-700 bg-gray-700/50 text-white hover:bg-gray-700"
          >
            Back
          </Button>
          <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700" disabled={isNextDisabled()}>
            {step === 3 ? "Create Bet" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
