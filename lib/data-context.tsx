"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"

// Types
export type Game = {
  id: string
  name: string
  platform: string
}

export type Friend = {
  id: string
  name: string
  phoneNumber: string
  status: "online" | "offline"
  avatar?: string
}

export type Bet = {
  id: string
  gameId: string
  gameName: string
  creatorId: string
  opponentId: string
  opponentName: string
  amount: number
  status: "pending" | "accepted" | "completed" | "rejected"
  result?: "creator_won" | "opponent_won" | "draw"
  createdAt: string
}

export type Transaction = {
  id: string
  type: "deposit" | "withdrawal" | "bet_win" | "bet_loss" | "refund"
  amount: number
  description: string
  createdAt: string
}

type DataContextType = {
  games: Game[]
  friends: Friend[]
  bets: Bet[]
  transactions: Transaction[]
  addBet: (bet: Omit<Bet, "id" | "createdAt">) => void
  acceptBet: (betId: string) => void
  rejectBet: (betId: string) => void
  completeBet: (betId: string, result: "creator_won" | "opponent_won" | "draw") => void
  addFunds: (amount: number) => void
  withdrawFunds: (amount: number) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Sample data
const sampleGames: Game[] = [
  { id: "1", name: "Call of Duty: Mobile", platform: "Mobile" },
  { id: "2", name: "PUBG Mobile", platform: "Mobile" },
  { id: "3", name: "FIFA 24", platform: "Console" },
  { id: "4", name: "Fortnite", platform: "Cross-platform" },
  { id: "5", name: "Apex Legends", platform: "Cross-platform" },
]

const sampleFriends: Friend[] = [
  { id: "1", name: "Alex Johnson", phoneNumber: "+1234567890", status: "online" },
  { id: "2", name: "Sarah Williams", phoneNumber: "+1234567891", status: "online" },
  { id: "3", name: "Mike Thompson", phoneNumber: "+1234567892", status: "offline" },
  { id: "4", name: "Emily Davis", phoneNumber: "+1234567893", status: "online" },
  { id: "5", name: "Chris Evans", phoneNumber: "+1234567894", status: "offline" },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [games, setGames] = useState<Game[]>(sampleGames)
  const [friends, setFriends] = useState<Friend[]>(sampleFriends)
  const [bets, setBets] = useState<Bet[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Load data from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedBets = localStorage.getItem(`epicJam_bets_${user.id}`)
      const storedTransactions = localStorage.getItem(`epicJam_transactions_${user.id}`)

      if (storedBets) {
        setBets(JSON.parse(storedBets))
      }

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions))
      }
    }
  }, [user])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`epicJam_bets_${user.id}`, JSON.stringify(bets))
      localStorage.setItem(`epicJam_transactions_${user.id}`, JSON.stringify(transactions))
    }
  }, [user, bets, transactions])

  const addBet = (newBet: Omit<Bet, "id" | "createdAt">) => {
    if (!user) return

    const bet: Bet = {
      ...newBet,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
    }

    setBets((prev) => [bet, ...prev])
  }

  const acceptBet = (betId: string) => {
    if (!user) return

    setBets((prev) => prev.map((bet) => (bet.id === betId ? { ...bet, status: "accepted" } : bet)))
  }

  const rejectBet = (betId: string) => {
    if (!user) return

    setBets((prev) => prev.map((bet) => (bet.id === betId ? { ...bet, status: "rejected" } : bet)))
  }

  const completeBet = (betId: string, result: "creator_won" | "opponent_won" | "draw") => {
    if (!user) return

    setBets((prev) =>
      prev.map((bet) => {
        if (bet.id === betId) {
          // Update user balance based on bet result
          const isCreator = bet.creatorId === user.id
          const isWinner = (isCreator && result === "creator_won") || (!isCreator && result === "opponent_won")

          // Create transaction for bet result
          const transactionType = isWinner ? "bet_win" : result === "draw" ? "refund" : "bet_loss"
          const transactionAmount = isWinner ? bet.amount : result === "draw" ? 0 : -bet.amount

          const newTransaction: Transaction = {
            id: Math.random().toString(36).substring(2, 15),
            type: transactionType,
            amount: transactionAmount,
            description: `Bet on ${bet.gameName} with ${bet.opponentName}`,
            createdAt: new Date().toISOString(),
          }

          setTransactions((prev) => [newTransaction, ...prev])

          // Update user balance in localStorage
          if (user) {
            const updatedUser = {
              ...user,
              balance: user.balance + transactionAmount,
            }
            localStorage.setItem("epicJamUser", JSON.stringify(updatedUser))
          }

          return { ...bet, status: "completed", result }
        }
        return bet
      }),
    )
  }

  const addFunds = (amount: number) => {
    if (!user) return

    // Create transaction
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 15),
      type: "deposit",
      amount,
      description: "Added funds to wallet",
      createdAt: new Date().toISOString(),
    }

    setTransactions((prev) => [newTransaction, ...prev])

    // Update user balance in localStorage
    const updatedUser = {
      ...user,
      balance: user.balance + amount,
    }
    localStorage.setItem("epicJamUser", JSON.stringify(updatedUser))

    // Force a refresh by updating the auth context
    window.location.reload()
  }

  const withdrawFunds = (amount: number) => {
    if (!user || user.balance < amount) return

    // Create transaction
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 15),
      type: "withdrawal",
      amount: -amount,
      description: "Withdrew funds from wallet",
      createdAt: new Date().toISOString(),
    }

    setTransactions((prev) => [newTransaction, ...prev])

    // Update user balance in localStorage
    const updatedUser = {
      ...user,
      balance: user.balance - amount,
    }
    localStorage.setItem("epicJamUser", JSON.stringify(updatedUser))

    // Force a refresh by updating the auth context
    window.location.reload()
  }

  return (
    <DataContext.Provider
      value={{
        games,
        friends,
        bets,
        transactions,
        addBet,
        acceptBet,
        rejectBet,
        completeBet,
        addFunds,
        withdrawFunds,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
