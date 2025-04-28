import { BetResult, BetStatus, EscrowStatus, type PaymentMethod, ProofType } from "@prisma/client"

import prisma from "@/lib/prisma"
import { gameService } from "@/lib/services/game-service"

export const betService = {
  async createBet(creatorId: string, opponentId: string, gameId: string, amount: number, paymentMethod: PaymentMethod) {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Check if creator has enough balance
      const wallet = await tx.wallet.findUnique({
        where: { userId: creatorId },
      })

      if (!wallet || wallet.balance < amount) {
        throw new Error("Insufficient balance")
      }

      // Create bet
      const bet = await tx.bet.create({
        data: {
          creatorId,
          opponentId,
          gameId,
          amount,
          paymentMethod,
          status: BetStatus.PENDING,
        },
      })

      // Create escrow
      const escrow = await tx.escrow.create({
        data: {
          betId: bet.id,
          amount,
          status: EscrowStatus.PENDING,
        },
      })

      // Update bet with escrow ID
      await tx.bet.update({
        where: { id: bet.id },
        data: {
          escrowId: escrow.id,
        },
      })

      // Reserve funds in creator's wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount },
          pendingAmount: { increment: amount },
        },
      })

      return { bet, escrow }
    })
  },

  async acceptBet(betId: string, userId: string) {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Get bet
      const bet = await tx.bet.findUnique({
        where: { id: betId },
        include: { escrow: true },
      })

      if (!bet) {
        throw new Error("Bet not found")
      }

      // Check if user is the opponent
      if (bet.opponentId !== userId) {
        throw new Error("Unauthorized")
      }

      // Check if bet is pending
      if (bet.status !== BetStatus.PENDING) {
        throw new Error("Bet is not pending")
      }

      // Check if opponent has enough balance
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      })

      if (!wallet || wallet.balance < bet.amount) {
        throw new Error("Insufficient balance")
      }

      // Update bet status
      await tx.bet.update({
        where: { id: betId },
        data: {
          status: BetStatus.ACCEPTED,
        },
      })

      // Update escrow status
      await tx.escrow.update({
        where: { id: bet.escrowId! },
        data: {
          status: EscrowStatus.LOCKED,
        },
      })

      // Reserve funds in opponent's wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: bet.amount },
          pendingAmount: { increment: bet.amount },
        },
      })

      return { success: true }
    })
  },

  async rejectBet(betId: string, userId: string) {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Get bet
      const bet = await tx.bet.findUnique({
        where: { id: betId },
        include: { escrow: true },
      })

      if (!bet) {
        throw new Error("Bet not found")
      }

      // Check if user is the opponent
      if (bet.opponentId !== userId) {
        throw new Error("Unauthorized")
      }

      // Check if bet is pending
      if (bet.status !== BetStatus.PENDING) {
        throw new Error("Bet is not pending")
      }

      // Update bet status
      await tx.bet.update({
        where: { id: betId },
        data: {
          status: BetStatus.REJECTED,
        },
      })

      // Update escrow status
      await tx.escrow.update({
        where: { id: bet.escrowId! },
        data: {
          status: EscrowStatus.REFUNDED,
        },
      })

      // Return funds to creator's wallet
      const creatorWallet = await tx.wallet.findUnique({
        where: { userId: bet.creatorId },
      })

      if (creatorWallet) {
        await tx.wallet.update({
          where: { id: creatorWallet.id },
          data: {
            balance: { increment: bet.amount },
            pendingAmount: { decrement: bet.amount },
          },
        })
      }

      return { success: true }
    })
  },

  async submitResult(betId: string, userId: string, result: BetResult, proofUrl: string) {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Get bet
      const bet = await tx.bet.findUnique({
        where: { id: betId },
        include: { escrow: true },
      })

      if (!bet) {
        throw new Error("Bet not found")
      }

      // Check if user is part of the bet
      if (bet.creatorId !== userId && bet.opponentId !== userId) {
        throw new Error("Unauthorized")
      }

      // Check if bet is accepted
      if (bet.status !== BetStatus.ACCEPTED && bet.status !== BetStatus.IN_PROGRESS) {
        throw new Error("Bet is not in progress")
      }

      // Create proof
      await tx.betProof.create({
        data: {
          betId,
          userId,
          proofType: ProofType.SCREENSHOT,
          proofUrl,
        },
      })

      // Update bet status to in progress if it's not already
      if (bet.status === BetStatus.ACCEPTED) {
        await tx.bet.update({
          where: { id: betId },
          data: {
            status: BetStatus.IN_PROGRESS,
          },
        })
      }

      // Check if we can automatically verify the result
      const game = await tx.game.findUnique({
        where: { id: bet.gameId },
      })

      if (game && game.apiEndpoint) {
        try {
          // Try to verify the result using the game API
          const verificationResult = await gameService.verifyGameResult(game.id, bet.creatorId, bet.opponentId)

          if (verificationResult.verified) {
            // If the API can verify the result, use it
            await tx.bet.update({
              where: { id: betId },
              data: {
                status: BetStatus.COMPLETED,
                result: verificationResult.result,
              },
            })

            // Process the bet result
            await this.processBetResult(tx, bet, verificationResult.result)

            return { success: true, verified: true, result: verificationResult.result }
          }
        } catch (error) {
          console.error("Game API verification error:", error)
          // Continue with manual verification if API fails
        }
      }

      // If we can't verify automatically, wait for both parties to submit
      const proofs = await tx.betProof.findMany({
        where: { betId },
      })

      // If both parties have submitted proofs, we can complete the bet
      if (proofs.length >= 2) {
        // For now, trust the result submitted by the user
        await tx.bet.update({
          where: { id: betId },
          data: {
            status: BetStatus.COMPLETED,
            result,
          },
        })

        // Process the bet result
        await this.processBetResult(tx, bet, result)

        return { success: true, verified: false, result }
      }

      return { success: true, verified: false, pending: true }
    })
  },

  async processBetResult(tx: any, bet: any, result: BetResult) {
    // Get escrow
    const escrow = await tx.escrow.findUnique({
      where: { id: bet.escrowId! },
    })

    if (!escrow) {
      throw new Error("Escrow not found")
    }

    // Update escrow status
    await tx.escrow.update({
      where: { id: escrow.id },
      data: {
        status: EscrowStatus.RELEASED,
      },
    })

    // Get wallets
    const creatorWallet = await tx.wallet.findUnique({
      where: { userId: bet.creatorId },
    })

    const opponentWallet = await tx.wallet.findUnique({
      where: { userId: bet.opponentId },
    })

    if (!creatorWallet || !opponentWallet) {
      throw new Error("Wallet not found")
    }

    // Calculate total amount (bet amount * 2)
    const totalAmount = bet.amount * 2

    // Process result
    if (result === BetResult.CREATOR_WON) {
      // Creator wins, gets total amount
      await tx.wallet.update({
        where: { id: creatorWallet.id },
        data: {
          balance: { increment: totalAmount },
          pendingAmount: { decrement: bet.amount },
        },
      })

      await tx.wallet.update({
        where: { id: opponentWallet.id },
        data: {
          pendingAmount: { decrement: bet.amount },
        },
      })

      // Create transaction records
      await tx.transaction.create({
        data: {
          userId: bet.creatorId,
          walletId: creatorWallet.id,
          amount: totalAmount,
          type: "BET_WIN",
          status: "COMPLETED",
          paymentMethod: "WALLET",
          reference: `Bet win: ${bet.id}`,
        },
      })

      await tx.transaction.create({
        data: {
          userId: bet.opponentId,
          walletId: opponentWallet.id,
          amount: -bet.amount,
          type: "BET_LOSS",
          status: "COMPLETED",
          paymentMethod: "WALLET",
          reference: `Bet loss: ${bet.id}`,
        },
      })
    } else if (result === BetResult.OPPONENT_WON) {
      // Opponent wins, gets total amount
      await tx.wallet.update({
        where: { id: opponentWallet.id },
        data: {
          balance: { increment: totalAmount },
          pendingAmount: { decrement: bet.amount },
        },
      })

      await tx.wallet.update({
        where: { id: creatorWallet.id },
        data: {
          pendingAmount: { decrement: bet.amount },
        },
      })

      // Create transaction records
      await tx.transaction.create({
        data: {
          userId: bet.opponentId,
          walletId: opponentWallet.id,
          amount: totalAmount,
          type: "BET_WIN",
          status: "COMPLETED",
          paymentMethod: "WALLET",
          reference: `Bet win: ${bet.id}`,
        },
      })

      await tx.transaction.create({
        data: {
          userId: bet.creatorId,
          walletId: creatorWallet.id,
          amount: -bet.amount,
          type: "BET_LOSS",
          status: "COMPLETED",
          paymentMethod: "WALLET",
          reference: `Bet loss: ${bet.id}`,
        },
      })
    } else if (result === BetResult.DRAW) {
      // Draw, both get their money back
      await tx.wallet.update({
        where: { id: creatorWallet.id },
        data: {
          balance: { increment: bet.amount },
          pendingAmount: { decrement: bet.amount },
        },
      })

      await tx.wallet.update({
        where: { id: opponentWallet.id },
        data: {
          balance: { increment: bet.amount },
          pendingAmount: { decrement: bet.amount },
        },
      })

      // Create transaction records
      await tx.transaction.create({
        data: {
          userId: bet.creatorId,
          walletId: creatorWallet.id,
          amount: bet.amount,
          type: "REFUND",
          status: "COMPLETED",
          paymentMethod: "WALLET",
          reference: `Bet draw: ${bet.id}`,
        },
      })

      await tx.transaction.create({
        data: {
          userId: bet.opponentId,
          walletId: opponentWallet.id,
          amount: bet.amount,
          type: "REFUND",
          status: "COMPLETED",
          paymentMethod: "WALLET",
          reference: `Bet draw: ${bet.id}`,
        },
      })
    } else if (result === BetResult.CANCELLED) {
      // Cancelled, both get their money back
      await tx.wallet.update({
        where: { id: creatorWallet.id },
        data: {
          balance: { increment: bet.amount },
          pendingAmount: { decrement: bet.amount },
        },
      })

      await tx.wallet.update({
        where: { id: opponentWallet.id },
        data: {
          balance: { increment: bet.amount },
          pendingAmount: { decrement: bet.amount },
        },
      })

      // Create transaction records
      await tx.transaction.create({
        data: {
          userId: bet.creatorId,
          walletId: creatorWallet.id,
          amount: bet.amount,
          type: "REFUND",
          status: "COMPLETED",
          paymentMethod: "WALLET",
          reference: `Bet cancelled: ${bet.id}`,
        },
      })

      await tx.transaction.create({
        data: {
          userId: bet.opponentId,
          walletId: opponentWallet.id,
          amount: bet.amount,
          type: "REFUND",
          status: "COMPLETED",
          paymentMethod: "WALLET",
          reference: `Bet cancelled: ${bet.id}`,
        },
      })
    }
  },

  async getUserBets(userId: string, status?: BetStatus) {
    const where = {
      OR: [{ creatorId: userId }, { opponentId: userId }],
      ...(status ? { status } : {}),
    }

    return await prisma.bet.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        opponent: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        game: true,
        escrow: true,
      },
      orderBy: { createdAt: "desc" },
    })
  },

  async getBetById(betId: string) {
    return await prisma.bet.findUnique({
      where: { id: betId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        opponent: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        game: true,
        escrow: true,
        proofs: true,
      },
    })
  },
}
