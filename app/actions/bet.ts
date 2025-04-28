"use server"

import type { BetResult, BetStatus, PaymentMethod } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

import prisma from "@/lib/prisma"
import { betService } from "@/lib/services/bet-service"
import { gameApi } from "@/lib/services/game-integration/game-api"

export async function createBet(formData: FormData) {
  try {
    const supabase = createServerActionClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const gameId = formData.get("gameId") as string
    const opponentId = formData.get("opponentId") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const paymentMethod = formData.get("paymentMethod") as PaymentMethod

    if (!gameId || !opponentId || isNaN(amount) || amount <= 0 || !paymentMethod) {
      return { error: "Invalid input" }
    }

    const result = await betService.createBet(user.id, opponentId, gameId, amount, paymentMethod)

    revalidatePath("/dashboard/my-bets")
    return { success: true, bet: result.bet }
  } catch (error: any) {
    console.error("Create bet error:", error)
    return { error: error.message || "Failed to create bet" }
  }
}

export async function acceptBet(formData: FormData) {
  try {
    const supabase = createServerActionClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const betId = formData.get("betId") as string

    if (!betId) {
      return { error: "Invalid input" }
    }

    const result = await betService.acceptBet(betId, user.id)

    revalidatePath("/dashboard/my-bets")
    return { success: true }
  } catch (error: any) {
    console.error("Accept bet error:", error)
    return { error: error.message || "Failed to accept bet" }
  }
}

export async function rejectBet(formData: FormData) {
  try {
    const supabase = createServerActionClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const betId = formData.get("betId") as string

    if (!betId) {
      return { error: "Invalid input" }
    }

    const result = await betService.rejectBet(betId, user.id)

    revalidatePath("/dashboard/my-bets")
    return { success: true }
  } catch (error: any) {
    console.error("Reject bet error:", error)
    return { error: error.message || "Failed to reject bet" }
  }
}

export async function submitResult(formData: FormData) {
  try {
    const supabase = createServerActionClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const betId = formData.get("betId") as string
    const result = formData.get("result") as BetResult
    const proofUrl = formData.get("proofUrl") as string

    if (!betId || !result || !proofUrl) {
      return { error: "Invalid input" }
    }

    // Get the bet to check if we can verify automatically
    const bet = await prisma.bet.findUnique({
      where: { id: betId },
      include: { game: true },
    })

    if (!bet) {
      return { error: "Bet not found" }
    }

    // Try to verify automatically using game API
    if (bet.game.apiEndpoint) {
      try {
        const verificationResult = await gameApi.verifyGameResult(bet.gameId, bet.creatorId, bet.opponentId)

        if (verificationResult.verified && verificationResult.result) {
          // If verified automatically, use the verified result
          const submitResult = await betService.submitResult(betId, user.id, verificationResult.result, proofUrl)

          revalidatePath("/dashboard/my-bets")
          return {
            success: true,
            verified: true,
            result: verificationResult.result,
            ...submitResult,
          }
        }
      } catch (error) {
        console.error("Game API verification error:", error)
        // Continue with manual submission if automatic verification fails
      }
    }

    // If automatic verification failed or is not available, submit manually
    const submitResult = await betService.submitResult(betId, user.id, result, proofUrl)

    revalidatePath("/dashboard/my-bets")
    return { success: true, ...submitResult }
  } catch (error: any) {
    console.error("Submit result error:", error)
    return { error: error.message || "Failed to submit result" }
  }
}

export async function getUserBets(status?: BetStatus) {
  try {
    const supabase = createServerActionClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const bets = await betService.getUserBets(user.id, status)

    return { success: true, bets }
  } catch (error: any) {
    console.error("Get user bets error:", error)
    return { error: error.message || "Failed to get bets" }
  }
}

export async function getBetById(betId: string) {
  try {
    const supabase = createServerActionClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const bet = await betService.getBetById(betId)

    if (!bet) {
      return { error: "Bet not found" }
    }

    // Check if user is part of the bet
    if (bet.creatorId !== user.id && bet.opponentId !== user.id) {
      return { error: "Unauthorized" }
    }

    return { success: true, bet }
  } catch (error: any) {
    console.error("Get bet error:", error)
    return { error: error.message || "Failed to get bet" }
  }
}
