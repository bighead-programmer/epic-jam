"use server"

import type { PaymentMethod } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

import prisma from "@/lib/prisma"
import { paymentService } from "@/lib/services/payment/payment-service"

export async function getUserWallet() {
  try {
    const supabase = createServerActionClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    })

    if (!wallet) {
      // Create wallet if it doesn't exist
      const newWallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      })
      
      return { success: true, wallet: newWallet }
    }

    return { success: true, wallet }
  } catch (error: any) {
    console.error("Get wallet error:", error)
    return { error: error.message || "Failed to get wallet" }
  }
}

export async function addFunds(formData: FormData) {
  try {
    const supabase = createServerActionClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const amount = Number.parseFloat(formData.get("amount") as string)
    const paymentMethod = formData.get("paymentMethod") as PaymentMethod

    if (isNaN(amount) || amount <= 0 || !paymentMethod) {
      return { error: "Invalid input" }
    }

    const paymentDetails: Record<string, any> = {}

    if (paymentMethod === "ECOCASH") {
      const phoneNumber = formData.get("phoneNumber") as string

      if (!phoneNumber) {
        return { error: "Phone number is required" }
      }

      paymentDetails.phoneNumber = phoneNumber
    } else if (paymentMethod === "PAYPAL") {
      const email = formData.get("email") as string

      if (!email) {
        return { error: "Email is required" }
      }

      paymentDetails.email = email
    }

    const result = await paymentService.processPayment(user.id, amount, paymentMethod, paymentDetails)

    if (!result.success) {
      return { error: result.error || "Payment failed" }
    }

    revalidatePath("/dashboard/wallet")
    return { success: true, transactionId: result.transactionId }
  } catch (error: any) {
    console.error("Add funds error:", error)
    return { error: error.message || "Failed to add funds" }
  }
}

export async function withdrawFunds(formData: FormData) {
  try {
    const supabase = createServerActionClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const amount = Number.parseFloat(formData.get("amount") as string)
    const paymentMethod = formData.get("paymentMethod") as PaymentMethod

    if (isNaN(amount) || amount <= 0 || !paymentMethod) {
      return { error: "Invalid input" }
    }

    const paymentDetails: Record<string, any> = {}

    if (paymentMethod === "ECOCASH") {
      const phoneNumber = formData.get("phoneNumber") as string

      if (!phoneNumber) {
        return { error: "Phone number is required" }
      }

      paymentDetails.phoneNumber = phoneNumber
    } else if (paymentMethod === "PAYPAL") {
      const email = formData.get("email") as string

      if (!email) {
        return { error: "Email is required" }
      }

      paymentDetails.email = email
    }

    const result = await paymentService.processWithdrawal(user.id, amount, paymentMethod, paymentDetails)

    if (!result.success) {
      return { error: result.error || "Withdrawal failed" }
    }

    revalidatePath("/dashboard/wallet")
    return { success: true, transactionId: result.transactionId }
  } catch (error: any) {
    console.error("Withdraw funds error:", error)
    return { error: error.message || "Failed to withdraw funds" }
  }
}

export async function getTransactionHistory() {
  try {
    const supabase = createServerActionClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, transactions }
  } catch (error: any) {
    console.error("Get transaction history error:", error)
    return { error: error.message || "Failed to get transaction history" }
  }
}
