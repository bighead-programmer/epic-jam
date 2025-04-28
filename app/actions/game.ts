"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { gameService } from "@/lib/services/game-service"
import { prisma } from "@/lib/prisma"

export async function getGames() {
  try {
    const games = await gameService.getGames()

    return { success: true, games }
  } catch (error: any) {
    console.error("Get games error:", error)
    return { error: error.message || "Failed to get games" }
  }
}

export async function getOpenSourceGames() {
  try {
    const games = await gameService.getOpenSourceGames()

    return { success: true, games }
  } catch (error: any) {
    console.error("Get open source games error:", error)
    return { error: error.message || "Failed to get open source games" }
  }
}

export async function getUserGameAccounts() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const accounts = await gameService.getUserGameAccounts(session.user.id)

    return { success: true, accounts }
  } catch (error: any) {
    console.error("Get user game accounts error:", error)
    return { error: error.message || "Failed to get game accounts" }
  }
}

export async function linkGameAccount(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const gameId = formData.get("gameId") as string
    const username = formData.get("username") as string
    const apiToken = formData.get("apiToken") as string | undefined

    if (!gameId || !username) {
      return { error: "Invalid input" }
    }

    const account = await gameService.linkGameAccount(session.user.id, gameId, username, apiToken)

    revalidatePath("/dashboard/games")
    return { success: true, account }
  } catch (error: any) {
    console.error("Link game account error:", error)
    return { error: error.message || "Failed to link game account" }
  }
}

export async function connectToOpenArena(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const username = formData.get("username") as string
    const password = formData.get("password") as string

    if (!username || !password) {
      return { error: "Invalid input" }
    }

    const result = await gameService.connectToOpenArena(username, password)

    // Find or create the OpenArena game in our database
    let game = await prisma.game.findFirst({
      where: { name: "OpenArena" },
    })

    if (!game) {
      game = await prisma.game.create({
        data: {
          name: "OpenArena",
          platform: "PC",
          apiEndpoint: "https://api.openarena.org",
          isActive: true,
        },
      })
    }

    // Link the account
    await gameService.linkGameAccount(session.user.id, game.id, username, result.apiToken)

    revalidatePath("/dashboard/games")
    return { success: true }
  } catch (error: any) {
    console.error("Connect to OpenArena error:", error)
    return { error: error.message || "Failed to connect to OpenArena" }
  }
}
