import axios from "axios"

interface PayPalPaymentParams {
  amount: number
  email: string
  reference: string
}

export const paypalService = {
  async processPayment({ amount, email, reference }: PayPalPaymentParams) {
    try {
      // In production, this would be a real API call to PayPal
      const response = await axios.post(
        process.env.PAYPAL_API_URL || "https://api.sandbox.paypal.com/v2/checkout/orders",
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: amount.toString(),
              },
              reference_id: reference,
            },
          ],
          payer: {
            email_address: email,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      )

      // Check if the payment was successful
      if (response.data.status !== "CREATED" && response.data.status !== "APPROVED") {
        throw new Error("PayPal payment failed")
      }

      return {
        success: true,
        externalId: response.data.id || `PP-${Date.now()}`,
        reference: reference,
      }
    } catch (error) {
      console.error("PayPal payment error:", error)
      throw new Error("Failed to process PayPal payment")
    }
  },

  async processWithdrawal({ amount, email, reference }: PayPalPaymentParams) {
    try {
      // In production, this would be a real API call to PayPal
      const response = await axios.post(
        process.env.PAYPAL_API_URL || "https://api.sandbox.paypal.com/v2/payments/payouts",
        {
          sender_batch_header: {
            sender_batch_id: `PAYOUT-${Date.now()}`,
            email_subject: "You have a payout from Epic Jam",
          },
          items: [
            {
              recipient_type: "EMAIL",
              amount: {
                value: amount.toString(),
                currency: "USD",
              },
              note: "Thanks for using Epic Jam!",
              receiver: email,
              sender_item_id: reference,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      )

      // Check if the withdrawal was successful
      if (response.data.batch_header.batch_status !== "PENDING" && response.data.batch_header.batch_status !== "SUCCESS") {
        throw new Error("PayPal withdrawal failed")
      }

      return {
        success: true,
        externalId: response.data.batch_header.payout_batch_id || `PP-WD-${Date.now()}`,
        reference: reference,
      }
    } catch (error) {
      console.error("PayPal withdrawal error:", error)
      throw new Error("Failed to process PayPal withdrawal")
    }
  },

  async checkPaymentStatus(externalId: string) {
    try {
      // In production, this would be a real API call to PayPal
      const response = await axios.get(
        `${process.env.PAYPAL_API_URL || "https://api.sandbox.paypal.com/v2/checkout/orders"}/${externalId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
          },
        }
      )

      return {
        status: response.data.status || "COMPLETED",
        externalId,
      }
    } catch (error) {
      console.error("PayPal status check error:", error)
      throw new Error("Failed to check PayPal payment status")
    }
  },
}
