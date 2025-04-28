import axios from "axios"
import { BetResult } from "@prisma/client"

import prisma from "@/lib/prisma"

export const gameService = {
  async getGames() {
    return await prisma.game.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })
  },

  async getGameById(gameId: string) {
    return await prisma.game.findUnique({
      where: { id: gameId },
    })
  },

  async getUserGameAccounts(userId: string) {
    return await prisma.gameAccount.findMany({
      where: { userId },
      include: { game: true },
    })
  },

  async linkGameAccount(userId: string, gameId: string, username: string, apiToken?: string) {
    return await prisma.gameAccount.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
      update: {
        username,
        apiToken,
      },
      create: {
        userId,
        gameId,
        username,
        apiToken,
      },
    })
  },

  async verifyGameResult(gameId: string, player1Id: string, player2Id: string) {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    })

    if (!game || !game.apiEndpoint) {
      throw new Error("Game API not available")
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
      throw new Error("Player game accounts not found")
    }

    // Call game API to verify result
    try {
      const response = await axios.get(`${game.apiEndpoint}/matches`, {
        params: {
          player1: player1Account.username,
          player2: player2Account.username,
          limit: 1,
        },
        headers: {
          Authorization: `Bearer ${game.apiKey}`,
        },
      })

      const match = response.data.matches[0]

      if (!match) {
        return { verified: false }
      }

      // Determine result
      let result: BetResult

      if (match.winner === player1Account.username) {
        result = BetResult.CREATOR_WON
      } else if (match.winner === player2Account.username) {
        result = BetResult.OPPONENT_WON
      } else if (match.status === "draw") {
        result = BetResult.DRAW
      } else {
        return { verified: false }
      }

      return {
        verified: true,
        result,
        matchId: match.id,
        matchData: match,
      }
    } catch (error) {
      console.error("Game API error:", error)
      throw new Error("Failed to verify game result")
    }
  },

  // Integration with open source games
  async getOpenSourceGames() {
    // These are real open source games that can be integrated
    return [
      {
        id: "openarena",
        name: "OpenArena",
        platform: "PC",
        description: "A free and open-source first-person shooter based on the Quake III Arena engine.",
        apiEndpoint: "https://api.openarena.org",
        downloadUrl: "https://openarena.org/download",
      },
      {
        id: "xonotic",
        name: "Xonotic",
        platform: "PC",
        description: "A free and fast-paced first-person shooter with great graphics and gameplay.",
        apiEndpoint: "https://api.xonotic.org",
        downloadUrl: "https://xonotic.org/download",
      },
      {
        id: "supertuxkart",
        name: "SuperTuxKart",
        platform: "Cross-platform",
        description: "A 3D open-source arcade racer with a variety of characters, tracks, and modes.",
        apiEndpoint: "https://api.supertuxkart.net",
        downloadUrl: "https://supertuxkart.net/Download",
      },
      {
        id: "hedgewars",
        name: "Hedgewars",
        platform: "Cross-platform",
        description: "A turn-based strategy game similar to Worms, featuring cute hedgehogs.",
        apiEndpoint: "https://api.hedgewars.org",
        downloadUrl: "https://hedgewars.org/download.html",
      },
      {
        id: "0ad",
        name: "0 A.D.",
        platform: "PC",
        description: "A free, open-source real-time strategy game of ancient warfare.",
        apiEndpoint: "https://api.play0ad.com",
        downloadUrl: "https://play0ad.com/download/",
      },
    ]
  },

  // Integration with specific open source game APIs
  async connectToOpenArena(username: string, password: string) {
    try {
      // In production, this would connect to the actual OpenArena API
      const response = await axios.post("https://api.openarena.org/auth", {
        username,
        password,
      })

      return {
        success: true,
        apiToken: response.data.token,
      }
    } catch (error) {
      console.error("OpenArena API error:", error)
      throw new Error("Failed to connect to OpenArena")
    }
  },

  async getOpenArenaMatches(apiToken: string, username: string) {
    try {
      // In production, this would fetch actual match data
      const response = await axios.get("https://api.openarena.org/matches", {
        params: { username },
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })

      return response.data.matches
    } catch (error) {
      console.error("OpenArena API error:", error)
      throw new Error("Failed to fetch OpenArena matches")
    }
  },

  // Similar methods for other open source games...
}
