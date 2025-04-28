import { PaymentMethod, TransactionStatus, TransactionType } from "@prisma/client"

import prisma from "@/lib/prisma"
import { ecocashService } from "@/lib/services/payment/ecocash-service"
import { paypalService } from "@/lib/services/payment/paypal-service"

export const walletService = {
  async getUserWallet(userId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet) {
      throw new Error("Wallet not found")
    }

    return wallet
  },

  async addFunds(
    userId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDetails: { [key: string]: string },
  ) {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Get user wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      })

      if (!wallet) {
        throw new Error("Wallet not found")
      }

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          amount,
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.PENDING,
          paymentMethod,
        },
      })

      // Process payment based on method
      let paymentResult
      try {
        if (paymentMethod === PaymentMethod.ECOCASH) {
          paymentResult = await ecocashService.processPayment({
            amount,
            phoneNumber: paymentDetails.phoneNumber,
            reference: transaction.id,
          })
        } else if (paymentMethod === PaymentMethod.PAYPAL) {
          paymentResult = await paypalService.processPayment({
            amount,
            email: paymentDetails.email,
            reference: transaction.id,
          })
        } else {
          throw new Error("Unsupported payment method")
        }

        // Update transaction with external reference
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: TransactionStatus.COMPLETED,
            externalId: paymentResult.externalId,
            reference: paymentResult.reference,
          },
        })

        // Update wallet balance
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { increment: amount },
          },
        })

        return { success: true, transaction }
      } catch (error) {
        // Mark transaction as failed
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: TransactionStatus.FAILED,
          },
        })

        throw error
      }
    })
  },

  async withdrawFunds(
    userId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDetails: { [key: string]: string },
  ) {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Get user wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      })

      if (!wallet) {
        throw new Error("Wallet not found")
      }

      // Check if user has enough balance
      if (wallet.balance < amount) {
        throw new Error("Insufficient balance")
      }

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          amount: -amount, // Negative amount for withdrawal
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.PENDING,
          paymentMethod,
        },
      })

      // Process withdrawal based on method
      let withdrawalResult
      try {
        if (paymentMethod === PaymentMethod.ECOCASH) {
          withdrawalResult = await ecocashService.processWithdrawal({
            amount,
            phoneNumber: paymentDetails.phoneNumber,
            reference: transaction.id,
          })
        } else if (paymentMethod === PaymentMethod.PAYPAL) {
          withdrawalResult = await paypalService.processWithdrawal({
            amount,
            email: paymentDetails.email,
            reference: transaction.id,
          })
        } else {
          throw new Error("Unsupported payment method")
        }

        // Update transaction with external reference
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: TransactionStatus.COMPLETED,
            externalId: withdrawalResult.externalId,
            reference: withdrawalResult.reference,
          },
        })

        // Update wallet balance
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { decrement: amount },
          },
        })

        return { success: true, transaction }
      } catch (error) {
        // Mark transaction as failed
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: TransactionStatus.FAILED,
          },
        })

        throw error
      }
    })
  },

  async getTransactionHistory(userId: string) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  },
}
