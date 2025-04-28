import { PaymentMethod, TransactionStatus, TransactionType } from "@prisma/client"

import prisma from "@/lib/prisma"
import { ecocashService } from "@/lib/services/payment/ecocash-service"
import { paypalService } from "@/lib/services/payment/paypal-service"

export interface PaymentDetails {
  amount: number
  currency?: string
  description?: string
  metadata?: Record<string, any>
  [key: string]: any
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  externalId?: string
  status: TransactionStatus
  error?: string
}

export const paymentService = {
  async processPayment(
    userId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDetails: Record<string, any>,
  ): Promise<PaymentResult> {
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
      try {
        let paymentResult: { success: boolean; externalId: string; reference: string }

        if (paymentMethod === PaymentMethod.ECOCASH) {
          if (!paymentDetails.phoneNumber) {
            throw new Error("Phone number is required for EcoCash payments")
          }

          paymentResult = await ecocashService.processPayment({
            amount,
            phoneNumber: paymentDetails.phoneNumber,
            reference: transaction.id,
          })
        } else if (paymentMethod === PaymentMethod.PAYPAL) {
          if (!paymentDetails.email) {
            throw new Error("Email is required for PayPal payments")
          }

          paymentResult = await paypalService.processPayment({
            amount,
            email: paymentDetails.email,
            reference: transaction.id,
          })
        } else {
          throw new Error("Unsupported payment method")
        }

        if (!paymentResult.success) {
          throw new Error("Payment processing failed")
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

        return {
          success: true,
          transactionId: transaction.id,
          externalId: paymentResult.externalId,
          status: TransactionStatus.COMPLETED,
        }
      } catch (error: any) {
        // Mark transaction as failed
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: TransactionStatus.FAILED,
          },
        })

        return {
          success: false,
          transactionId: transaction.id,
          status: TransactionStatus.FAILED,
          error: error.message,
        }
      }
    })
  },

  async processWithdrawal(
    userId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDetails: Record<string, any>,
  ): Promise<PaymentResult> {
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
      try {
        let withdrawalResult: { success: boolean; externalId: string; reference: string }

        if (paymentMethod === PaymentMethod.ECOCASH) {
          if (!paymentDetails.phoneNumber) {
            throw new Error("Phone number is required for EcoCash withdrawals")
          }

          withdrawalResult = await ecocashService.processWithdrawal({
            amount,
            phoneNumber: paymentDetails.phoneNumber,
            reference: transaction.id,
          })
        } else if (paymentMethod === PaymentMethod.PAYPAL) {
          if (!paymentDetails.email) {
            throw new Error("Email is required for PayPal withdrawals")
          }

          withdrawalResult = await paypalService.processWithdrawal({
            amount,
            email: paymentDetails.email,
            reference: transaction.id,
          })
        } else {
          throw new Error("Unsupported payment method")
        }

        if (!withdrawalResult.success) {
          throw new Error("Withdrawal processing failed")
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

        return {
          success: true,
          transactionId: transaction.id,
          externalId: withdrawalResult.externalId,
          status: TransactionStatus.COMPLETED,
        }
      } catch (error: any) {
        // Mark transaction as failed
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: TransactionStatus.FAILED,
          },
        })

        return {
          success: false,
          transactionId: transaction.id,
          status: TransactionStatus.FAILED,
          error: error.message,
        }
      }
    })
  },
}
