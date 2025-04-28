import axios from "axios"
import { BetResult } from "@prisma/client"

import prisma from "@/lib/prisma"

// Interface for game result data
interface GameResultData {
  matchId: string
  player1: string
  player2: string
  winner: string | null
  score: {
    player1: number
    player2: number
  }
  timestamp: string
  gameDetails: Record<string, any>
}

export const gameApi = {
  // Verify game result using the game's API
  async verifyGameResult(
    gameId: string,
    player1Id: string,
    player2Id: string,
  ): Promise<{
    verified: boolean
    result?: BetResult
    matchData?: GameResultData
  }> {
    try {
      // Get game information
      const game = await prisma.game.findUnique({
        where: { id: gameId },
      })

      if (!game || !game.apiEndpoint) {
        console.log("Game API not available")
        return { verified: false }
      }

      // Get player game accounts
      const player1Account = await prisma.gameAccount.findUnique({
        where: {
          userId_gameId: {
            userId: player1Id,
            gameId,
          },
        },
      })

      const player2Account = await prisma.gameAccount.findUnique({
        where: {
          userId_gameId: {
            userId: player2Id,
            gameId,
          },
        },
      })

      if (!player1Account || !player2Account) {
        console.log("Player game accounts not found")
        return { verified: false }
      }

      // Call game API to get recent matches
      const response = await axios.get(`${game.apiEndpoint}/matches`, {
        params: {
          player1: player1Account.username,
          player2: player2Account.username,
          limit: 1,
        },
        headers: {
          Authorization: `Bearer ${game.apiKey || "demo-api-key"}`,
        },
      })

      // Check if there's a recent match between these players
      if (!response.data.matches || response.data.matches.length === 0) {
        console.log("No recent matches found")
        return { verified: false }
      }

      const match = response.data.matches[0] as GameResultData

      // Verify the match is recent (within last hour)
      const matchTime = new Date(match.timestamp).getTime()
      const currentTime = new Date().getTime()
      const oneHour = 60 * 60 * 1000

      if (currentTime - matchTime > oneHour) {
        console.log("Match is too old")
        return { verified: false }
      }

      // Determine result
      let result: BetResult | undefined

      if (match.winner === player1Account.username) {
        result = BetResult.CREATOR_WON
      } else if (match.winner === player2Account.username) {
        result = BetResult.OPPONENT_WON
      } else if (match.score.player1 === match.score.player2) {
        result = BetResult.DRAW
      } else {
        return { verified: false }
      }

      return {
        verified: true,
        result,
        matchData: match,
      }
    } catch (error) {
      console.error("Game API error:", error)
      return { verified: false }
    }
  },

  // Connect to specific game APIs
  async connectToGame(
    gameId: string,
    username: string,
    apiToken: string,
  ): Promise<{
    success: boolean
    apiToken?: string
    error?: string
  }> {
    try {
      const game = await prisma.game.findUnique({
        where: { id: gameId },
      })

      if (!game || !game.apiEndpoint) {
        return { success: false, error: "Game not found or API not available" }
      }

      // Verify credentials with game API
      const response = await axios.post(
        `${game.apiEndpoint}/auth/verify`,
        {
          username,
          apiToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.data.success) {
        return { success: false, error: "Invalid credentials" }
      }

      return {
        success: true,
        apiToken: response.data.apiToken || apiToken,
      }
    } catch (error) {
      console.error("Game connection error:", error)
      return { success: false, error: "Failed to connect to game" }
    }
  },

  // Get recent matches for a player
  async getPlayerMatches(gameId: string, userId: string, limit = 10): Promise<GameResultData[]> {
    try {
      const game = await prisma.game.findUnique({
        where: { id: gameId },
      })

      if (!game || !game.apiEndpoint) {
        return []
      }

      const gameAccount = await prisma.gameAccount.findUnique({
        where: {
          userId_gameId: {
            userId,
            gameId,
          },
        },
      })

      if (!gameAccount) {
        return []
      }

      const response = await axios.get(`${game.apiEndpoint}/matches`, {
        params: {
          player: gameAccount.username,
          limit,
        },
        headers: {
          Authorization: `Bearer ${game.apiKey || gameAccount.apiToken || "demo-api-key"}`,
        },
      })

      return response.data.matches || []
    } catch (error) {
      console.error("Get player matches error:", error)
      return []
    }
  },

  // Webhook handler for game events
  async handleGameWebhook(payload: any): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      // Validate webhook signature
      // This would be implemented based on the game API's webhook signature format

      // Process match result
      if (payload.event === "match_completed") {
        const matchData = payload.data as GameResultData

        // Find bet associated with this match
        // This would require storing matchId in the bet when it's created
        const bet = await prisma.bet.findFirst({
          where: {
            OR: [
              {
                creator: {
                  gameAccounts: {
                    some: {
                      username: matchData.player1,
                    },
                  },
                },
                opponent: {
                  gameAccounts: {
                    some: {
                      username: matchData.player2,
                    },
                  },
                },
              },
              {
                creator: {
                  gameAccounts: {
                    some: {
                      username: matchData.player2,
                    },
                  },
                },
                opponent: {
                  gameAccounts: {
                    some: {
                      username: matchData.player1,
                    },
                  },
                },
              },
            ],
            status: "ACCEPTED",
          },
          include: {
            creator: {
              include: {
                gameAccounts: true,
              },
            },
            opponent: {
              include: {
                gameAccounts: true,
              },
            },
          },
        })

        if (!bet) {
          return { success: false, error: "No matching bet found" }
        }

        // Determine result
        let result: BetResult

        const creatorUsername = bet.creator.gameAccounts.find(
          (account) => account.username === matchData.player1 || account.username === matchData.player2,
        )?.username

        const opponentUsername = bet.opponent.gameAccounts.find(
          (account) => account.username === matchData.player1 || account.username === matchData.player2,
        )?.username

        if (!creatorUsername || !opponentUsername) {
          return { success: false, error: "Could not determine player usernames" }
        }

        if (matchData.winner === creatorUsername) {
          result = BetResult.CREATOR_WON
        } else if (matchData.winner === opponentUsername) {
          result = BetResult.OPPONENT_WON
        } else {
          result = BetResult.DRAW
        }

        // Update bet with result
        await prisma.bet.update({
          where: { id: bet.id },
          data: {
            status: "COMPLETED",
            result,
          },
        })

        // Process bet result (distribute funds)
        // This would call the bet service to process the result

        return { success: true }
      }

      return { success: true }
    } catch (error) {
      console.error("Game webhook error:", error)
      return { success: false, error: "Failed to process game webhook" }
    }
  },
}
